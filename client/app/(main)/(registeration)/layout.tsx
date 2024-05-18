import NiceBackground from "../../_components/NiceBackground";

function RegistrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-start pt-5 space-y-4">
      <NiceBackground colour="gray" />
      {children}
    </div>
  );
}

export default RegistrationLayout;
