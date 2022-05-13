import type {
  DoneFuncWithErrOrRes,
  FastifyInstance,
  FastifyPluginCallback
} from 'fastify';
import Redis from 'ioredis';
import 'reflect-metadata';

const fastifyRedis: FastifyPluginCallback = (fastify, options, done) => {
  try {
    const client = new Redis(options);

    fastify.decorate('redis', client);
    fastify.addHook('onClose', close);
  } catch (error) {
    console.log(error);
  }

  done();
};

const close = (fastify: FastifyInstance, done: DoneFuncWithErrOrRes) => {
  fastify.redis.quit(done);
};

export { fastifyRedis };
