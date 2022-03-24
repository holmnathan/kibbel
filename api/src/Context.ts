import type { FastifyReply, FastifyRequest } from 'fastify';
import type { User } from '@kibbel/entities';

interface Context {
  request: FastifyRequest;
  reply: FastifyReply;
  payload?: User;
}

export default Context;
