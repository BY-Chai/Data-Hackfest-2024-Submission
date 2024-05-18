import type { Metadata } from "next";
import FormTitle from "../_components/FormTitle";
import { SignUpForm } from "../_components/SignForms";

export const metadata: Metadata = {
  title: "Sign Up to PathFinder",
};

function SignUp() {
  return (
    <>
      <FormTitle content="Sign Up" />
      <SignUpForm />
    </>
  );
}

export default SignUp;
