interface FormTextReceive {
  content: string;
}

function FormTitle({ content }: FormTextReceive) {
  return <h1 className="font-semibold text-3xl pb-3">{content}</h1>;
}

export default FormTitle;
