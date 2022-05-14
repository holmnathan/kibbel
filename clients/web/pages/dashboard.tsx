import { useQuery } from "@apollo/client";
import { UserInfoDocument } from "@kibbel/graphql/generated";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  const { data, error, loading } = useQuery(UserInfoDocument);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Dashboard</h1>
      <p>{data?.userInfo.email}</p>
    </>
  );
};
export default Dashboard;
