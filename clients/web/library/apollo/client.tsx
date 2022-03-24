// Import NPM Packages
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { useMemo } from "react";
import type { NextPage, NextApiRequest, NextApiResponse } from "next";
import type {
  NormalizedCacheObject,
  HttpOptions,
  ApolloClientOptions,
} from "@apollo/client";
import type { GetServerSidePropsContext } from "next";
import { TokenRefreshLink } from "apollo-link-token-refresh";

// Import Local Modules
import { AuthLink } from "@kibbel/library/apollo/AuthLink";
import { AccessToken } from "@kibbel/library/AccessToken";

let client: ApolloClient<NormalizedCacheObject>;
const accessToken = new AccessToken();

// Check if context is server side or client side
const isServerSide = (): boolean => {
  return typeof window === "undefined";
};

const createApolloClient = (context?: GetServerSidePropsContext) => {
  const httpOptions: HttpOptions = {
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    credentials: "include",
  };

  const refreshLinkOptions: TokenRefreshLink.Options<string> = {
    accessTokenField: "token",
    isTokenValidOrUndefined: accessToken.isTokenValidOrUndefined,
    fetchAccessToken: accessToken.refresh,
    handleFetch: (newToken) => (accessToken.token = newToken),
    handleError: (error) => {
      console.log(error);
    },
  };

  const refreshLink = new TokenRefreshLink(refreshLinkOptions);
  const authLink = new AuthLink(accessToken);
  const httpLink = new HttpLink(httpOptions);

  const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
    ssrMode: isServerSide(),
    link: from([refreshLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  };

  return new ApolloClient(apolloOptions);
};

const initializeApollo = (initialState = undefined, context = undefined) => {
  client = client ?? createApolloClient();

  if (initialState) {
    const existingCache = client.extract();
  }
};

client = createApolloClient();

export { client, accessToken };
