import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { User } from './User';

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

@Entity()
@ObjectType({ description: 'Pet Schema' })
export class Pet extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({
    description: 'Th pet’s name',
  })
  @Column()
  name!: string;

  @Field({
    description: 'The pet’s date of birth',
  })
  @Column()
  birthDate!: Date;

  @Field({
    nullable: true,
    description: 'URL of pet’s uploaded profile image',
  })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field({
    description: 'The pet’s reproductive status',
  })
  @Column()
  isIntact!: boolean;

  @Field(() => PetSpecies, {
    description: 'The pet’s species',
  })
  @Column({ type: 'enum', enum: PetSpecies })
  species!: PetSpecies;

  @Field(() => PetGender, {
    nullable: true,
    description: 'The pet’s gender',
  })
  @Column({ nullable: true, type: 'enum', enum: PetGender })
  gender?: PetGender;

  @Field({ description: 'The pet’s profile creation date' })
  @CreateDateColumn()
  createdAt!: Date;

  // No @Field() specified: Hides field from public access
  @OneToOne(() => User, (user) => user.pet)
  @JoinColumn()
  user!: User;
}
