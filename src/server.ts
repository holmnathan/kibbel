// Kibbel API Server ----------------------------------------------------------
import 'reflect-metadata';
import fastify, { FastifyServerOptions } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import chalk from 'chalk';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers';
import database from './plugins/database';
import fastifyAppClosePlugin from './plugins/AppClose';

const createServer = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);

  const schema = await buildSchema({ resolvers: [UserResolver] });
  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  });

  await server.start();
  app.register(server.createHandler());
  app.register(database);
  const SERVER_PORT = process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : 3000;
  app.listen(SERVER_PORT);
};

const startServer = async () => {
  try {
    await createServer({ logger: true });
    console.log(chalk.hex('#27CECE')('Kibbel Server'));
  } catch (error) {
    console.error(chalk.red('Kibbel Server'));
    console.error(error);
    process.exit(1);
  }
};

export default startServer;
