import { InputType, ArgsType, Field } from 'type-graphql';
import { MaxLength, IsEmail, IsFQDN } from 'class-validator';
import { User } from '../entities/';

@InputType({ description: 'Register a new user' })
class CreateUserInput implements Partial<User> {
  @Field()
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
