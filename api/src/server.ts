// Kibbel API Server ----------------------------------------------------------

// Import NPM Packages
import { AccessToken, authChecker, RefreshToken } from '@kibbel/auth';
import { User } from '@kibbel/entities';
import { appClose, database } from '@kibbel/plugins';
// Import Local Packages
import { UserAuthenticationResolver, UserResolver } from '@kibbel/resolvers';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ApolloServerFastifyConfig } from 'apollo-server-fastify';
import chalk from 'chalk';
import Fastify, { FastifyServerOptions } from 'fastify';
import fastifyCookie, { FastifyCookieOptions } from 'fastify-cookie';
import fastifyCors, { FastifyCorsOptions } from 'fastify-cors';
import fastifyRedis, { FastifyRedisPluginOptions } from 'fastify-redis';
import type { PrettyOptions } from 'fastify/types/logger';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { userContext } from './Context';

// Environment variables ------------------------------------------------------
const PORT = process.env.PORT ?? 3000;
const CORS_ORIGIN_CLIENTS = process.env.CORS_ORIGIN_CLIENTS.split(',');
const isProduction = process.env.NODE_ENV === 'production';

const prettyPrintOptions: PrettyOptions = {
  translateTime: 'Sys:h:MM:ss TT',
  ignore: 'pid,hostname',
  levelFirst: true,
};

const options: FastifyServerOptions = {
  logger: {
    prettyPrint: !isProduction ? prettyPrintOptions : false,
  },
};
const fastify = Fastify(options);

const { log } = fastify;

// Create Fastify Server  -----------------------------------------------------
const createServer = async () => {
  // Instantiate Fastify Server

  const apolloServerOptions: ApolloServerFastifyConfig = {
    schema: await buildSchema({
      resolvers: [UserResolver, UserAuthenticationResolver],
      authChecker,
      dateScalarMode: 'timestamp',
    }),
    plugins: [
      appClose(fastify),
      ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
    ],
    context: userContext,
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
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 Days in seconds
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  };

  const fastifyRedisOptions: FastifyRedisPluginOptions = {};

  fastify.register(fastifyRedis, fastifyRedisOptions);
  fastify.register(fastifyCors, fastifyCorsOptions);
  fastify.register(database);
  fastify.register(server.createHandler({ cors: false })); // Apollo defers to CORS options in Fastify
  fastify.register(fastifyCookie, fastifyCookieOptions);

  // Refresh Token Route
  fastify.post('/refresh-token', async (request, reply) => {
    // Get existing refresh token from request cookie
    const cookieToken = request.cookies['kibbel'];

    try {
      if (!cookieToken) throw new Error('No valid refresh cookie in request');
      const refreshToken = await RefreshToken.verify(cookieToken);
      if (!refreshToken) throw new Error('Unable to validate refresh cookie');

      const isRevoked = await refreshToken.revoke();
      if (!isRevoked) throw new Error();

      const { sub: id } = refreshToken;
      const user = id ? await User.findOneOrFail({ id }) : null;
      if (!user) {
        throw new Error('Unable to locate user from refresh token');
      }

      // Refresh token is valid:
      // Create a new refresh token and set as a cookie on client
      const refreshtoken = new RefreshToken(user).generate();
      reply.cookie('kibbel', refreshtoken);

      // Create a new access token and return to client
      const token = new AccessToken(user).generate();
      return { ok: true, token };
    } catch (error) {
      reply.clearCookie('kibbel');
      reply.code(401);
      throw error;
    }
  });

  fastify.listen(PORT, (error) => {
    if (error) log.error(error);
  });
};

// Start Fastify Server  ------------------------------------------------------
const startServer = async () => {
  try {
    await createServer();
    console.error(chalk.greenBright('\nKibbel Server'));
  } catch (error) {
    console.error(chalk.red('Kibbel Server'));
    console.error(error);
    process.exit(1);
  }
};
export { startServer, fastify };
