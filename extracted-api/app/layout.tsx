import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mj-pulse.web.app"),
  title: "MJ PULSE - Next-Gen Lossless Cyberpunk Music Player & Android App",
  description: "Experience ultra-crisp lossless audio, 3D particle wave visualizer, hardware key shortcuts, synced lyrics, and real-time interactive home widget. Download MJ PULSE APK or stream online.",
  keywords: ["MJ Pulse", "music player", "lossless audio", "cyberpunk player", "android music app", "audio equalizer", "synced lyrics"],
  authors: [{ name: "Mahendra Pratap" }],
  openGraph: {
    title: "MJ PULSE | Lossless Cyberpunk Audio Platform",
    description: "Stream high-definition music directly in your browser or download the native Android app for hardware-key remapping & interactive widgets.",
    url: "https://mjpulse.live",
    siteName: "MJ PULSE",
    images: [
      {
        url: "/screenshots/MJ Pulse Neon Music Dashboard web.png",
        width: 1200,
        height: 630,
        alt: "MJ PULSE Music Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen cyber-gradient-bg antialiased selection:bg-purple-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
