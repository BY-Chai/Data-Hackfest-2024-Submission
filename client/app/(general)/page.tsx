import Link from "next/link";

function Home() {
  return (
    <>
      <Link
        href="https://data-hackfest-21458.devpost.com/"
        className="bg-black text-white py-1.5 px-4 rounded-full text-[13px]">
        <span>DataHackfest 2024</span>
      </Link>

      <div className="text-5xl md:text-6xl lg:text-[75px] font-semibold text-center pt-2 space-y-0 sm:-space-y-2.5">
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

        <p className="font-normal text-sm text-gray-500 md:text-lg text-center pt-2 sm:pt-6 pb-10">
          No need to fret about directions or planning. Pathfinder takes the
          lead, taking care of all your needs ;-)
        </p>
      </div>

      <Link
        className="transition-transform bg-gradient-to-r from-blue-800 to-purple-600 text-white py-3 px-6 rounded-lg hover:scale-105"
        href="/signup">
        Let's Walk!
      </Link>

      <div className="flex flex-col text-2xl md:text-3xl lg:text-4xl font-semibold pt-2 space-y-0 sm:-space-y-2.5 py-2 sm:py-3 lg:py-4 text-center">
        <h1>
            <p>
              WHAT MAKES US{" "}
              <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-yellow-500 text-4xl md:text-5xl lg:text-6xl">
                DIFFERENT
              </span>
            </p>
        </h1>
        <div className="flex flex-col gap-4 sm:gap-10 lg:gap-20 py-24">
          <div className="flex flex-row">
            <p className="flex justify-center basis-1/2 items-center w-1/2 font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400 text-3xl md:text-4xl lg:text-5xl">Health</p>
            <p className="flex justify-center basis-1/2 w-1/2 font-normal text-1xl md:text-1.5xl lg:text-2xl px-2">Our paths keep you safe from the highly polluted areas and take you along greener scenic routes. </p>
          </div>    
          <div className="flex flex-row-reverse">
            <p className="flex justify-center basis-1/2 w-1/2 items-center font-black bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-yellow-500 text-3xl md:text-4xl lg:text-5xl">Pollen</p>
            <p className="flex justify-center basis-1/2 w-1/2 font-normal text-1xl md:text-1.5xl lg:text-2xl px-2">Got allergies? We've got you covered. If you're in Spring season, we'll take you on paths that tend to have lower levels of pollen to keep you from sneezing!</p>
          </div>    
          <div className="flex flex-row">
            <div className="flex justify-center basis-1/2 w-1/2 items-center font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-purple-500 text-3xl md:text-4xl lg:text-5xl">Traffic</div>
            <div className="flex justify-center basis-1/2 w-1/2 font-normal text-1xl md:text-1.5xl lg:text-2xl px-2">No one likes to listen to the sound of traffic, we'll try to take you along safer walkable paths to make sure your experience is the best.</div>
          </div>    
          <div className="flex flex-row-reverse">
            <p className="flex justify-center basis-1/2 w-1/2 items-center font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-purple-600 text-3xl md:text-4xl lg:text-5xl">Safety</p>
            <p className="flex justify-center basis-1/2 font-normal text-1xl md:text-1.5xl lg:text-2xl px-2">Walking at night can be scary for all! We'll take you on paths which have more lighting to ensure comfort in your night walks whether alone or with your loved ones.</p>
          </div>    
        </div>  
      </div>

    </>
  );
}

export default Home;
