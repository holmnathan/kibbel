import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './graphql';

const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.d.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  contextType: {
    module: join(__dirname, './context.ts'),
    export: 'Context',
  },
});

export default schema;
