// Import NPM Packages
import type {
  ApolloClientOptions,
  HttpOptions,
  NormalizedCacheObject
} from "@apollo/client";
import { ApolloClient, from, HttpLink } from "@apollo/client";
import { AuthLink, cache } from "@kibbel/library/apollo";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import type { GetServerSidePropsContext } from "next";
import { useMemo } from "react";
import isServerSide from "../isServerSide";
import userMutations, { userReactiveVariable } from "../mutations";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = (context?: GetServerSidePropsContext) => {
  const httpOptions: HttpOptions = {
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    credentials: "include",
  };

  const refreshLink = new TokenRefreshLink(userMutations);
  const authLink = new AuthLink(userReactiveVariable);
  const httpLink = new HttpLink(httpOptions);

  const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
    ssrMode: isServerSide(),
    link: from([refreshLink, authLink, httpLink]),
    cache,
  };

  return new ApolloClient(apolloOptions);
};

const initializeApollo = (initialState: NormalizedCacheObject = undefined) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();

    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  //
  if (isServerSide) return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

const useApollo = (initialState: NormalizedCacheObject) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};

export { useApollo };
