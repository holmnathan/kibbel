import { AccessToken, IDToken, RefreshToken } from '@kibbel/auth';
import type { IContext } from '@kibbel/Context';
import {
  AllUsersResponse,
  AuthenticationResponse,
  IDTokenResponse,
  User
} from '@kibbel/entities';
import {
  AuthenticationArguments,
  UpdateUserInput,
  UserInput
} from '@kibbel/inputs';
import { AuthenticationError, UserInputError } from 'apollo-server-fastify';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root
} from 'type-graphql';

@Resolver(() => AuthenticationResponse)
class UserAuthenticationResolver
  implements ResolverInterface<AuthenticationResponse>
{
  // Authorize a User ---------------------------------------------------------
  @Mutation(() => AuthenticationResponse, {
    description: 'Authorizes an end user, and sets OIDC tokens',
  })
  async authorize(
    @Args() { email, password }: AuthenticationArguments
  ): Promise<AuthenticationResponse> {
    // Check to see if user already exists
    const user = await User.findAndAuthenticate({
      email,
      password,
    });
    return { user };
  }

  @FieldResolver()
  id_token(@Root() { user }: AuthenticationResponse): string {
    // Return an end user ID token
    return new IDToken(user).generate();
  }

  @FieldResolver()
  token(@Root() { user }: AuthenticationResponse): string {
    // Return a JWT access token
    return new AccessToken(user).generate();
  }

  @FieldResolver()
  refresh_token(
    @Root() { user }: AuthenticationResponse,
    @Ctx() { reply }: IContext
  ): boolean {
    const refreshToken = new RefreshToken(user).generate();
    // Set a cookie with JWT refresh token as payload
    try {
      reply.setCookie('kibbel', refreshToken);
      return true;
    } catch (error) {
      reply.log.error(error);
      return false;
    }
  }
}

@Resolver(User)
class UserResolver {
  // Get authorized user info as an ID token ----------------------------------
  @Authorized()
  @Query(() => IDTokenResponse)
  async userInfo(
    @Ctx()
    { user }: IContext
  ): Promise<IDTokenResponse> {
    try {
      if (!user)
        throw new AuthenticationError('Unable to validate user from context');
      // Return an end user ID token
      const id_token = new IDToken(user).generate();
      return { id_token };
    } catch (exception) {
      if (exception instanceof AuthenticationError) throw exception;
      return {};
    }
  }

  // Get all Users ------------------------------------------------------------
  @Authorized()
  @Query(() => [AllUsersResponse])
  users() {
    return User.find();
  }

  // Create a User Account ----------------------------------------------------
  @Mutation(() => User)
  async createUser(
    @Arg('data') { ...data }: UserInput
  ): Promise<User | undefined> {
    try {
      const user = User.create(data);
      await user.save();
      return user;
    } catch (error) {
      if (error instanceof UserInputError) throw error;
      return;
    }
  }

  // Change User Password -----------------------------------------------------
  @Authorized()
  @Mutation(() => User)
  async changePassword(
    @Arg('password') password: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { user }: IContext
  ): Promise<User | false> {
    const { email } = user!;
    try {
      // Verify existing password is correct
      const user = await User.findAndAuthenticate({ email, password });

      // Validate new password is distinct from existing password
      if (user && password === newPassword)
        throw new UserInputError(
          'New password cannot be the same as existing password'
        );

      // Assign new password to user
      const data = Object.assign(user, { password: newPassword });
      await user.save({ data });
      return user;
    } catch (error) {
      if (error instanceof UserInputError) throw error;
      return false;
    }
  }

  // Update the authorized User -----------------------------------------------
  @Authorized()
  @Mutation(() => User)
  async updateUser(
    @Ctx() { user }: IContext,
    @Args() { ...updatedUser }: UpdateUserInput
  ) {
    try {
      // Overwrite fields with new data
      const data = Object.assign(user, updatedUser);

      await user!.save({ data });
      return user;
    } catch (error) {
      return error;
    }
  }

  // Delete the authorized user -----------------------------------------------
  @Authorized()
  @Mutation(() => Boolean)
  async deleteUser(@Ctx() { user }: IContext) {
    try {
      await user!.remove();
      return true;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async revoke(
    @Ctx()
    {
      request: {
        cookies: { kibbel: refreshToken },
      },
      reply,
      tokenPayload,
    }: IContext
  ) {
    try {
      await tokenPayload?.revoke();

      if (refreshToken) {
        const refreshPayload = await RefreshToken.verify(refreshToken);

        if (refreshPayload) await refreshPayload.revoke();

        reply.clearCookie('kibbel');
        return true;
      }
    } catch (error) {
      return error;
    }
  }
}

export { UserResolver, UserAuthenticationResolver };
