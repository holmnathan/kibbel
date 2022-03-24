// Kibbel API Server ----------------------------------------------------------

// Import NPM Packages
import 'reflect-metadata';
import chalk from 'chalk';
import { buildSchema } from 'type-graphql';
import fastify, { FastifyServerOptions } from 'fastify';
import fastifyCookie, { FastifyCookieOptions } from 'fastify-cookie';
import fastifyCors, { FastifyCorsOptions } from 'fastify-cors';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ApolloServerFastifyConfig } from 'apollo-server-fastify';

// Import Local Packages
import { UserResolver } from '@kibbel/resolvers';
import { database, appClose } from '@kibbel/plugins';
import { authChecker, verifyToken, createToken } from '@kibbel/auth';
import { User } from '@kibbel/entities';

// Environment variables ------------------------------------------------------
const PORT = process.env.PORT ?? 3000;
const CORS_ORIGIN_CLIENTS = process.env.CORS_ORIGIN_CLIENTS.split(',');
const isProduction = process.env.NODE_ENV === 'production';

// Create Fastify Server  -----------------------------------------------------
const createServer = async (options: FastifyServerOptions = {}) => {
  // Instantiate Fastify Server
  const app = fastify(options);

  const apolloServerOptions: ApolloServerFastifyConfig = {
    schema: await buildSchema({
      resolvers: [UserResolver],
      authChecker,
    }),
    plugins: [
      appClose(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
    context: ({ request, reply }) => ({
      request,
      reply,
    }),
    introspection: !isProduction,
  };

  // Instantiate Apollo Server
  const server = new ApolloServer(apolloServerOptions);
  await server.start();

  // Register Fastify Plugins

  const fastifyCorsOptions: FastifyCorsOptions = {
    credentials: true,
    origin: CORS_ORIGIN_CLIENTS,
  };

  const fastifyCookieOptions: FastifyCookieOptions = {
    parseOptions: {
      httpOnly: true,
      sameSite: isProduction ? 'strict' : 'lax',
      secure: isProduction,
      path: '/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
      expires: new Date('2022-12-31'),
    },
  };

  app.register(fastifyCors, fastifyCorsOptions);
  app.register(database);
  app.register(server.createHandler({ cors: false })); // Apollo defers to CORS options in Fastify
  app.register(fastifyCookie, fastifyCookieOptions);

  // Refresh Token Route
  app.post('/refresh-token', async (request, reply) => {
    // Get existing refresh token from request cookie
    const refreshToken = request.cookies['kibbel'];
    console.log(refreshToken);

    // Verify cookie from request
    if (!refreshToken) {
      app.log.warn('Refresh Token not found');
      return { ok: false, token: null };
    }
    const payload = verifyToken({ token: refreshToken, tokenType: 'REFRESH' });
    if (!payload) {
      app.log.warn('Invalid Refresh Token');
      return { ok: false, token: null };
    }

    const user = await User.findOne({ id: payload['id'] });
    if (!user) {
      app.log.warn('Invalid Refresh Token');
      return { ok: false, token: null };
    }

    // Refresh token is valid:
    // Create a new refresh token and set as a cookie on client
    const refreshtoken = createToken({
      user,
      tokenType: 'REFRESH',
    });

    reply.cookie('kibbel', refreshtoken);

    // Create a new access token and return to client
    const token = createToken({ user, tokenType: 'ACCESS' });
    return { ok: true, token };
  });

  app.listen(PORT, (error) => {
    if (error) app.log.error(error);
  });
};

// Start Fastify Server  ------------------------------------------------------
const startServer = async () => {
  try {
    await createServer({
      logger: {
        prettyPrint: !isProduction
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
