import { Entity, Column, ManyToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseUuid, Food, Meal } from '@kibbel/entities';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  sortOrder: 'User defined sort order within a meal',
  size: 'Serving size in grams',
};

@ObjectType({ description: 'Serving Schema' })
@Entity()
class Serving extends BaseUuid {
  @Field({ description: sharedComments.sortOrder })
  @Column({ comment: sharedComments.sortOrder })
  sortOrder!: Number;

  @Field({ description: sharedComments.size })
  @Column({ comment: sharedComments.size })
  size!: Number;

  // Relational Fields

  // Each serving has one food
  @Field()
  @ManyToOne(() => Food)
  food!: Food;

  // Many servings belongs to one meal
  @Field(() => Meal)
  @ManyToOne(() => Meal, (meal) => meal.servings)
  meal!: Meal;
}

export default Serving;
export { Serving };
