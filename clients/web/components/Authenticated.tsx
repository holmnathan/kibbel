import useUser from "@kibbel/library/apollo/useUser";
import { NextComponentType } from "next";

const Authenticated: NextComponentType = ({ children }) => {
  const { user } = useUser();

  if (!user) return null;

  return <>{children}</>;
};

export default Authenticated;
