import { createToken, getBearerToken, verifyToken } from '@kibbel/auth';
import type Context from '@kibbel/Context';
import { AuthenticationResponse, User } from '@kibbel/entities';
import {
  AuthenticationArguments,
  ChangePasswordArguments,
  UpdateUserInput,
  UserInput
} from '@kibbel/inputs';
import { AuthenticationError, UserInputError } from 'apollo-server-fastify';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver
} from 'type-graphql';

@Resolver(User)
class UserResolver {
  // Find a User by ID --------------------------------------------------------
  @Authorized()
  @Query(() => User)
  async userInfo(
    @Ctx()
    {
      request: {
        headers: { authorization },
      },
    }: Context
  ) {
    const token = getBearerToken(authorization);
    if (!token)
      throw new AuthenticationError('Request did not contain an access token');

    const payload = verifyToken({
      token,
      tokenType: 'ACCESS',
    });

    if (!payload)
      throw new AuthenticationError(
        'Request contained an invalid access token'
      );

    const user = await User.findOne({ id: payload['id'] });

    if (!user) throw new AuthenticationError('User not found');

    return user;
  }

  // Get all Users ------------------------------------------------------------
  @Query(() => [User])
  users() {
    return User.find();
  }

  // Authorize a User ---------------------------------------------------------
  @Mutation(() => AuthenticationResponse)
  async authorize(
    @Args() { email, password }: AuthenticationArguments,
    @Ctx() { reply }: Context
  ): Promise<AuthenticationResponse> {
    // Check to see if user already exists
    const user = await User.findAndAuthenticate({
      email,
      password,
    });

    if (!user) {
      throw new UserInputError('Incorrect email address or password');
    }

    // Set a cookie with JWT refresh token as payload
    const refreshToken = createToken({ user, tokenType: 'REFRESH' });
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    reply.setCookie('kibbel', refreshToken, {
      maxAge,
    });

    // Return a JWT access token with Authentication Response as payload
    const token = createToken({ user, tokenType: 'ACCESS' });
    return { token, user };
  }

  // Create a User Account ----------------------------------------------------
  @Mutation(() => User)
  async createUser(
    @Arg('data') { password, ...data }: UserInput
  ): Promise<User | false> {
    try {
      const user = User.create({ ...data });
      user.password = password;
      await user.save();

      if (!user) throw new UserInputError('Unable to create new user');
      return user;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // Change User Password -----------------------------------------------------
  @Authorized()
  @Mutation(() => User)
  async changePassword(
    @Args()
    { email, password, newPassword }: ChangePasswordArguments
  ): Promise<User | false> {
    // Verify existing password is correct
    const user = await User.findAndAuthenticate({ email, password });
    if (!user) throw new UserInputError('Existing password is incorrect');

    // Validate new password is distinct from existing password
    if (user && password === newPassword)
      throw new UserInputError(
        'New password cannot be the same as existing password'
      );

    // Assign new password to user
    const data = Object.assign(user, { password: newPassword });
    await user.save({ data });
    return user;
  }

  // Update a User by ID ------------------------------------------------------
  @Authorized()
  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') input: UpdateUserInput) {
    try {
      const user = await User.findOneOrFail({ id });

      // Overwrite fields with new data
      const data = Object.assign(user, input);

      await user.save({ data });
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
