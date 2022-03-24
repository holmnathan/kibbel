import { Entity, ManyToOne, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { BaseUuid, Pet } from '.';

const sharedComments = {
  weighDate: 'The date pet was weighed',
  weight: 'Weight of pet in grams',
};

@ObjectType({ description: 'Weight Schema' })
@Entity()
class Weight extends BaseUuid {
  @Field({ description: sharedComments.weighDate })
  @Column({ comment: sharedComments.weighDate })
  weighDate!: Date;

  @Field({ description: sharedComments.weight })
  @Column({ comment: sharedComments.weight })
  weight!: Number;

  // Relational Fields

  // Weight belongs to one pet
  @Field(() => Pet)
  @ManyToOne(() => Pet, (pet) => pet.weightHistory)
  pet!: Pet;
}

export default Weight;
export { Weight };
