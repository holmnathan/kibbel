import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Pet from './Pet';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, @[*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  fullName: 'The user’s full or legal name(s)',
  nickname: 'The user’s preferred way to be addressed',
  imageUrl: 'URL of user’s uploaded profile image',
  createdAt: 'The user’s account creation date',
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

  @Field({ description: sharedComments.createdAt })
  @CreateDateColumn({ comment: sharedComments.createdAt })
  createdAt!: Date;

  @OneToOne(() => Pet, (pet) => pet.user)
  pet!: Pet;
}

export default User;
export { User };
