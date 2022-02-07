import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
  Ctx,
  Authorized,
} from 'type-graphql';
import { User, LoginResponse } from '../entities/';
import { CreateUserInput, UpdateUserInput, LogInUserArgs } from '../inputs';
import { hash, compare } from 'bcrypt';
import Context from '../Context';
import { createAccessToken, createRefreshToken } from '../auth';

@Resolver(User)
class UserResolver {
  // Find a User by ID --------------------------------------------------------
  @Query(() => User)
  user(@Arg('id') id: string) {
    return User.findOne({ where: { id } });
  }

  // Get all Users ------------------------------------------------------------
  @Query(() => [User])
  users() {
    return User.find();
  }

  // Log In a User ------------------------------------------------------------
  @Mutation(() => LoginResponse)
  async logInUser(
    @Args() { email, password }: LogInUserArgs,
    @Ctx() { reply }: Context
  ): Promise<LoginResponse> {
    // Check to see if user already exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Incorrect email address or password');
    }

    // Compare passwords
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Incorrect email address or password');
    }

    // Set a cookie with JWT refresh token as payload
    const refreshToken = createRefreshToken(user);
    reply.setCookie('kibbel', refreshToken, {
      httpOnly: true,
    });

    // Return a JWT access token with LoginResponse as payload
    const accessToken = createAccessToken(user);
    return { accessToken };
  }

  // Register a User ----------------------------------------------------------
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

  // Update a User by ID ------------------------------------------------------
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

  // Delete a User by ID ------------------------------------------------------
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
