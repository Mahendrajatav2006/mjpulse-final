import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MJ PULSE - Web Player & Streaming Cloud",
  description: "Next.js Web Player powered by YouTube Service and Firebase Backend",
  manifest: "/manifest.json",
  themeColor: "#FF007F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
