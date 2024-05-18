import { Metadata } from "next";
import FormTitle from "../_components/FormTitle";
import { SignInForm } from "../_components/SignForms";

export const metadata: Metadata = {
  title: "Sign In to PathFinder",
};

function SignIn() {
  return (
    <>
      <FormTitle content="Sign In" />
      <SignInForm />
    </>
  );
}

export default SignIn;
