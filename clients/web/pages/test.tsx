import { useReactiveVar } from "@apollo/client";
import userReactiveVariable from "@kibbel/library/apollo/user";
import { NextPage } from "next";

const Test: NextPage = () => {
  const user = useReactiveVar(userReactiveVariable);

  console.log(`Test User: ${user}`);

  return (
    <>
      <h1>Test</h1>
      <p>{user?.email}</p>
    </>
  );
};
export default Test;
