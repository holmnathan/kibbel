import { BaseEntityUuid, Meal, Pet } from '@kibbel/entities';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

@ObjectType({ description: 'Meal Plan Schema' })
@Entity()
class MealPlan extends BaseEntityUuid {
  @Field()
  @Column()
  name!: String;

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
