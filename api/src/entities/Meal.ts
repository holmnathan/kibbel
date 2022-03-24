import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseUuid, Serving, MealPlan } from '.';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  sortOrder: 'User defined sort order within a meal plan',
};

@ObjectType({ description: 'Meal Schema' })
@Entity()
class Meal extends BaseUuid {
  @Field({ description: sharedComments.sortOrder })
  @Column({ comment: sharedComments.sortOrder })
  sortOrder!: Number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: String;

  // Relational Fields

  // Meal can have many servings
  @Field(() => [Serving])
  @OneToMany(
    () => Serving,
    (serving) => {
      serving.meal;
    }
  )
  servings!: Serving[];

  // Meal belongs to one meal plan

  @Field(() => MealPlan)
  @ManyToOne(
    () => MealPlan,
    (mealPlan) => {
      mealPlan.meals;
    }
  )
  mealPlan!: MealPlan;
}

export default Meal;
export { Meal };
