import { Metadata } from "next";
import FormTitle from "../components/FormTitle";
import HelpText from "../components/HelpText";
import { SignUpForm } from "../components/SignForms";

export const metadata: Metadata = {
  title: "Sign Up to PathFinder",
};

function SignUp() {
  return (
    <>
      <FormTitle content="Sign Up" />
      <SignUpForm />
      <HelpText before="Already have one?" after="Sign in." linkTo="/signin" />
    </>
  );
}

export default SignUp;
