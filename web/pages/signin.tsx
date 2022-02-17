import { useSignInUserMutation } from "../graphql/generated";
import { useState, FormEventHandler, ChangeEventHandler } from "react";

import Head from "next/head";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [signInUser] = useSignInUserMutation();

  const handleEmail: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setEmail(value);
  };

  const handlePassword: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setPassword(value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await signInUser({
      variables: { email, password },
      onCompleted: ({ signInUser: { user } }) => setUser(user.fullName),
      onError: (error) => {
        setUser("Error Occured");
        console.log(error.message);
      },
    });
  };

  return (
    <>
      <div>
        <h1>{user ? user : "No User"}</h1>
        <form onSubmit={handleSubmit}>
          <input onChange={handleEmail} />
          <input type="password" onChange={handlePassword} />
          <button type="submit">User</button>
        </form>
      </div>
    </>
  );
};

export default SignIn;
