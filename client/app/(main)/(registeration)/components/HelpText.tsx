import Link from "next/link";

interface HelpTextReceive {
  before: string;
  after: string;
  linkTo: string;
}

function HelpText({ before, after, linkTo }: HelpTextReceive) {
  return (
    <span>
      {before}{" "}
      <Link className="text-blue-700" href={linkTo}>
        {after}
      </Link>
    </span>
  );
}

export default HelpText;
