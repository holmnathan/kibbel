import { BaseEntityUuid, Food, Meal } from '@kibbel/entities';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
class Serving extends BaseEntityUuid {
  @Field({ description: sharedComments.sortOrder })
  @Column({ name: 'sort_order', comment: sharedComments.sortOrder })
  sortOrder!: Number;

  @Field({ description: sharedComments.size })
  @Column({ comment: sharedComments.size })
  size!: Number;

  // Relational Fields

  // Each serving has one food
  @Field()
  @ManyToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  food!: Food;

  // Many servings belongs to one meal
  @Field(() => Meal)
  @ManyToOne(() => Meal, (meal) => meal.servings)
  @JoinColumn({ name: 'meal_id' })
  meal!: Meal;
}

export default Serving;
export { Serving };
