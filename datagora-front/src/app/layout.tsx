"use client";

import { Header } from "@/components/Header";
import "./globals.css";

import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

import { Lato } from "next/font/google";
import Footer from "@/components/Footer";

const lato = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`myTheme ${lato.className}`}>
      <HeadComponent />
      <body className="relative">
        <Providers>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "black",
                padding: "16px",
                color: "white",
                overflow: "scroll",
              },
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

const HeadComponent = () => (
  <head>
    {/* Basic Metadata */}
    <title>Datagora • Find Data You Need</title>
    <meta
      name="description"
      content={"Datagora is a platform where you can find data you need."}
    />

    {/* Icons for Light and Dark Modes */}
    <link rel="icon" type="image/png" href="/icon.png" />

    {/* Open Graph Metadata */}
    <meta property="og:title" content="Datagora • Find Data You Need" />
    <meta
      property="og:description"
      content={"Datagora is a platform where you can find data you need."}
    />
    <meta property="og:url" content="https://datagora.vercel.app" />
    <meta property="og:site_name" content="Datagora" />
    <meta
      property="og:image"
      content="https://datagora.vercel.app/banner.jpg"
    />
    <meta property="og:locale" content="en-US" />
    <meta property="og:type" content="website" />
  </head>
);
