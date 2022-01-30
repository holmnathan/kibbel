import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { RecordDate, Pet, Food } from '.';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, @[*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  fullName: 'The user’s full or legal name(s)',
  nickname: 'The user’s preferred way to be addressed',
  imageUrl: 'URL of user’s uploaded profile image',
};

@Entity()
@ObjectType({ description: 'User Schema' })
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({
    description: sharedComments.fullName,
  })
  @Column({ comment: sharedComments.fullName })
  fullName!: string;

  @Field({
    nullable: true,
    description: sharedComments.nickname,
  })
  @Column({ comment: sharedComments.nickname, nullable: true })
  nickname?: string;

  @Field({})
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field({
    nullable: true,
    description: sharedComments.imageUrl,
  })
  @Column({ comment: sharedComments.imageUrl, nullable: true })
  imageUrl?: string;

  // Import record created / updated fields from RecordDate schema
  @Field(() => RecordDate)
  @Column(() => RecordDate)
  record!: RecordDate;

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

export default User;
export { User };
