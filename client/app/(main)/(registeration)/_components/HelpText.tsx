import Link from "next/link";

export interface HelpTextReceive {
  before: string;
  after: string;
  linkTo: string;
}

function HelpText({ before, after, linkTo }: HelpTextReceive) {
  return (
    <p className="w-full text-center pt-10 pb-20">
      {before}{" "}
      <Link className="text-blue-700" href={linkTo}>
        {after}
      </Link>
    </p>
  );
}

export default HelpText;
