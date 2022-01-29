import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient;
}

const context: Context = {
  prisma,
};

export { prisma, context, Context };
