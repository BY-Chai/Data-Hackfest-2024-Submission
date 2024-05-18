import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./_components/NavBar";

export const metadata: Metadata = {
  title: "Welcome To PathFinder",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar loggedIn={false} />
        <main>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
