import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Welcome To PathFinder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body>
        <NavBar loggedIn={false} />
        <main className="px-5">{children}</main>
      </body>
    </html>
  );
}
