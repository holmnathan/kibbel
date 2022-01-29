import { Resolver, Query } from 'type-graphql';

class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello World';
  }
}

export { UserResolver };
