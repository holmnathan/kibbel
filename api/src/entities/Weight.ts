import { BaseEntityUuid, Pet } from '@kibbel/entities';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

const sharedComments = {
  weighedAt: 'The date pet was weighed',
  weight: 'Weight of pet in grams',
};

@ObjectType({ description: 'Weight Schema' })
@Entity()
class Weight extends BaseEntityUuid {
  @Field({ description: sharedComments.weighedAt })
  @Column({ name: 'weighed_at', comment: sharedComments.weighedAt })
  weighedAt!: Date;

  @Field({ description: sharedComments.weight })
  @Column({ comment: sharedComments.weight })
  weight!: Number;

  // Relational Fields

  // Weight belongs to one pet
  @Field(() => Pet)
  @ManyToOne(() => Pet, (pet) => pet.weightHistory)
  @JoinColumn({ name: 'pet_id' })
  pet!: Pet;
}

export default Weight;
export { Weight };
