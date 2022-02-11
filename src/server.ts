// Kibbel API Server ----------------------------------------------------------
import 'reflect-metadata';
import fastify, { FastifyServerOptions } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import chalk from 'chalk';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers';
import { database, appClose } from './plugins';
import fastifyCookie, { FastifyCookieOptions } from 'fastify-cookie';
import {
  authChecker,
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from './auth';
import { User } from './entities';

// Import environment variables

const PORT = process.env.PORT ?? 3000;
const { NODE_ENV, REFRESH_TOKEN_SECRET } = process.env;

const createServer = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker,
  });
  const server = new ApolloServer({
    schema,
    plugins: [
      appClose(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
    context: ({ request, reply }) => ({ request, reply }),
    introspection: NODE_ENV !== 'production',
  });

  await server.start();
  app.register(server.createHandler());
  app.register(database);
  app.register(fastifyCookie, {
    secret: REFRESH_TOKEN_SECRET,
  } as FastifyCookieOptions);

  app.listen(PORT, (error) => {
    if (error) app.log.error(error);
  });

  app.post('/refresh-token', async (request, reply) => {
    const refreshToken = request.cookies.kibbel;
    if (!refreshToken) {
      app.log.warn('Refresh Token not found');
      return { ok: false, accessToken: null };
    }
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      app.log.warn('Refresh Token not valid');
      return { ok: false, accessToken: null };
    }

    const user = await User.findOne({ id: payload.id });
    if (!user) {
      app.log.warn('Refresh Token not valid');
      return { ok: false, accessToken: null };
    }
    reply.cookie('kibbel', createRefreshToken(user), { httpOnly: true });
    return { ok: true, accessToken: createAccessToken(user) };
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
