import userReactiveVariable from "../apollo/user";
import createDeserializeIDToken from "./deserializeIDToken";
import createHandleFetch from "./handleFetch";
import createIsTokenValidOrUndefined from "./isTokenValidOrUndefined";
import createRefreshToken from "./refreshToken";
import createSaveToken from "./saveToken";

const userMutations = {
  accessTokenField: "token",
  deserializeIDToken: createDeserializeIDToken(userReactiveVariable),
  saveToken: createSaveToken(userReactiveVariable),
  fetchAccessToken: createRefreshToken(),
  isTokenValidOrUndefined: createIsTokenValidOrUndefined(userReactiveVariable),
  handleFetch: createHandleFetch(),
  handleError(error: Error) {
    console.log("HandleError!HandleError!HandleError!HandleError!HandleError!");
    console.log(error);
  },
};

export default userMutations;
export { userReactiveVariable };
