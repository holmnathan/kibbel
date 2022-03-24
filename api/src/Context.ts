import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from './entities/';

interface Context {
  request: FastifyRequest;
  reply: FastifyReply;
  payload?: User;
}

export default Context;
