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
class CreateUserInput implements Partial<User> {
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
  password!: string;

  @Field({ nullable: true })
  @IsFQDN()
  picture?: string;
}

@InputType({ description: 'Update an existing user profile' })
class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  nickname?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @IsFQDN()
  picture?: string;
}

@ArgsType()
class AuthenticationArguments {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

export { CreateUserInput, UpdateUserInput, AuthenticationArguments };
