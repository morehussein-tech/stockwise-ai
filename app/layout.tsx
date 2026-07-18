import type { Metadata } from "next";
import "./globals.css";
import "./handoff.css";

export const metadata: Metadata = {
  title: "StockWise AI | Restaurant intelligence",
  description: "AI-powered restaurant inventory, wastage and profitability assistant.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
