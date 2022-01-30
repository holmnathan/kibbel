import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import User from './User';
import Diet from './Diet';

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
  imageUrl: 'URL of pet’s uploaded profile image',
  isIntact: 'The pet’s reproductive status',
  species: 'The pet’s species',
  gender: 'The pet’s gender',
  createdAt: 'The pet’s profile creation date',
};

@Entity()
@ObjectType({ description: 'Pet Schema' })
class Pet extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({
    description: sharedComments.name,
  })
  @Column({ comment: sharedComments.name })
  name!: string;

  @Field({
    description: sharedComments.birthDate,
  })
  @Column({ comment: sharedComments.birthDate })
  birthDate!: Date;

  @Field({
    nullable: true,
    description: sharedComments.imageUrl,
  })
  @Column({ comment: sharedComments.imageUrl, nullable: true })
  imageUrl?: string;

  @Field({
    description: sharedComments.isIntact,
  })
  @Column({ comment: sharedComments.isIntact })
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

  @Field({ description: sharedComments.createdAt })
  @CreateDateColumn({ comment: sharedComments.createdAt })
  createdAt!: Date;

  // No @Field() specified: Hides field from public access
  @OneToOne(() => User, (user) => user.pet)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Diet)
  diet!: Diet;
}

export default Pet;
export { Pet, PetGender, PetSpecies };
