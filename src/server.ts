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

// Import environment variables

const SERVER_PORT =
  process.env.SERVER_PORT && parseInt(process.env.SERVER_PORT)
    ? process.env.SERVER_PORT
    : 3000;
const ENVIRONMENT = process.env.ENVIRONMENT ?? 'production';

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

  app.listen(SERVER_PORT, (error, appUrl) => {
    if (error) app.log.error(error);
  });
};

const startServer = async () => {
  try {
    await createServer({
      logger: {
        prettyPrint:
          ENVIRONMENT === 'development'
            ? {
                translateTime: 'Sys:h:MM:ss TT',
                ignore: 'pid,hostname',
                levelFirst: true,
              }
            : false,
      },
    });
    console.error(chalk.greenBright('Kibbel Server'));
  } catch (error) {
    console.error(chalk.red('Kibbel Server'));
    console.error(error);
    process.exit(1);
  }
};

export default startServer;
