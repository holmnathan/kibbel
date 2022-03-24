import { ApolloLink, Observable } from "@apollo/client";
import type { FetchResult, Operation, NextLink } from "@apollo/client";
import { AccessToken } from "@kibbel/library/AccessToken";

class AuthLink extends ApolloLink {
  accessToken: AccessToken;

  constructor(accessToken: AccessToken) {
    super();
    this.accessToken = accessToken;
  }

  public setAuthHeader = (
    operation: Operation,
    accessToken: AccessToken
  ): void => {
    const { token } = accessToken;
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
    this.setAuthHeader(operation, this.accessToken);

    return forward(operation);
  }
}

export { AuthLink };
