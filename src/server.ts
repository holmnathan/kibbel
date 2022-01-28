// Kibbel API Server ----------------------------------------------------------
import fastify, {
  FastifyError,
  FastifyServerOptions,
  FastifyInstance,
} from 'fastify';
import chalk from 'chalk';

const createServer = (options: FastifyServerOptions = {}): FastifyInstance => {
  const server = fastify(options);

  server.get('/', async (request, reply) => {
    return 'pong\n';
  });

  return server;
};

const startServer = async () => {
  const server = createServer({ logger: true });
  try {
    const SERVER_PORT = process.env.SERVER_PORT
      ? parseInt(process.env.SERVER_PORT)
      : 3000;
    await server.listen(SERVER_PORT);
    console.log(chalk.hex('#27CECE')('Kibbel Server'));
    console.log(`Running on port ${SERVER_PORT}`);
  } catch (error) {
    console.log(chalk.red('Kibbel Server'));
    server.log.error(error);
    process.exit(1);
  }
};

export default startServer;
