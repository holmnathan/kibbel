import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { RecordDate, Serving, MealPlan } from '.';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  sortOrder: 'User defined sort order within a meal plan',
};

@ObjectType({ description: 'Meal Schema' })
@Entity()
class Meal extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Field({ description: sharedComments.sortOrder })
  @Column({ comment: sharedComments.sortOrder })
  sortOrder!: Number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: String;

  // Create / Update Fields

  @Field(() => RecordDate)
  @Column(() => RecordDate)
  record!: RecordDate;

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
