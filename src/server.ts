// Kibbel API Server ----------------------------------------------------------
import fastify, { FastifyError } from 'fastify';
import chalk from 'chalk';

const server = fastify();

// Environment Variables ------------------------------------------------------
const SERVER_PORT: number =
  typeof process.env.SERVER_PORT === 'string'
    ? parseInt(process.env.SERVER_PORT)
    : 3000;

// Routes ---------------------------------------------------------------------
server.get('/', async (request, reply) => {
  return 'pong\n';
});

const startServer = async () => {
  try {
    await server.listen({ port: SERVER_PORT });
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(chalk.hex('#27CECE')('Kibbel Server'));
    console.log(`Running on port ${port}`);
  } catch (e: unknown) {
    console.log(chalk.red('Kibbel Server'));
    const error = e as FastifyError;
    console.error(error.message);
    process.exit(1);
  }
};

export default startServer;
