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
import { AuthLink } from "./AuthLink";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { AccessToken } from "../AccessToken";

let client: ApolloClient<NormalizedCacheObject>;
const accessToken = new AccessToken();

// Check if context is server side or client side
const isServerSide = (): boolean => {
  return typeof window === "undefined";
};

const createApolloClient = (context?: GetServerSidePropsContext) => {
  const httpOptions: HttpOptions = {
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    credentials: "same-origin",
  };

  const refreshLink = new TokenRefreshLink({
    accessTokenField: "token",
    isTokenValidOrUndefined: accessToken.isTokenValidOrUndefined,
    fetchAccessToken: accessToken.refresh,
    handleFetch: (newToken) => (accessToken.token = newToken),
  });
  const authLink = new AuthLink();
  const httpLink = new HttpLink(httpOptions);

  return new ApolloClient({
    ssrMode: isServerSide(),
    link: from([refreshLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

const initializeApollo = (initialState = undefined, context = undefined) => {
  client = client ?? createApolloClient();

  if (initialState) {
    const existingCache = client.extract();
  }
};

client = createApolloClient();

export { client, accessToken };
