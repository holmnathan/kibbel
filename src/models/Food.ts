import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import RecordDate from './RecordDate';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column
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
class Food extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: String;

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

  // Import record created / updated fields from RecordDate schema
  @Field(() => RecordDate)
  @Column(() => RecordDate)
  record!: RecordDate;
}

export default Food;
export { Food };
