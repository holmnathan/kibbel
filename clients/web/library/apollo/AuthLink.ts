import { ApolloLink, Observable } from "@apollo/client";
import type { FetchResult, Operation, NextLink } from "@apollo/client";
import { User } from "@kibbel/library/User";

class AuthLink extends ApolloLink {
  user: User;

  constructor(user: User) {
    super();
    this.user = user;
  }

  public setAuthHeader = (operation: Operation, user: User): void => {
    const { token } = user;
    if (token) {
      operation.setContext({ headers: { Authorization: token } });
    }
  };

  public request(
    operation: Operation,
    forward: NextLink
  ): Observable<FetchResult> | null {
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
