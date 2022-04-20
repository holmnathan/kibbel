import * as entities from '@kibbel/entities';
import fastifyPlugin from 'fastify-plugin';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';

const {
  User,
  Pet,
  Diet,
  Food,
  Serving,
  Meal,
  MealPlan,
  Weight,
  DietRestriction,
} = entities;

const database = fastifyPlugin(async (server) => {
  try {
    // getConnectionOptions will read from environment variables
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
      options: { encrypt: true },
      entities: [
        User,
        Pet,
        Diet,
        Food,
        Serving,
        Meal,
        MealPlan,
        Weight,
        DietRestriction,
      ],
    });
    const connection = await createConnection(connectionOptions);

    // this object will be accessible from any fastify server instance
    server.decorate('database', {
      user: connection.getRepository(User),
      pet: connection.getRepository(Pet),
      diet: connection.getRepository(Diet),
      food: connection.getRepository(Food),
      serving: connection.getRepository(Serving),
      meal: connection.getRepository(Meal),
      mealPlan: connection.getRepository(MealPlan),
      weight: connection.getRepository(Weight),
      dietRestriction: connection.getRepository(DietRestriction),
    });
  } catch (error) {
    console.log(error);
  }
});

export default database;
export { database };
