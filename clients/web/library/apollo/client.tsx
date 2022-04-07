// Import NPM Packages
import type {
  ApolloClientOptions,
  HttpOptions,
  NormalizedCacheObject
} from "@apollo/client";
import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
// Import Local Modules
import { AuthLink } from "@kibbel/library/apollo/AuthLink";
import { User } from "@kibbel/library/User";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import type { GetServerSidePropsContext } from "next";

let client: ApolloClient<NormalizedCacheObject>;
const user = new User();

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
    isTokenValidOrUndefined: user.isTokenValidOrUndefined,
    fetchAccessToken: user.refresh,
    handleFetch: (newToken) => (user.token = newToken),
    handleError: (error) => {
      console.log(error);
    },
  };

  const refreshLink = new TokenRefreshLink(refreshLinkOptions);
  const authLink = new AuthLink(user);
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

export { client, user };
