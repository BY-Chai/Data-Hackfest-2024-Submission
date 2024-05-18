"use client";

type SignFormFields =
  | "Username"
  | "Email"
  | "Password"
  | "Name"
  | "Birthday"
  | "Residential Address";

type SignFormFieldTypes =
  | "username"
  | "string"
  | "number"
  | "email"
  | "password"
  | "date"
  | "location";

type SignFormFieldInfo = {
  fieldName: SignFormFields;
  required: boolean;
  dataType: SignFormFieldTypes;
  onSubmit?: (value: string) => boolean | Promise<boolean>;
};

interface SignFormReceive {
  fields: SignFormFieldInfo[];
}

function SignForm({ fields }: SignFormReceive) {
  return (
    <div className="w-full max-w-md space-y-5">
      {fields.map((currentField, currentFieldIndex) => (
        <div key={currentFieldIndex} className="w-full space-y-1.5">
          <label className="" htmlFor={currentField.fieldName}>
            {currentField.fieldName}
            {currentField.required && <span className="text-red-500">*</span>}
          </label>
          <input
            className="transition-colors w-full border border-gray-200 py-1.5 px-3 rounded-md hover:border-gray-500 focus:border-gray-500 focus:outline-none"
            id={currentField.fieldName}
          />
        </div>
      ))}
    </div>
  );
}

export function SignUpForm() {
  return (
    <SignForm
      fields={[
        {
          fieldName: "Username",
          dataType: "username",
          required: true,
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
          dataType: "location",
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
