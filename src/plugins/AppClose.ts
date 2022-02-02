import { FastifyInstance } from 'fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';

const fastifyAppClosePlugin = (app: FastifyInstance): ApolloServerPlugin => {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
};

export default fastifyAppClosePlugin;
