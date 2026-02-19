import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solix — Peer-to-Peer Energy Trading",
  description: "Decentralized energy marketplace powered by blockchain smart contracts.",
};

import { Web3Provider } from "@/providers/web3-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
