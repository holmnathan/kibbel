import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

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
class Diet extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

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
