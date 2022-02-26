import { ApolloLink, Observable } from "@apollo/client";

import type {
  ApolloClient,
  Operation,
  NextLink,
  NormalizedCacheObject,
} from "@apollo/client";

import { getToken } from "../auth";

class AuthLink extends ApolloLink {
  setAuthHeader = (operation: Operation): void => {
    const token = getToken();
    if (token) {
      operation.setContext({ headers: { authorization: token } });
    }
  };

  request(operation: Operation, forward: NextLink) {
    // Set authorization token in request header
    this.setAuthHeader(operation);

    const observable = forward(operation);
    return observable;
  }
}

export { AuthLink };
