import { useReactiveVar } from "@apollo/client";
import userReactiveVariable from "@kibbel/library/apollo/user";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  const user = useReactiveVar(userReactiveVariable);

  console.log(`Dashboard User: ${user}`);

  return (
    <>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>
    </>
  );
};
export default Dashboard;
