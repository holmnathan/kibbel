import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID } from 'type-graphql';
import { GraphQLUUID } from 'graphql-custom-types';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @[*]Column
// TypeGraphQL decorators: @Field

abstract class RecordDates extends BaseEntity {
  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}

abstract class BaseUuid extends RecordDates {
  @Field(() => GraphQLUUID)
  @PrimaryGeneratedColumn('uuid')
  id!: String;
}

abstract class BaseId extends RecordDates {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: Number;
}

export { BaseUuid, BaseId };
