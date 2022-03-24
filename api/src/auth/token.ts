import { sign, verify, JwtPayload } from 'jsonwebtoken';
import type { User } from '@kibbel/entities';

// Type Definitions -----------------------------------------------------------

type TTokenType = {
  tokenType: 'ACCESS' | 'REFRESH';
  secret?: string | undefined;
};

interface IVerifyTokenInput extends TTokenType {
  token: string;
}

interface ICreateTokenInput extends TTokenType {
  user: User;
}

// Verify object is an instance of JwtPayload interface
const isJwtPayload = (_object: any): _object is JwtPayload => {
  return true;
};

// Get token secret environment variable
const getTokenSecret = ({ secret, tokenType }: TTokenType): string => {
  // provide secret argument | ACCESS_TOKEN_SECRET || REFRESH_TOKEN_SECRET
  const secretName = secret ?? `${tokenType}_TOKEN_SECRET`;

  const TOKEN_SECRET = process.env[secretName];
  // Verify a value is assigned to environment variable
  if (!TOKEN_SECRET)
    throw new Error(
      `${tokenType}_TOKEN_SECRET not provided as environment variable`
    );
  return TOKEN_SECRET;
};

// Sign JSON Web Token (JWT) --------------------------------------------------
const createToken = ({
  user: { id, email },
  secret,
  tokenType,
}: ICreateTokenInput) => {
  // Get correct environment secret from tokenType
  const TOKEN_SECRET = getTokenSecret({ tokenType, secret });
  // Token validity duration in seconds
  const expiresIn = {
    REFRESH: 604800, // 7 days
    ACCESS: 900, // 15 minutes
  };
  // Sign JWT
  const token = sign({ id, email }, TOKEN_SECRET, {
    expiresIn: expiresIn[tokenType],
  });
  return token;
};

// Verify JSON Web Token (JWT) ------------------------------------------------
const verifyToken = ({ token, tokenType, secret }: IVerifyTokenInput) => {
  try {
    // Get correct environment secret from tokenType
    const TOKEN_SECRET = getTokenSecret({ tokenType, secret });
    // Verify JWT
    const payload = verify(token, TOKEN_SECRET);
    // Verify payload
    if (!isJwtPayload(payload)) throw new Error('Invalid JWT payload');
    return payload;
  } catch (error) {
    console.log(error);
    return;
  }
};

export {
  createToken,
  verifyToken,
  TTokenType,
  IVerifyTokenInput,
  ICreateTokenInput,
  isJwtPayload,
};
