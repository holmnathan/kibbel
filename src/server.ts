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
import fastifyCookie, { FastifyCookieOptions } from 'fastify-cookie';
import { authChecker } from './auth';

// Import environment variables

const PORT = process.env.PORT ?? 3000;
const { NODE_ENV, COOKIE_SECRET } = process.env;

const createServer = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker,
  });
  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
    context: ({ request, reply }) => ({ request, reply }),
  });

  await server.start();
  app.register(server.createHandler());
  app.register(database);
  app.register(fastifyCookie, {
    secret: COOKIE_SECRET,
  } as FastifyCookieOptions);

  app.listen(PORT, (error, appUrl) => {
    if (error) app.log.error(error);
  });
};

const startServer = async () => {
  try {
    await createServer({
      logger: {
        prettyPrint:
          NODE_ENV === 'development'
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
