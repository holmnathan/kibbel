import {
  BaseEntityUuid,
  Diet,
  DietRestriction,
  MealPlan,
  User,
  Weight
} from '@kibbel/entities';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';

// Enumerated Types -----------------------------------------------------------
// Each Type is defined and registered with TypeGraphQL

// Define Pet Species
enum PetSpecies {
  cat = 'cat',
  dog = 'dog',
}

// Register Pet Species with TypeGraphQL
registerEnumType(PetSpecies, {
  name: 'PetSpecies',
  description: 'Pet’s specie types',
});

// Define Pet Gender
enum PetGender {
  female = 'female',
  male = 'male',
}

// Register Pet Gender with TypeGraphQL
registerEnumType(PetGender, {
  name: 'PetGender',
  description: 'Pet’s gender types',
});

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, @[*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  name: 'The pet’s name',
  birthDate: 'The pet’s date of birth',
  picture: 'URL of pet’s uploaded profile image',
  isIntact: 'The pet’s reproductive status',
  species: 'The pet’s species',
  gender: 'The pet’s gender',
};

@Entity()
@ObjectType({ description: 'Pet Schema' })
class Pet extends BaseEntityUuid {
  @Field({
    description: sharedComments.name,
  })
  @Column({ comment: sharedComments.name })
  name!: string;

  @Field({
    description: sharedComments.birthDate,
  })
  @Column({ name: 'birth_date', comment: sharedComments.birthDate })
  birthDate!: Date;

  @Field({
    nullable: true,
    description: sharedComments.picture,
  })
  @Column({ comment: sharedComments.picture, nullable: true })
  picture?: string;

  @Field({
    description: sharedComments.isIntact,
  })
  @Column({ name: 'is_intact', comment: sharedComments.isIntact })
  isIntact!: boolean;

  @Field(() => PetSpecies, {
    description: sharedComments.species,
  })
  @Column({ comment: sharedComments.species, type: 'enum', enum: PetSpecies })
  species!: PetSpecies;

  @Field(() => PetGender, {
    nullable: true,
    description: sharedComments.gender,
  })
  @Column({
    comment: sharedComments.gender,
    nullable: true,
    type: 'enum',
    enum: PetGender,
  })
  gender?: PetGender;

  // Relational Fields

  // A pet belongs to one user
  // A user can have many pets
  @ManyToOne(() => User, (user) => user.pets)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // A pet is assigned one meal plan
  // A Meal plan can be assigned to many Pets
  @Field(() => MealPlan)
  @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.pets)
  @JoinColumn({ name: 'meal_plan_id' })
  mealPlan!: MealPlan;

  // A pet is assigned one diet
  // A Diet can be assigned to many pets
  @ManyToOne(() => Diet)
  @JoinColumn({ name: 'diet_id' })
  diet!: Diet;

  // A pet can have many weights
  // A weight belongs to one pet
  @Field(() => [Weight])
  @OneToMany(() => Weight, (weight) => weight.pet)
  @JoinColumn({ name: 'weight_id' })
  weightHistory!: Weight[];

  // A pet can have many dietary restrictions
  // A dietary restriction can be assigned to many pets
  @Field(() => [DietRestriction])
  @ManyToMany(() => DietRestriction)
  @JoinTable({
    name: 'pet_diet_restrictions',
    joinColumn: {
      name: 'pet_id',
    },
    inverseJoinColumn: { name: 'diet_restriction_id' },
  })
  dietRestrictions!: DietRestriction[];
}

export default Pet;
export { Pet, PetGender, PetSpecies };
