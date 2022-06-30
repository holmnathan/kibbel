import { InMemoryCache, InMemoryCacheConfig } from "@apollo/client";
import { IdTokenResponse } from "@kibbel/graphql/generated";
import { OidcClaims } from "@kibbel/shared";
import jwtDecode from "jwt-decode";
import tokenReactiveVariable from "./Token";
import userReactiveVariable from "./User";

const config: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        userInfo: {
          merge(existing, incoming: IdTokenResponse) {
            const { id_token } = incoming;
            console.log("User Cache ! User Cache ! User Cache ! User Cache !");
            console.log(`id_token: ${id_token}`);
            console.log("-------------------");
            const {
              sub: id,
              exp,
              iat,
              iss,
              acr,
              amr,
              aud,
              azp,
              auth_time,
              nonce,
              sid,
              nbf,
              ...userClaims
            }: OidcClaims.IdTokenClaims = jwtDecode(id_token);
            const user = { id, ...userClaims, ...existing };
            console.log(user);

            tokenReactiveVariable(id_token);
            userReactiveVariable(user);
            return user;
          },
          read() {
            return userReactiveVariable();
          },
        },
      },
    },
  },
};

const cache = new InMemoryCache(config);

export { cache };
