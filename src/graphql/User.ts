import { objectType, extendType } from 'nexus';
import { Prisma } from '@prisma/client';

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id'),
      t.nonNull.string('fullName'),
      t.string('nickname'),
      t.nonNull.string('email'),
      t.nonNull.string('password'),
      t.string('imageUrl');
  },
});

const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('Users', {
      type: User,
      async resolve(parent, args, context, info) {
        const allUsers = await context.prisma.user.findFirst().pets();

        return allUsers;
      },
    });
  },
});

export { User, UserQuery };
