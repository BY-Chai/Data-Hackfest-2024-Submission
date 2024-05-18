function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-12 md:max-w-3xl lg:max-w-5xl px-5 mx-auto">
      {children}
    </div>
  );
}

export default RootLayout;
