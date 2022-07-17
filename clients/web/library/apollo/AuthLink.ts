import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation,
  ReactiveVar
} from "@apollo/client";
import { UserWithToken } from "@kibbel/library/apollo/user";

class AuthLink extends ApolloLink {
  user: ReactiveVar<UserWithToken>;

  constructor(user: ReactiveVar<UserWithToken>) {
    super();
    this.user = user;
  }

  public setAuthHeader = async (
    operation: Operation,
    user: ReactiveVar<UserWithToken>
  ): Promise<void> => {
    console.log(user());
    const { token } = user();
    const authorizationHeader = `Bearer ${token}`;
    if (token) {
      operation.setContext({ headers: { Authorization: authorizationHeader } });
    }
  };

  public request(
    operation: Operation,
    forward: NextLink
  ): Observable<FetchResult> | null {
    console.log(`Operation: ${operation.operationName}`);
    // const cache: InMemoryCache = operation.getContext().cache;
    if (typeof forward !== "function") {
      throw new Error(
        "[Auth Link]: Auth Link is a non-terminating link and should not be the last in the composed chain"
      );
    }
    // Set authorization token in request header
    this.setAuthHeader(operation, this.user);

    return forward(operation);
  }
}

export { AuthLink };
