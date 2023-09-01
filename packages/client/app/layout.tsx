import "./globals.css";
import type { Metadata } from "next";
import { Raleway, Source_Sans_3, Fira_Code } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Bingo Chillin'",
  description: "Bingo board multiplayer thingy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${sourceSans.variable} ${firaCode.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
