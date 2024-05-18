function RegistrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-start pt-14 space-y-4">
      {children}
    </div>
  );
}

export default RegistrationLayout;
