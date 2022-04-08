import { createToken, verifyToken } from '@kibbel/auth';
import type Context from '@kibbel/Context';
import { SigninResponse, User } from '@kibbel/entities';
import {
  CreateUserInput, LogInUserArgs, UpdateUserInput
} from '@kibbel/inputs';
import { AuthenticationError, UserInputError } from 'apollo-server-fastify';
import { compare, hash } from 'bcrypt';
import {
  Arg, Args, Authorized, Ctx, Mutation, Query, Resolver
} from 'type-graphql';

@Resolver(User)
class UserResolver {
  // Find a User by ID --------------------------------------------------------
  @Authorized()
  @Query(() => User)
  async currentUser(
    @Ctx()
    { request: { headers } }: Context
  ) {
    if (!headers.authorization)
      throw new AuthenticationError('Request did not contain an access token');
    const payload = verifyToken({
      token: headers.authorization,
      tokenType: 'ACCESS',
    });

    const user = await User.findOne({ id: payload!['id'] });

    if (!user) throw new UserInputError('User not found with ID');

    return user;
  }

  // Get all Users ------------------------------------------------------------
  @Query(() => [User])
  users() {
    return User.find();
  }

  // Log In a User ------------------------------------------------------------
  @Mutation(() => SigninResponse)
  async signInUser(
    @Args() { email, password }: LogInUserArgs,
    @Ctx() { reply }: Context
  ): Promise<SigninResponse> {
    // Check to see if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserInputError('Incorrect email address or password');
    }

    // Compare passwords
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new UserInputError('Incorrect email address or password');
    }

    // Set a cookie with JWT refresh token as payload
    const refreshToken = createToken({ user, tokenType: 'REFRESH' });
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    reply.setCookie('kibbel', refreshToken, {
      maxAge,
    });

    // Return a JWT access token with SigninResponse as payload
    const token = createToken({ user, tokenType: 'ACCESS' });
    return { token, user };
  }

  // Create a User Account ----------------------------------------------------
  @Mutation(() => User)
  async createUser(
    @Arg('data') { password }: CreateUserInput,
    @Arg('data') data: CreateUserInput
  ): Promise<User | false> {
    const user = User.create(data);
    user['password'] = await hash(password, 10);

    await user.save();

    if (!user) throw new UserInputError('Testing 1234');

    return user;
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