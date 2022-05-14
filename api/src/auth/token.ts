import type { User } from '@kibbel/entities';
import { fastify } from '@kibbel/server';
import { randomUUID } from 'crypto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

class TokenVerifyError extends Error {
  type;
  constructor(type: TTokenType, message: string) {
    super(message);
    this.type = type;
  }
}

// Environment Variables
const tokenTypeList: TTokenTypeList = {
  ACCESS: {
    duration: Number(process.env.ACCESS_TOKEN_DURATION) ?? 900, // 15 minutes
    secret: process.env['ACCESS_TOKEN_SECRET'],
  },
  ID: {
    duration: Number(process.env.ID_TOKEN_DURATION) ?? 900, // 15 minutes
    secret: process.env['ID_TOKEN_SECRET'],
  },
  REFRESH: {
    duration: Number(process.env.REFRESH_TOKEN_DURATION) ?? 604800, // 7 days
    secret: process.env['REFRESH_TOKEN_SECRET'],
    reuseInterval: Number(process.env.REFRESH_TOKEN_INTERVAL) ?? 60, // 60 seconds
  },
};

// Confirm token secrets are set in environment variables
let tokenType: keyof TTokenTypeList;
for (tokenType in tokenTypeList) {
  const { secret } = tokenTypeList[tokenType];
  if (!secret)
    throw new ReferenceError(
      `${tokenType}_TOKEN_SECRET environment variable not defined`
    );
}

// Type Definitions -----------------------------------------------------------
type TTokenType = 'ACCESS' | 'REFRESH' | 'ID';
type TTokenTypeOptions = {
  duration: number;
  secret: string;
  reuseInterval?: number;
};
type TTokenTypeList = Record<TTokenType, TTokenTypeOptions>;

type TTokenPayload = JwtPayload & Partial<User>;

const getBearerToken = (authHeader?: string): string | undefined => {
  if (!authHeader) return;

  // Remove “Bearer ” prefix from authorization header
  const regEx = /^(?<bearer>[Bb])earer (?<token>\b.+$)/g;
  const { bearer, token } = regEx.exec(authHeader)?.groups ?? {};

  if (bearer !== bearer?.toUpperCase())
    fastify.log.warn(
      'Authorization header does not conform to “Bearer” authentication scheme\n“Bearer” text should be title case\nSee https://datatracker.ietf.org/doc/html/rfc6750#section-2.1'
    );
  return token;
};

interface ITokenConstructor {
  new (payload: TTokenPayload): IToken;
  type: TTokenType;
  verify<Type extends typeof Token>(
    this: Type,
    token: string
  ): InstanceType<Type> | Promise<InstanceType<Type>>;
  readonly prototype: IToken;
}

interface IToken extends JwtPayload {
  generate(): string;
  get tokenSettings(): TTokenTypeOptions;
}

interface IAuthenticationToken extends IToken {
  revoke?(): Promise<boolean>;
}

const Token: ITokenConstructor = class Token implements IToken {
  static type: TTokenType;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  iat?: number | undefined;
  iss?: string | undefined;
  jti?: string | undefined;
  nbf?: number | undefined;
  sub?: string | undefined;

  constructor(payload: TTokenPayload) {
    const { type } = this.constructor as typeof Token;
    const { duration: tokenDuration } = tokenTypeList[type];

    const currentUnixTime = Math.floor(Date.now() / 1000);

    this.aud = payload.aud;
    this.exp = currentUnixTime + tokenDuration;
    this.iat = currentUnixTime;
    this.iss = payload.iss;
    this.jti = payload.jti;
    this.nbf = currentUnixTime;
    this.sub = !!payload.sub ? payload.sub : payload.id;
  }

  get tokenSettings() {
    const { type: tokenType } = this.constructor as typeof Token;
    return tokenTypeList[tokenType];
  }

  public generate(): string {
    const { secret } = this.tokenSettings;
    return sign({ ...this }, secret);
  }

  static verify<Type extends typeof Token>(
    this: Type,
    token: string
  ): InstanceType<Type> | Promise<InstanceType<Type>> {
    // Verify JWT
    const { type: tokenType } = this;
    const { secret } = tokenTypeList[tokenType];

    try {
      const payload = verify(token, secret);

      if (typeof payload !== 'object')
        throw new TokenVerifyError(tokenType, 'Token is invalid');

      return new this(payload) as InstanceType<Type>;
    } catch (exception) {
      if (exception instanceof TokenVerifyError) throw exception;

      console.error(exception);
      throw new TokenVerifyError(tokenType, 'Token Verificaton Failed');
    }
  }
};

