import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { CurrentUserDocument } from "@kibbel/graphql/generated";

const Dashboard: NextPage = () => {
  const { data, error, loading } = useQuery(CurrentUserDocument);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Dashboard</h1>
      <p>{data?.currentUser.email}</p>
    </>
  );
};
export default Dashboard;
