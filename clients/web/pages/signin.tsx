// Import NPM Packages
import { ApolloError, useMutation } from "@apollo/client";
// Import Local Modules
import { InputField } from "@kibbel/components/Form";
import {
  AuthorizeDocument,
  AuthorizeMutationVariables
} from "@kibbel/graphql/generated";
import userMutations from "@kibbel/library/mutations/";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import * as yup from "yup";

const SignIn: NextPage = () => {
  const router = useRouter();
  const [submitionErrorMessage, setSubmitionErrorMessage] = useState<
    string | null
  >(null);
  const [authorize, { error }] = useMutation(AuthorizeDocument);
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema: yup.SchemaOf<AuthorizeMutationVariables> = yup.object(
    {
      email: yup
        .string()
        .email("Enter a valid email address")
        .required("Enter your account email address"),
      password: yup.string().required("Enter your account password"),
    }
  );
  return (
    <div>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await authorize({
              variables: values,
              onError: (error) => {
                router.push("/signin");
                throw error;
              },
              onCompleted: ({ authorize: { token, id_token } }) => {
                console.log(
                  "ONCOMPLETED!ONCOMPLETED!ONCOMPLETED!ONCOMPLETED!ONCOMPLETED!"
                );
                console.log(id_token);
                userMutations.deserializeIDToken(id_token);
                userMutations.saveToken(token);
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
