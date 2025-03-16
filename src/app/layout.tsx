import type { Metadata } from "next";
import { Mulish, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { Toaster } from "../components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: "Cars Yard",
  description: "Cars Yard is a car marketplace that allows you to buy and sell cars online.",
};

const mulish = Mulish({
  weight: "variable", // Allows the font to support multiple weights dynamically
  subsets: ["latin"], // Specifies that we are loading only the Latin character subset
  variable: "--font-heading", // Assigns a CSS variable to be used in styles (for headings)
  display: "swap", // Uses a fallback font until the custom font is fully loaded, improving performance
});

const roboto = Roboto({
  weight: "400", // Specifies a fixed font weight of 400 (regular)
  subsets: ["latin"], // Loads only the Latin character subset
  variable: "--font-body", // Assigns a CSS variable to be used in styles (for body text)
  display: "swap", // Uses a fallback font while the custom font loads
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased bg-background`, roboto.variable, mulish.variable)}
      >
        <NextTopLoader showSpinner={false} />

        <NuqsAdapter>
          {children}
        </NuqsAdapter>

        <Toaster />
      </body>
    </html>
  );
}
