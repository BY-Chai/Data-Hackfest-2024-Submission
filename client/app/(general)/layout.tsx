import NiceBackground from "../_components/NiceBackground";

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center px-5 pt-48">
      <NiceBackground colour="purple" />
      {children}
    </div>
  );
}

export default RootLayout;
