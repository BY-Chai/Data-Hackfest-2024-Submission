interface FormTextReceive {
  content: string;
}

function FormTitle({ content }: FormTextReceive) {
  return <h1 className="font-semibold text-3xl">{content}</h1>;
}

export default FormTitle;
