import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field } from 'type-graphql';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @[*]Column
// TypeGraphQL decorators: @Field

// Shared TypeGraphQL descriptions and TypeORM comments
const sharedComments = {
  created: 'The date record was created in database',
  updated: 'The date record was last updated in database',
};

class RecordDate {
  @Field({ description: sharedComments.created })
  @CreateDateColumn({ comment: sharedComments.created })
  created!: Date;

  @Field({ description: sharedComments.updated })
  @UpdateDateColumn({ comment: sharedComments.updated })
  updated!: Date;
}

export default RecordDate;
