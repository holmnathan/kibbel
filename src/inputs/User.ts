import { InputType, ArgsType, Field } from 'type-graphql';
import {
  Min,
  Max,
  MaxLength,
  Length,
  ArrayMaxSize,
  IsEmail,
  IsFQDN,
} from 'class-validator';

@InputType()
class CreateUserInput {
  @Field()
  @MaxLength(30)
  fullName!: string;

  @Field({ nullable: true })
  @MaxLength(30)
  chosenName?: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  @IsFQDN()
  imageUrl?: string;
}

@InputType()
class UpdateUserInput {
  @Field({ nullable: true })
  @MaxLength(30)
  fullName?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  chosenName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @IsFQDN()
  imageUrl?: string;
}

export { CreateUserInput, UpdateUserInput };
