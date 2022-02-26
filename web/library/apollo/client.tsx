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

let client: ApolloClient<NormalizedCacheObject>;

// Check if context is server side or client side
const isServerSide = (): boolean => {
  return typeof window === "undefined";
};

const createApolloClient = (context?: GetServerSidePropsContext) => {
  const httpOptions: HttpOptions = {
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    credentials: "same-origin",
  };

  const httpLink = new HttpLink(httpOptions);
  const authLink = new AuthLink();

  return new ApolloClient({
    ssrMode: isServerSide(),
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

const initializeApollo = (initialState = undefined, context = undefined) => {
  client = client ?? createApolloClient(context);

  if (initialState) {
    const existingCache = client.extract();
  }
};

client = createApolloClient();

export { client };
