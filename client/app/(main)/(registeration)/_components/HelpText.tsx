import Link from "next/link";

export interface HelpTextReceive {
  before: string;
  after: string;
  linkTo: string;
}

function HelpText({ before, after, linkTo }: HelpTextReceive) {
  return (
    <p className="w-full bg-gray-200 text-center border-2 border-slate-300 py-1 rounded-lg">
      {before}{" "}
      <Link className="text-blue-700" href={linkTo}>
        {after}
      </Link>
    </p>
  );
}

export default HelpText;
