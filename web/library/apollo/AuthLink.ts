import { ApolloLink, Observable } from "@apollo/client";
import type { FetchResult } from "@apollo/client";
import { AccessToken } from "../AccessToken";
import { accessToken } from ".";

import type { Operation, NextLink } from "@apollo/client";

class AuthLink extends ApolloLink {
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
    console.log(accessToken.token);
    this.setAuthHeader(operation, accessToken);

    return forward(operation);
  }
}

export { AuthLink };
