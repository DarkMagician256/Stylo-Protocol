import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NeuralFieldWrapper } from "@/components/NeuralFieldWrapper";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STYLO — Institutional Agentic DeFi",
  description:
    "Sovereign AI Infrastructure for Institutional DeFi. Bridging US Treasuries (Ondo USDY & OpenEden TBILL) with Arbitrum liquidity via an autonomous agentic execution layer.",
  keywords: ["DeFi", "RWA", "Arbitrum", "AI", "Ondo", "OpenEden", "Stylus"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ background: "#0a0a0a" }}>
        <div className="relative min-h-screen flex flex-col">
          <NeuralFieldWrapper />
          <Navbar />
          <main className="flex-1" style={{ position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
