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
import { authChecker, verifyToken, createToken } from './auth';
import { User } from './entities';
import fastifyCors from 'fastify-cors';

// Import environment variables

const PORT = process.env.PORT ?? 3000;
const { NODE_ENV } = process.env;

const isProduction = NODE_ENV === 'production';

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
  app.register(fastifyCors, {
    credentials: true,
    origin: 'http://localhost:8282',
  });

  const fastifyCookieOptions: FastifyCookieOptions = {
    parseOptions: {
      domain: 'http://localhost:8282',
      httpOnly: true,
      sameSite: isProduction ? 'strict' : 'lax',
      secure: isProduction,
    },
  };
  app.register(fastifyCookie, fastifyCookieOptions);

  app.listen(PORT, (error) => {
    if (error) app.log.error(error);
  });

  app.post('/refresh-token', async (request, reply) => {
    // Get existing refresh token from request cookie
    const refreshToken = request.cookies.kibbel;
    console.log(refreshToken);

    if (!refreshToken) {
      app.log.warn('Refresh Token not found');
      return { ok: false, token: null };
    }
    const payload = verifyToken({ token: refreshToken, tokenType: 'REFRESH' });
    if (!payload) {
      app.log.warn('Invalid Refresh Token');
      return { ok: false, token: null };
    }

    const user = await User.findOne({ id: payload.id });
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
