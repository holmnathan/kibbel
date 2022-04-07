// Import NPM Packages
import { ApolloError, useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { Button, Spinner } from "react-bootstrap";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

// Import Local Modules
import { InputField } from "@kibbel/components/Form";
import { user } from "@kibbel/library/apollo";
import {
  SignInUserDocument,
  SignInUserMutationVariables,
} from "@kibbel/graphql/generated";

const SignIn: NextPage = () => {
  const router = useRouter();
  const [submitionErrorMessage, setSubmitionErrorMessage] = useState<
    string | null
  >(null);
  const [signInUser, { error }] = useMutation(SignInUserDocument);
  const initialValues: SignInUserMutationVariables = {
    email: "",
    password: "",
  };

  const validationSchema: yup.SchemaOf<SignInUserMutationVariables> =
    yup.object({
      email: yup
        .string()
        .email("Enter a valid email address")
        .required("Enter your account email address"),
      password: yup.string().required("Enter your account password"),
    });
  return (
    <div>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await signInUser({
              variables: values,
              onError: (error) => {
                throw error;
              },
              onCompleted: ({ signInUser: { token } }) => {
                user.token = token;
                router.push("/dashboard");
              },
            });
          } catch (error) {
            console.error(error);

            // Sanitize error message displayed to user
            if (error instanceof ApolloError) {
              const {
                extensions: { code },
              } = error.graphQLErrors[0];
              if (code === "BAD_USER_INPUT")
                setSubmitionErrorMessage(error.message);
            }
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <InputField type="email" name="email" label="Email"></InputField>
            <InputField
              type="password"
              name="password"
              label="Password"
            ></InputField>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                ></Spinner>
              ) : null}
              Continue
            </Button>
          </Form>
        )}
      </Formik>
      <h1>{submitionErrorMessage}</h1>
    </div>
  );
};

export default SignIn;
