import { HandleFetch } from "apollo-link-token-refresh";
import userMutations from ".";

const createHandleFetch = () => {
  const handleFetch: HandleFetch<string> = (token, operation) => {
    console.log("handleFetch ! handleFetch ! handleFetch ! handleFetch !");
    console.log(token);
    console.log(operation);

    userMutations.saveToken(token);
  };

  return handleFetch;
};

export default createHandleFetch;
