import { useReactiveVar } from "@apollo/client";
import userReactiveVariable from "./user";

const useUser = () => {
  const { data: user, loading, error } = useReactiveVar(userReactiveVariable);

  return { user, loading, error };
};

export default useUser;
