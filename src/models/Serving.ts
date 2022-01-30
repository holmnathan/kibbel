import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { RecordDate, Food, Meal } from '.';

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
class Serving extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Field({ description: sharedComments.sortOrder })
  @Column({ comment: sharedComments.sortOrder })
  sortOrder!: Number;

  @Field({ description: sharedComments.size })
  @Column({ comment: sharedComments.size })
  size!: Number;

  // Create / Update Fields

  @Field(() => RecordDate)
  @Column(() => RecordDate)
  record!: RecordDate;

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
