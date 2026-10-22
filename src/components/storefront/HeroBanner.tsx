"use client";

import React from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Disc,
  ArrowRight,
  Flame,
  Zap,
  Download,
} from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { Beat } from "@/types";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  featuredBeat: Beat;
}

export function HeroBanner({ featuredBeat }: HeroBannerProps) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    openLicensingDrawer,
    openFreeDownloadModal,
    licenses,
  } = useAudio();

  const isCurrentPlaying = currentTrack?.id === featuredBeat.id && isPlaying;
  const startingPrice = licenses.length > 0 ? Math.min(...licenses.map((l) => l.price)) : 29.99;

  const handleFeaturedPlay = () => {
    if (currentTrack?.id === featuredBeat.id) {
      togglePlay();
    } else {
      playTrack(featuredBeat);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-crimson/25 bg-gradient-to-b from-[#150d11]/80 via-zinc-950/90 to-[#070607] p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_-15px_rgba(225,29,72,0.25)] backdrop-blur-2xl">
      {/* Background ambient lighting effects (Crimson & Pearlescent Gold) */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-crimson/15 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-amber-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-crimson/[0.06] via-transparent to-transparent" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        
        {/* Left Column: Brand Statement & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-crimson/40 bg-crimson/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-crimson-light">
            <Sparkles className="h-3.5 w-3.5 text-crimson animate-pulse" />
            <span>WELCOME TO REGENT AUDIOS • OFFICIAL SOUND VAULT</span>
          </div>

          <h1 className="font-sans text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            WELCOME TO <br />
            <span className="bg-gradient-to-r from-crimson-light via-red-500 to-amber-400 bg-clip-text text-transparent">
              REGENT AUDIOS.
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-zinc-300 font-normal">
            Welcome to your premier destination for boutique instrumental beats, industry-grade 24-bit multi-track stems, and instant commercial licensing. Crafted for recording artists, songwriters, and creators ready to shape their next sound.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 border-y border-white/[0.08] py-4 max-w-lg">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">24-BIT</div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Lossless WAVs</p>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-crimson-light">100%</div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Royalty-Free</p>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">INSTANT</div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Stem Delivery</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={handleFeaturedPlay}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-ruby transition-all hover:scale-[1.02] hover:shadow-ruby-lg active:scale-95"
            >
              {isCurrentPlaying ? (
                <Pause className="h-4 w-4 fill-white stroke-white" />
              ) : (
                <Play className="h-4 w-4 fill-white stroke-white ml-0.5" />
              )}
              <span>{isCurrentPlaying ? "Pause Preview" : "Play Spotlight Beat"}</span>
            </button>

            <button
              onClick={() => openFreeDownloadModal(featuredBeat)}
              className="flex items-center gap-2 rounded-xl border border-crimson/50 bg-crimson/10 px-5 py-3.5 text-sm font-semibold tracking-wide text-crimson-light transition-all hover:bg-crimson/20"
            >
              <Download className="h-4 w-4 text-crimson" />
              <span>Free Audition MP3</span>
            </button>

            <button
              onClick={() => openLicensingDrawer(featuredBeat)}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:border-crimson/60 hover:bg-white/[0.08]"
            >
              <ShieldCheck className="h-4 w-4 text-crimson" />
              <span>Commercial Lease (${startingPrice.toFixed(2)}+)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Featured Beat Showcase Glass Card */}
        <div className="lg:col-span-5">
          <div className="group relative overflow-hidden rounded-2xl border border-crimson/30 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl transition-all hover:border-crimson/60 hover:shadow-ruby">
            
            {/* Artwork Banner */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10">
              <Image
                src={featuredBeat.artwork_url}
                alt={featuredBeat.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Spotlight Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md border border-crimson/50 bg-black/80 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-crimson-light backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-crimson" />
                SPOTLIGHT BEAT
              </div>

              {/* Direct Play Overlay Button */}
              <button
                onClick={handleFeaturedPlay}
                aria-label="Play Featured Beat"
                className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-crimson to-amber-500 text-white shadow-ruby transition-all duration-300 hover:scale-110 active:scale-95 group-hover:opacity-100"
              >
                {isCurrentPlaying ? (
                  <Pause className="h-7 w-7 fill-white stroke-white" />
                ) : (
                  <Play className="ml-1 h-7 w-7 fill-white stroke-white" />
                )}
              </button>

              {/* Bottom Artwork Info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-sans text-xl font-black uppercase tracking-wide text-white">
                    {featuredBeat.title}
                  </h3>
                  <p className="text-xs font-medium text-zinc-300">
                    Produced by {featuredBeat.producer}
                  </p>
                </div>
                <div className="flex gap-1.5 font-mono text-[10px]">
                  <span className="rounded bg-black/80 px-2 py-0.5 text-crimson-light border border-crimson/40">
                    {featuredBeat.bpm} BPM
                  </span>
                  <span className="rounded bg-black/80 px-2 py-0.5 text-white/90 border border-white/20">
                    {featuredBeat.key}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Waveform Simulator with crimson & amber bars */}
            <div className="mt-4 flex items-center justify-between gap-1 h-8 px-2 bg-zinc-900/50 rounded-lg border border-white/[0.05]">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 rounded-full transition-all duration-150",
                    isCurrentPlaying
                      ? i % 2 === 0
                        ? "bg-crimson"
                        : "bg-amber-400"
                      : "bg-zinc-700 hover:bg-zinc-500"
                  )}
                  style={{
                    height: isCurrentPlaying
                      ? `${Math.max(20, Math.sin(i * 0.5 + Date.now() / 200) * 80 + 20)}%`
                      : `${((i * 13) % 70) + 20}%`,
                  }}
                />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                Genre: <span className="text-white font-semibold">{featuredBeat.genre}</span>
              </span>
              <button
                onClick={() => openLicensingDrawer(featuredBeat)}
                className="flex items-center gap-1.5 text-xs font-bold text-crimson-light hover:text-white transition-colors"
              >
                <span>View Licensing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
