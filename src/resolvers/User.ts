import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../entities/';
import { CreateUserInput, UpdateUserInput } from '../inputs';

@Resolver(User)
class UserResolver {
  @Query(() => User)
  user(@Arg('id') id: string) {
    return User.findOne({ where: { id } });
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: CreateUserInput) {
    const user = User.create(data);
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') data: UpdateUserInput) {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      Object.assign(user, data);
      await user.save();
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string) {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      await user.remove();
      return true;
    } catch (error) {
      return error;
    }
  }
}

export { UserResolver };
