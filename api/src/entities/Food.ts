import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseUuid, User, DietRestriction } from '@kibbel/entities';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, [*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  brandName: 'The pet food brand name or product line',
  manufacturer: 'The pet food manufacturer',
  flavor: 'The pet food flavor or recipe (ex. “Turkey and Duck”)',
  url: 'The pet food product or manufacturer URL',
  kilogramCalories: 'The calories per kilogram of pet food',
};

@ObjectType({ description: 'Food Schema' })
@Entity()
class Food extends BaseUuid {
  @Field({ description: sharedComments.brandName })
  @Column({ comment: sharedComments.brandName })
  name!: String;

  @Field({ nullable: true, description: sharedComments.manufacturer })
  @Column({ nullable: true, comment: sharedComments.manufacturer })
  manufacturer?: String;

  @Field({ nullable: true, description: sharedComments.flavor })
  @Column({ nullable: true, comment: sharedComments.flavor })
  flavor?: String;

  @Field({ nullable: true, description: sharedComments.url })
  @Column({ nullable: true, comment: sharedComments.url })
  url?: String;

  @Field({ description: sharedComments.kilogramCalories })
  @Column({ comment: sharedComments.kilogramCalories })
  kilogramCalories!: Number;

  // Relational Fields

  // A food can be favorited by many users
  // A user may favorite many foods
  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.favoriteFoods)
  users!: User[];

  // A food can meet many dietary restrictions
  // A dietary restriction can be assigned to many foods
  @Field(() => [DietRestriction])
  @ManyToMany(() => DietRestriction)
  @JoinTable()
  dietRestrictions!: DietRestriction[];
}

export default Food;
export { Food };
