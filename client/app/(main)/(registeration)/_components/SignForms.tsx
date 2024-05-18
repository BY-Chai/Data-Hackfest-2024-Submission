"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Map from "../../_components/maps";

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
  maxLength?: number;
  dataType: SignFormFieldTypes;
  onSubmit?: (value: string) => true | string | Promise<true | string>;
};

interface SignFormReceive {
  fields: SignFormFieldInfo[];
  submitText: string;
  requestTo: string;
}

function SignForm<T>({ fields, submitText, requestTo }: SignFormReceive) {
  const [requestData, setRequestData] = useState<T>({} as T);
  const [formError, setFormError] = useState<string | undefined>("hahahaha");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md flex flex-col space-y-5">
      {fields.map((currentField, currentFieldIndex) => (
        <div key={currentFieldIndex} className="w-full space-y-1.5">
          <label className="font-medium" htmlFor={currentField.fieldName}>
            {currentField.fieldName}
            {currentField.required && <span className="text-red-500">*</span>}
          </label>

          {currentField.dataType === "address" ? (
            <Map
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
            <input
              className="transition-colors w-full border border-gray-200 py-1.5 px-3 rounded-md hover:border-gray-500 focus:border-gray-500 focus:outline-none"
              required={currentField.required}
              type={currentField.dataType}
              id={currentField.fieldName}
              maxLength={currentField.maxLength ? currentField.maxLength : 50}
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
          )}
        </div>
      ))}

      {formError && (
        <div className="bg-red-200 border border-red-400 rounded-md py-1 text-center text-red-500 text-lg">
          <span>{formError}</span>
        </div>
      )}

      <button className="transition-colors py-1.5 px-10 mx-auto font-semibold rounded-lg bg-green-200 border border-green-600 hover:text-white hover:bg-green-600">
        {submitText}
      </button>
    </form>
  );
}

export function SignUpForm() {
  return (
    <SignForm
      submitText="Sign Up"
      requestTo="https://example.domain/signup"
      fields={[
        {
          fieldName: "Username",
          maxLength: 20,
          dataType: "username",
          required: true,
          onSubmit(value) {
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
          required: false,
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
      fields={[
        {
          fieldName: "Username",
          dataType: "username",
          maxLength: 20,
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
