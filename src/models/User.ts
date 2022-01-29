import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType({ description: 'User Schema' })
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({
    description: 'The User’s full or legal name(s)',
  })
  @Column()
  fullName!: string;

  @Field({
    nullable: true,
    description: 'The User’s preferred way to be addressed',
  })
  @Column({ nullable: true })
  nickname?: string;

  @Field({})
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field({
    nullable: true,
    description: 'URL of User’s uploaded profile image',
  })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field({ description: 'The User’s account creation date' })
  @CreateDateColumn()
  createdAt!: Date;
}
