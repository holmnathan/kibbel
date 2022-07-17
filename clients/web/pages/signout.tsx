import { useMutation } from "@apollo/client";
import { SignOutDocument } from "@kibbel/graphql/generated";
import { user } from "@kibbel/library/apollo";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

const SignOut: NextPage = () => {
  const router = useRouter();
  const [revoke, { error, loading, client, data }] =
    useMutation(SignOutDocument);

  try {
    revoke({
      onCompleted: () => {
        user.signOut();
        client.resetStore();
        router.push("/");
      },
    });
  } catch (exception) {
    console.log(exception);
  }

  return (
    <>
      <h1>Sign Out</h1>
      {loading ? <Spinner animation="border" /> : <></>}
      {error ? <p>error</p> : <></>}
      {data ? <p>Signed Out</p> : <></>}
    </>
  );
};

export default SignOut;
