import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { RecordDate, Pet, Meal } from '.';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {};

@ObjectType({ description: 'Meal Plan Schema' })
@Entity()
class MealPlan extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Field()
  @Column()
  name!: String;

  // Create / Update Fields

  @Field(() => RecordDate)
  @Column(() => RecordDate)
  record!: RecordDate;

  // Relational Fields

  // Each meal plan can belong to many pets
  @Field(() => [Pet])
  @OneToMany(
    () => Pet,
    (pet) => {
      pet.mealPlan;
    }
  )
  pets!: Pet[];

  // Each meal plan cam have many meals
  @Field(() => [Meal])
  @OneToMany(() => Meal, (meal) => meal.mealPlan)
  meals!: Meal[];
}

export default MealPlan;
export { MealPlan };
