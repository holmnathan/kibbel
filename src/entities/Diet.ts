import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { BaseId } from '.';

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
class Diet extends BaseId {
  @Field()
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({
    description: sharedComments.energyMultiplier,
  })
  @Column({ comment: sharedComments.energyMultiplier })
  energyMultiplier!: number;
}

export default Diet;
export { Diet };
