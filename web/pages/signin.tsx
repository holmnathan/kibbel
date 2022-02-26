import {
  SignInUserDocument,
  SignInUserMutationVariables,
} from "../graphql/generated";
import { useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { InputField } from "../components/Form";
import { Button, Spinner } from "react-bootstrap";
import { NextPage } from "next";
import { setToken } from "../library/auth";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
  const router = useRouter();
  const [signInUser, { data, error }] = useMutation(SignInUserDocument);
  const token = data?.signInUser.token;
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
            });
            console.log(token);
            if (!token) throw new Error("Unable to retrieve token");
            setToken(token);
            router.push("/dashboard");
          } catch (error) {
            console.log(error);
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
      <h1>{error ? error.message : null}</h1>
    </div>
  );
};

export default SignIn;
