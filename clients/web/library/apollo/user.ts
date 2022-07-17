import { makeVar } from "@apollo/client";
import { User } from "@kibbel/graphql/generated";

type UserWithToken = Partial<User> & { token?: string };

const userInitialValues: UserWithToken = null;

const userReactiveVariable = makeVar<UserWithToken>(userInitialValues);

export default userReactiveVariable;
export type { UserWithToken };