class AuthenticationToken extends Token implements IAuthenticationToken {
  public override generate(): string {
    const { secret } = this.tokenSettings;
    this.jti = randomUUID();
    return sign({ ...this }, secret);
  }

  static override async verify<Type extends typeof Token>(
    this: Type,
    token: string
  ): Promise<InstanceType<Type>> {
    const { log, redis } = fastify;
    const { type: tokenType } = this;
    const { secret: tokenSecret } = tokenTypeList[tokenType];

    try {
      // Verify JWT
      const payload = verify(token, tokenSecret);
      if (typeof payload !== 'object')
        throw new TokenVerifyError(tokenType, 'Token is invalid');
      if (!payload.jti)
        throw new TokenVerifyError(
          tokenType,
          'Token missing a unique JTI UUID'
        );

      const revokedToken = await redis.hgetall(payload.jti);
      if (!revokedToken || Object.entries(revokedToken).length === 0)
        return new this(payload) as InstanceType<Type>;

      const invalidAt = new Date(Number(revokedToken['invalidAt']));
      const currentTime = new Date();

      if (invalidAt <= currentTime)
        throw new TokenVerifyError(
          tokenType,
          `Reuse detected. Token invalidated at ${invalidAt.toLocaleString()}`
        );

      log.warn(
        `${tokenType} TOKEN: Reuse detected. Token valid until ${invalidAt.toLocaleString()}`
      );

      return new this(payload) as InstanceType<Type>;
    } catch (exception) {
      if (exception instanceof TokenVerifyError) throw exception;

      console.error(exception);
      throw new TokenVerifyError(tokenType, 'Token Verificaton Failed');
    }
  }

  public async revoke(): Promise<boolean> {
    const { log, redis } = fastify;
    const { jti, exp } = this;
    const { type: tokenType } = this.constructor as typeof Token;

    if (!jti) {
      log.error(`${tokenType} TOKEN: Unable to revoke. Missing unique JTI`);
      return false;
    }

    const { reuseInterval } = this.tokenSettings;

    const isRevoked = await redis.hget(jti, 'invalidAt');

    if (isRevoked) {
      log.warn(`${tokenType} TOKEN: Already Revoked. ${jti}`);
      return true;
    }

    const revokedToken = await redis.hset(jti, [
      'user',
      this.sub,
      'invalidAt',
      reuseInterval ? reuseInterval * 1000 + Date.now() : Date.now(),
    ]);

    if (revokedToken) await redis.expireat(jti, Math.ceil(exp!));

    log.info(`${tokenType} TOKEN: Revoked. ${jti}`);
    return true;
  }
}

class AccessToken extends AuthenticationToken {
  static override type: TTokenType = 'ACCESS';
}

class IDToken extends Token implements TTokenPayload {
  static override type: TTokenType = 'ID';
  birthdate?: Date;
  createdAt?: Date;
  email?: string;
  email_verified?: boolean;
  locale?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  updatedAt?: Date;
  constructor(payload: TTokenPayload) {
    super(payload);
    if (payload.birthdate) this.birthdate = payload.birthdate;
    if (payload.createdAt) this.createdAt = payload.createdAt;
    if (payload.email) this.email = payload.email;
    if (payload.email_verified) this.email_verified = payload.email_verified;
    if (payload.locale) this.locale = payload.locale;
    if (payload.name) this.name = payload.name;
    if (payload.nickname) this.nickname = payload.nickname;
    if (payload.picture) this.picture = payload.picture;
    if (payload.updatedAt) this.updatedAt = payload.updatedAt;
  }
}

class RefreshToken extends AuthenticationToken {
  static override type: TTokenType = 'REFRESH';
}

export { TTokenType, AccessToken, RefreshToken, IDToken, getBearerToken };
