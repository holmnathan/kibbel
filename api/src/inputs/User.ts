import type { User } from '@kibbel/entities';
import { IsUserUnique } from '@kibbel/plugins';
import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  MaxLength,
  ValidationArguments
} from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType({ description: 'Register a new user' })
class UserInput implements Partial<User> {
  @Field()
  @IsNotEmpty({ message: 'Enter a full name' })
  name!: string;

  @Field({ nullable: true })
  @MaxLength(32, {
    message: ({ constraints }: ValidationArguments) => {
      return `Display name must be ${constraints[0]} characters or less`;
    },
  })
  nickname?: string;

  @Field()
  @IsEmail([], { message: 'Enter a valid email address' })
  @IsUserUnique({
    message: 'This email address is not available. Use a different address',
  })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Enter a password' })
  password!: string;

  @Field({ nullable: true })
  @IsFQDN()
  picture?: string;
}

@ArgsType()
class UpdateUserInput implements Omit<Partial<User>, 'password'> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  nickname?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsFQDN()
  picture?: string;
}

@ArgsType()
class AuthenticationArguments implements Partial<User> {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@ArgsType()
class ChangePasswordArguments extends AuthenticationArguments {
  @Field()
  newPassword!: string;
}

export {
  UserInput,
  UpdateUserInput,
  AuthenticationArguments,
  ChangePasswordArguments,
};
