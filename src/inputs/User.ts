import { InputType, ArgsType, Field, Authorized } from 'type-graphql';
import {
  Min,
  Max,
  MaxLength,
  Length,
  ArrayMaxSize,
  IsEmail,
  IsFQDN,
} from 'class-validator';
import { User } from '../entities/';

@InputType({ description: 'Register a new user' })
class CreateUserInput implements Partial<User> {
  @Field()
  @MaxLength(30)
  fullName!: string;

  @Field({ nullable: true })
  @MaxLength(30)
  displayName?: string;

  @Field()
  @IsEmail()
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
  @MaxLength(30)
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

@InputType({ description: 'Log a user in' })
class LogInUserInput implements Partial<User> {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

export { CreateUserInput, UpdateUserInput, LogInUserInput };
