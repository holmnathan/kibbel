import { ReactiveVar } from "@apollo/client";
import { UserWithToken } from "@kibbel/library/apollo/user";
import jwtDecode, { JwtPayload } from "jwt-decode";

const createIsTokenValidOrUndefined = (
  userVariable: ReactiveVar<UserWithToken>
) => {
  const user = userVariable();
  console.log(
    "ISTOKENVALIDORUNDEFINED!ISTOKENVALIDORUNDEFINED!ISTOKENVALIDORUNDEFINED!"
  );
  console.log(`User Variable: ${user}`);
  console.log(`User Token: ${user?.token}`);
  try {
    if (!user?.token)
      // throw new ApolloError({ errorMessage: "Token is undefined" });
      return () => true;
    const { exp } = jwtDecode<JwtPayload>(user?.token);
    return () => Date.now() >= exp * 1000;
  } catch (exception) {
    console.log("Access Token", exception);
    console.log("FAILED!FAILED!FAILED!FAILED!FAILED!FAILED!FAILED!");
    return () => false;
  }
};

export default createIsTokenValidOrUndefined;
