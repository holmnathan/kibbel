import { BaseEntityUuid, MealPlan, Serving } from '@kibbel/entities';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  sortOrder: 'User defined sort order within a meal plan',
};

@ObjectType({ description: 'Meal Schema' })
@Entity()
class Meal extends BaseEntityUuid {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: String;

  @Field({ description: sharedComments.sortOrder })
  @Column({ name: 'sort_order', comment: sharedComments.sortOrder })
  sortOrder!: Number;

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
  @JoinColumn({ name: 'meal_plan_id' })
  mealPlan!: MealPlan;
}

export default Meal;
export { Meal };
