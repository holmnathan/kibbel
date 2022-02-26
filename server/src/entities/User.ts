import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { BaseUuid, Pet, Food } from '.';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, @[*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  fullName: 'The user’s full or legal name(s)',
  displayName: 'The user’s preferred way to be addressed',
  imageUrl: 'URL of user’s uploaded profile image',
};

@Entity()
@ObjectType({ description: 'User Schema' })
class User extends BaseUuid {
  @Field({
    description: sharedComments.fullName,
  })
  @Column({ comment: sharedComments.fullName })
  fullName!: string;

  @Field({
    nullable: true,
    description: sharedComments.displayName,
  })
  @Column({ comment: sharedComments.displayName, nullable: true })
  displayName?: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field({
    nullable: true,
    description: sharedComments.imageUrl,
  })
  @Column({ comment: sharedComments.imageUrl, nullable: true })
  imageUrl?: string;

  // Relational fields

  // User can have many pets
  @OneToMany(() => Pet, (pet) => pet.user)
  pets!: Pet[];

  // Many users can favorite many foods
  @Field(() => [Food])
  @ManyToMany(() => Food)
  @JoinTable()
  favoriteFoods!: Food[];
}

@ObjectType({ description: 'Login Response' })
class SigninResponse {
  @Field(() => User, { description: 'The logged in user' })
  user!: User;
  @Field({ description: 'Base64 encoded JSON Web Token (JWT)' })
  token!: string;
}

export default User;
export { User, SigninResponse };
