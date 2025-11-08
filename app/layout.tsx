import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Web3Provider } from "@/components/providers/web3-provider";

export const metadata: Metadata = {
  title: "Basant Singh Dobal - Blockchain Developer & Smart Contract Engineer",
  description: "Full-stack blockchain developer specializing in smart contracts, DeFi, and Web3 applications. Explore my portfolio, courses, and blog.",
  keywords: ["blockchain", "smart contracts", "web3", "ethereum", "solidity", "defi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Web3Provider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
