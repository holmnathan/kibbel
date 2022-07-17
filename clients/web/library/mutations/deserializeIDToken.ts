import { ReactiveVar } from "@apollo/client";
import { User } from "@kibbel/graphql/generated";
import jwtDecode from "jwt-decode";
import { UserWithToken } from "../apollo/user";

const createDeserializeIDToken = (userVariable: ReactiveVar<UserWithToken>) => {
  return (idToken: string) => {
    console.log("DESERIALIZE!DESERIALIZE!DESERIALIZE!DESERIALIZE!DESERIALIZE!");
    console.log(idToken);
    const user: User = jwtDecode(idToken);
    userVariable(user);
  };
};

export default createDeserializeIDToken;
