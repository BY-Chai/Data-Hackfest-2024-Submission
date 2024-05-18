interface NiceBackgroundReceive {
  colour: string;
  shade?: number;
}

function NiceBackground({ colour, shade }: NiceBackgroundReceive) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen -z-10 bg-gradient-to-t from-${colour}${
        shade ? `-${shade}` : colour === "black" ? "" : "-200"
      } via-transparent to-transparent`}
    />
  );
}

export default NiceBackground;
