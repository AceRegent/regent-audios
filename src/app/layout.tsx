import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { LuxuryPlayerBar } from "@/components/audio/LuxuryPlayerBar";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";

export const metadata: Metadata = {
  title: "REGENT AUDIOS | Boutique Instrumental & Audio Licensing Store",
  description:
    "High-contrast obsidian & pearlescent red online store for instrumental beats, 24-bit multi-track stems, and instantaneous licensing tiers.",
  keywords: [
    "instrumental beats",
    "beat licensing",
    "hip hop beats",
    "trap beats",
    "stems download",
    "audio licensing",
    "royalty free music",
    "regent audios",
  ],
  icons: {
    icon: "/logo-bird.png",
    apple: "/logo-bird.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060607] font-sans text-white antialiased selection:bg-crimson selection:text-white">
        <AudioProvider>
          {/* Interactive Crimson & Peatlescent Animated Background */}
          <InteractiveBackground />

          <div className="relative z-10 flex min-h-screen flex-col pb-28">
            {children}
          </div>

          {/* Persistent global audio player bar across the entire site */}
          <LuxuryPlayerBar />
        </AudioProvider>
      </body>
    </html>
  );
}
