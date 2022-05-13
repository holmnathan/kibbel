import { User } from '@kibbel/entities';
import { AuthenticationError } from 'apollo-server-fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AccessToken, getBearerToken } from './auth';

interface IContext {
  request: FastifyRequest;
  reply: FastifyReply;
  user?: User;
  tokenPayload?: AccessToken;
}

const userContext = async ({ request, reply }: IContext): Promise<IContext> => {
  let context: IContext = { request, reply };
  try {
    // Verify request contains an “Authorization” header
    const { authorization } = request.headers;
    if (!authorization) return context;

    const token = getBearerToken(authorization);
    if (!token)
      throw new AuthenticationError(
        'Authorization bearer token missing or invalid'
      );

    // Verify “Authorization” header is from a valid user
    const payload = await AccessToken.verify(token);
    if (!payload) throw new AuthenticationError('Token is invalid or corrupt');
    const { sub: id } = payload;
    const user = await User.findOneOrFail(id);
    context = { ...context, user, tokenPayload: payload };
    reply.log.info(`CONTEXT: Authorized user “${user.email}”`);
  } catch (error) {
    if (error instanceof AuthenticationError)
      reply.log.warn(`CONTEXT: ${error}`);
  } finally {
    return context;
  }
};

export { IContext, userContext };
