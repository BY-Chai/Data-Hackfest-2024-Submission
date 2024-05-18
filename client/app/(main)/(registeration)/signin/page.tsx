import { Metadata } from "next";
import FormTitle from "../components/FormTitle";
import HelpText from "../components/HelpText";
import { SignInForm } from "../components/SignForms";

export const metadata: Metadata = {
  title: "Sign In to PathFinder",
};

function SignIn() {
  return (
    <>
      <FormTitle content="Sign In" />
      <SignInForm />
      <HelpText before="Do not have one?" after="Make one!" linkTo="/signup" />
    </>
  );
}

export default SignIn;
