import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { User, LoginResponse } from '../entities/';
import { CreateUserInput, UpdateUserInput, LogInUserInput } from '../inputs';
import { hash, compare } from 'bcrypt';
import { sign as jwtSign } from 'jsonwebtoken';

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

  @Mutation(() => LoginResponse)
  async logInUser(
    @Arg('credentials') { email, password }: LogInUserInput
  ): Promise<LoginResponse> {
    const existingUser = await User.findOne({ where: { email } });
    const { JWT_SECRET } = process.env;
    let isValidPassword: boolean;
    let token: string;

    if (typeof JWT_SECRET !== 'string') {
      console.log('JWT_SECRET environment variable is undefined');
      throw new Error('Server Error');
    }

    if (!existingUser) throw new Error('Incorrect email address or password');

    isValidPassword = await compare(password, existingUser.password);

    if (!isValidPassword) {
      throw new Error('Incorrect email address or password');
    }

    token = jwtSign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: 900 }
    );
    return { token };
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data') { email, password }: CreateUserInput,
    @Arg('data') data: CreateUserInput
  ): Promise<User | false> {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new Error('User account already exists');

      const user = User.create(data);
      user.password = await hash(password, 10);

      await user.save();
      return user;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => User)
  @Authorized()
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
      return error;
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
