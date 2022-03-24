import { InputType, ArgsType, Field } from 'type-graphql';
import {
  MaxLength,
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  ValidationArguments,
} from 'class-validator';
import { IsUserUnique } from '../plugins/IsUserUnique';
import { User } from '../entities/';

@InputType({ description: 'Register a new user' })
class CreateUserInput implements Partial<User> {
  @Field()
  @IsNotEmpty({ message: 'Enter a full name' })
  fullName!: string;

  @Field({ nullable: true })
  @MaxLength(32, {
    message: ({ constraints }: ValidationArguments) => {
      return `Display name must be ${constraints[0]} characters or less`;
    },
  })
  displayName?: string;

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
  imageUrl?: string;
}

@InputType({ description: 'Update an existing user profile' })
class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  displayName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @IsFQDN()
  imageUrl?: string;
}

@ArgsType()
class LogInUserArgs {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

export { CreateUserInput, UpdateUserInput, LogInUserArgs };
