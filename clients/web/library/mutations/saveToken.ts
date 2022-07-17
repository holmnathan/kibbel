import { ReactiveVar } from "@apollo/client";
import { UserWithToken } from "../apollo/user";

const SAVETOKEN = (userVariable: ReactiveVar<UserWithToken>) => {
  return (token: string) => {
    console.log("SAVETOKEN!SAVETOKEN!SAVETOKEN!SAVETOKEN!");
    console.log(token);

    const exisitingUser = userVariable();
    const newUser = { ...exisitingUser, token };
    console.log("USER!USER!!", newUser);
    const test = userVariable(newUser);
    return test;
  };
};

export default SAVETOKEN;
