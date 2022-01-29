import 'reflect-metadata';
import fastifyPlugin from 'fastify-plugin';
import { createConnection, getConnectionOptions } from 'typeorm';
import * as entities from '../models';

const database = fastifyPlugin(async (server) => {
  try {
    // getConnectionOptions will read from environment variables
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
      options: { encrypt: true },
      entities: [entities.User, entities.Pet],
    });
    const connection = await createConnection(connectionOptions);

    // this object will be accessible from any fastify server instance
    server.decorate('database', {
      user: connection.getRepository(entities.User),
      pet: connection.getRepository(entities.Pet),
    });
  } catch (error) {
    console.log(error);
  }
});

export default database;
