"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import MapInput from "../../_components/MapInput";
import HelpText, { HelpTextReceive } from "./HelpText";

type SignFormFieldTypes =
  | "string"
  | "number"
  | "username"
  | "email"
  | "password"
  | "date"
  | "address";

type SignFormFieldInfo = {
  fieldName: string;
  required: boolean;
  dataType: SignFormFieldTypes;
  onSubmit?: (value: string) => true | string | Promise<true | string>;
};

interface SignFormReceive {
  fields: SignFormFieldInfo[];
  submitText: string;
  helpText: HelpTextReceive;
  requestTo: string;
}

function SignForm<T>({
  fields,
  submitText,
  helpText,
  requestTo,
}: SignFormReceive) {
  const [requestData, setRequestData] = useState<T>({} as T);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    for (const currentField of fields) {
      const currentFieldValue =
        requestData[
          currentField.fieldName.replace(" ", "-").toLowerCase() as keyof T
        ];

      if (currentField.required && !currentFieldValue) {
        setFormError(`The ${currentField.fieldName} is required.`);
        return;
      }
    }

    setFormError(undefined);

    // TODO: If the response sends an error message, show them
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md flex flex-col space-y-5">
      {fields.map((currentField) => (
        <div key={currentField.fieldName} className="w-full space-y-1.5">
          <label
            className="font-medium flex items-end justify-between w-full"
            htmlFor={currentField.fieldName}>
            {currentField.fieldName}
            {currentField.required && (
              <span className="text-red-500 font-normal text-sm">*</span>
            )}
          </label>

          {currentField.dataType === "address" ? (
            <MapInput
              getErrorList={(mapError) => {}}
              getFinalLocation={(finalLocation) => {
                setRequestData((prev) => {
                  prev[
                    currentField.fieldName
                      .replace(" ", "-")
                      .toLowerCase() as keyof T
                  ] = finalLocation as T[keyof T];
                  return prev;
                });
              }}
            />
          ) : (
            <div className="transition-colors flex items-center justify-center rounded-sm border border-gray-200 hover:border-gray-500 focus:border-gray-500">
              {currentField.dataType === "username" && (
                <div className="h-full font-semibold px-3 py-1.5">@</div>
              )}

              <input
                className={`transition-colors w-full py-1.5 px-3 rounded-sm focus:outline-none ${
                  currentField.dataType === "username"
                    ? "border-l"
                    : "border-none"
                } border-gray-200`}
                required={currentField.required}
                type={currentField.dataType}
                id={currentField.fieldName}
                placeholder={currentField.fieldName}
                autoComplete={
                  currentField.dataType === "password"
                    ? "current-password"
                    : currentField.dataType === "email"
                      ? "home email webauthn"
                      : currentField.dataType === "username"
                        ? "username"
                        : "on"
                }
                onChange={(changeInputEvent) => {
                  const value = changeInputEvent.currentTarget.value;
                  setRequestData((prev) => {
                    prev[
                      currentField.fieldName
                        .replace(" ", "-")
                        .toLowerCase() as keyof T
                    ] = value as T[keyof T];

                    return prev;
                  });
                }}
              />
            </div>
          )}
        </div>
      ))}

      {formError && (
        <div className="bg-red-200 border border-red-400 rounded-sm py-1 text-center text-red-500 text-lg">
          <span>{formError}</span>
        </div>
      )}

      <button
        type="submit"
        className="transition-colors py-1.5 px-10 mx-auto font-semibold rounded-lg bg-green-200 border border-green-600 hover:text-white hover:bg-green-600">
        {submitText}
      </button>

      <HelpText {...helpText} />
    </form>
  );
}

export function SignUpForm() {
  return (
    <SignForm
      submitText="Sign Up"
      requestTo="https://example.domain/signup"
      helpText={{
        before: "Alreay have one?",
        after: "Sign in.",
        linkTo: "/signin",
      }}
      fields={[
        {
          fieldName: "Username",
          dataType: "username",
          required: true,
          onSubmit(value) {
            // fetch to the server checking whether username is availble
            return true;
          },
        },
        {
          fieldName: "Name",
          dataType: "string",
          required: true,
        },
        {
          fieldName: "Birthday",
          dataType: "date",
          required: true,
        },
        {
          fieldName: "Residential Address",
          dataType: "address",
          required: true,
        },
        {
          fieldName: "Password",
          dataType: "password",
          required: true,
        },
      ]}
    />
  );
}

export function SignInForm() {
  return (
    <SignForm
      submitText="Start!"
      requestTo="https://example.domain/signin"
      helpText={{
        before: "Don't have one?",
        after: "Make one!",
        linkTo: "/signup",
      }}
      fields={[
        {
          fieldName: "Username",
          dataType: "username",
          required: true,
        },
        {
          fieldName: "Password",
          dataType: "password",
          required: true,
        },
      ]}
    />
  );
}

export default SignForm;
