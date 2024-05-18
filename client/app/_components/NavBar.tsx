import PathFinderLogo from "@public/pathfinder.svg";
import Image from "next/image";
import Link from "next/link";

interface NavBarReceive {
  loggedIn: boolean;
}

function NavBar({ loggedIn }: NavBarReceive) {
  return (
    <nav className="px-5 py-2 fixed top-0 left-0 w-full flex items-center justify-between bg-transparent backdrop-blur-md *:flex *:space-x-2 border-b border-b-slate-200">
      <Link href="/">
        <Image
          src={PathFinderLogo}
          alt="PathFinder Logo"
          width={34}
          height={34}
        />
      </Link>

      <div>
        <NavBarLink
          linkTo="https://github.com/BY-Chai/Data-Hackfest-2024-Submission"
          innerText="GitHub"
          isExternal
        />

        {loggedIn ? (
          <>
            <NavBarLink linkTo="/profile" innerText="Profile" />
          </>
        ) : (
          <>
            <NavBarLink linkTo="/signup" innerText="Join" />
          </>
        )}
      </div>
    </nav>
  );
}

interface NavBarLinkReceive {
  linkTo: string;
  innerText: string;
  isExternal?: boolean;
}

export function NavBarLink({
  linkTo,
  innerText,
  isExternal,
}: NavBarLinkReceive) {
  return (
    <Link
      className="transition-colors py-1 px-3 shadow-black border border-transparent rounded-md hover:bg-opacity-40 hover:bg-gray-300 hover:border-gray-300 hover:shadow-sm focus:bg-opacity-40 focus:bg-gray-300 focus:border-gray-300 focus:shadow-sm focus:outline-none"
      href={linkTo}
      target={isExternal ? "_blank" : "_parent"}>
      <span>{innerText}</span>
    </Link>
  );
}

export default NavBar;
