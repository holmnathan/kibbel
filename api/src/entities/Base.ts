import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @[*]Column
// TypeGraphQL decorators: @Field

@ObjectType()
abstract class BaseEntityDates extends BaseEntity {
  @Field()
  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@ObjectType()
abstract class BaseEntityUuid extends BaseEntityDates {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;
}

@ObjectType()
abstract class BaseEntityId extends BaseEntityDates {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id!: number;
}

export { BaseEntityUuid, BaseEntityId, BaseEntityDates };
