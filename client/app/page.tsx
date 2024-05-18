import Link from "next/link";

function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-t from-blue-200 via-transparent to-transparent -z-10" />
      <div className="flex flex-col items-center justify-center space-y-10 pt-56">
        <div className="flex justify-center items-center flex-col">
          <Link
            href="https://data-hackfest-21458.devpost.com/"
            className="bg-black text-white py-1.5 px-4 rounded-full text-[13px]">
            <span>DataHackfest 2024</span>
          </Link>

          <div className="text-5xl md:text-6xl lg:text-[75px] font-semibold text-left sm:text-center pt-2 space-y-0 sm:-space-y-2.5">
            <h1>
              <p>
                Walk{" "}
                <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-yellow-500 ">
                  every day
                </span>
              </p>
              <p>
                with{" "}
                <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">
                  safety
                </span>{" "}
                and{" "}
                <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-purple-500">
                  your mood
                </span>
              </p>
            </h1>

            <p className="font-normal text-sm text-gray-500 text-left md:text-lg sm:text-center pt-2 sm:pt-6 pb-10">
              No need to fret about directions or planning. Pathfinder takes the
              lead, taking care of all your needs ;-)
            </p>
          </div>

          <Link
            className="transition-transform bg-gradient-to-r from-blue-800 to-purple-600 text-white py-3 px-6 rounded-lg hover:scale-105"
            href="/signup">
            Let's Walk!
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
