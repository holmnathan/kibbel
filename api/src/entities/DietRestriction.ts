import { BaseEntityId, Food, Pet } from '@kibbel/entities';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

@ObjectType({ description: 'Dietary Restrictions Schema' })
@Entity({ name: 'diet_restriction' })
class DietRestriction extends BaseEntityId {
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
