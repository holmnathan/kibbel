import { BaseEntityId } from '@kibbel/entities';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  energyMultiplier:
    "The amount the diet multiplies a pet's daily calorie requirement",
};

@Entity()
@ObjectType({ description: 'Diet Type Schema' })
class Diet extends BaseEntityId {
  @Field()
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({
    description: sharedComments.energyMultiplier,
  })
  @Column({
    name: 'energy_multiplier',
    comment: sharedComments.energyMultiplier,
  })
  energyMultiplier!: number;
}

export default Diet;
export { Diet };
