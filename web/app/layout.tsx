import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MJ PULSE",
  description:
    "High-fidelity Android & Web music streaming app with dynamic genre stations, 5-band studio equalizer, synced karaoke lyrics, and official v1.3.0 APK download.",
  openGraph: {
    title: "MJ PULSE",
    description:
      "High-fidelity Android & Web music streaming app with dynamic genre stations, 5-band studio equalizer, synced karaoke lyrics, and official v1.3.0 APK download.",
  },
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
