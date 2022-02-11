import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUser = async () => {
  try {
    const newUser = await prisma.user.create({
      data: {
        fullName: 'Beatrice Arthur',
        nickname: 'Bea',
        email: 'bea@arthur.com',
        password: '12345',
        pets: {
          create: {
            name: 'Fluffy',
            birthDate: new Date(Date.now()),
            intact: true,
            species: 'dog',
            sex: 'male',
            mealPlan: {
              create: {
                name: 'Breakfast',
              },
            },
            dietType: {
              create: {
                name: 'Maintain Weight',
                multiplier: 1,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

const getAllUsers = async () => {
  try {
    const allUsers = await prisma.user.findFirst().pets();
    console.log(allUsers);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

// createUser();
getAllUsers();
