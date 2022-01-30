import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { RecordDate, Food, Pet } from '.';

@ObjectType({ description: 'Dietary Restrictions Schema' })
@Entity()
class DietRestriction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: Number;

  @Field()
  @Column()
  name!: String;

  // A food can meet many dietary restrictions
  // A dietary restriction can be assigned to many foods
  @Field(() => [Food])
  @ManyToMany(() => Food)
  foods!: Food[];

  // A pet can have many dietary restrictions
  // A dietary restriction can be assigned to many pets
  @Field(() => [Pet])
  @ManyToMany(() => Pet)
  pets!: Pet[];
}

export { DietRestriction };
export default DietRestriction;
