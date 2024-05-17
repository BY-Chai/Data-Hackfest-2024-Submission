import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex justify-center items-center h-full flex-col">
        <h1 className="text-6xl font-bold">PathFinder</h1>
        <p className="font-semibold p-2 sm:p-4 lg:p-6">No need to fret about directions or planning. Pathfinder takes the lead, taking care of all your needs ;-)</p>
      </div>
    </div>
  );
}
