// Import NPM Packages
import { Formik, Field, Form, FormikHelpers } from "formik";
import { Button, Spinner } from "react-bootstrap";
import { NextPage } from "next";
import { ApolloError, useMutation } from "@apollo/client";

// Import Local Modules
import { InputField } from "@kibbel/components/Form";
import {
  CreateUserDocument,
  CreateUserMutationVariables,
} from "@kibbel/graphql/generated";

const SignUp: NextPage = () => {
  const [createUser, { error }] = useMutation(CreateUserDocument);
  const initialValues: CreateUserMutationVariables = {
    email: "",
    password: "",
    fullName: "",
    displayName: "",
    imageUrl: "",
  };

  return (
    <>
      <h1>Create Your Kibbel Account</h1>
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          displayName: "",
          password: "",
        }}
        onSubmit={(values) => {
          createUser({ variables: values });
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form noValidate>
            <InputField
              name="fullName"
              label="Full Name"
              placeholder="John Smith"
              required
            />
            <InputField
              name="displayName"
              label="Display Name"
              placeholder="John"
            />
            <InputField
              name="email"
              label="Email"
              placeholder="john@acme.com"
              type="email"
              required
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              required
            />
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  <span className="visually-hidden">Loading…</span>
                </>
              ) : (
                <></>
              )}
              Continue
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
