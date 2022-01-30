import {
  BaseEntity,
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { RecordDate, Pet } from '.';

const sharedComments = {
  weighDate: 'The date pet was weighed',
  weight: 'Weight of pet in grams',
};

@ObjectType({ description: 'Weight Schema' })
@Entity()
class Weight extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Field({ description: sharedComments.weighDate })
  @Column({ comment: sharedComments.weighDate })
  weighDate!: Date;

  @Field({ description: sharedComments.weight })
  @Column({ comment: sharedComments.weight })
  weight!: Number;

  // Create / Update Fields

  @Field(() => RecordDate)
  @Column(() => RecordDate)
  record!: RecordDate;

  // Relational Fields

  // Weight belongs to one pet
  @Field(() => Pet)
  @ManyToOne(() => Pet, (pet) => pet.weightHistory)
  pet!: Pet;
}

export default Weight;
export { Weight };
