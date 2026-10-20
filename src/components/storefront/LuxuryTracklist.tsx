"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  ShieldCheck,
  Share2,
  Info,
  Clock,
  Sparkles,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Beat } from "@/types";
import { useAudio } from "@/context/AudioContext";
import { formatTime, cn } from "@/lib/utils";

interface LuxuryTracklistProps {
  beats: Beat[];
  viewMode: "list" | "grid";
  onSelectBeatDetail: (beat: Beat) => void;
}

export function LuxuryTracklist({
  beats,
  viewMode,
  onSelectBeatDetail,
}: LuxuryTracklistProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, openLicensingDrawer } = useAudio();
  const [hoveredBeatId, setHoveredBeatId] = useState<string | null>(null);

  if (beats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
        <Sparkles className="h-10 w-10 text-crimson mb-3" />
        <h3 className="text-lg font-semibold text-white">No beats match your criteria</h3>
        <p className="text-sm text-zinc-500 max-w-sm mt-1">
          Try adjusting your BPM range, key signature, or genre search.
        </p>
      </div>
    );
  }

  // LIST VIEW: High-end tabular list with fluid Framer Motion sliding hover background
  if (viewMode === "list") {
    return (
      <div
        onMouseLeave={() => setHoveredBeatId(null)}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a0c]/70 backdrop-blur-xl"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 items-center border-b border-white/[0.08] px-4 py-3 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5 sm:col-span-4">Track Title & Producer</div>
          <div className="hidden sm:block sm:col-span-2 text-center">BPM / Key</div>
          <div className="hidden md:block md:col-span-2 text-center">Genre</div>
          <div className="hidden lg:block lg:col-span-1 text-center">Time</div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 text-right pr-2">License</div>
        </div>

        {/* Track Rows */}
        <div className="relative divide-y divide-white/[0.04]">
          {beats.map((beat, index) => {
            const isThisTrackPlaying = currentTrack?.id === beat.id && isPlaying;
            const isThisTrackActive = currentTrack?.id === beat.id;
            const isHovered = hoveredBeatId === beat.id;

            return (
              <div
                key={beat.id}
                onMouseEnter={() => setHoveredBeatId(beat.id)}
                className="group relative grid grid-cols-12 items-center px-4 py-3.5 transition-colors cursor-pointer select-none"
                onClick={() => {
                  if (isThisTrackActive) {
                    togglePlay();
                  } else {
                    playTrack(beat);
                  }
                }}
              >
                {/* Framer Motion Sliding Hover Highlight: layoutId="trackHoverBg" with Peatlescent Red glow */}
                {isHovered && (
                  <motion.div
                    layoutId="trackHoverBg"
                    className="absolute inset-0 z-0 bg-crimson/[0.04] border-y border-crimson/30 backdrop-blur-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Col 1: Play button / Track Number */}
                <div className="relative z-10 col-span-1 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isThisTrackActive) {
                        togglePlay();
                      } else {
                        playTrack(beat);
                      }
                    }}
                    aria-label={isThisTrackPlaying ? "Pause" : "Play"}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      isThisTrackPlaying
                        ? "bg-gradient-to-tr from-crimson to-red-600 text-white shadow-ruby scale-105"
                        : "text-zinc-400 group-hover:bg-crimson/20 group-hover:text-white"
                    )}
                  >
                    {isThisTrackPlaying ? (
                      <Pause className="h-4 w-4 fill-white stroke-white" />
                    ) : isHovered ? (
                      <Play className="ml-0.5 h-4 w-4 fill-white stroke-white" />
                    ) : (
                      <span className="text-xs font-mono text-zinc-500 group-hover:hidden">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    )}
                  </button>
                </div>

                {/* Col 2: Artwork & Title & Producer Tag */}
                <div className="relative z-10 col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0 pr-2">
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 group-hover:border-crimson/40 transition-colors">
                    <Image
                      src={beat.artwork_url}
                      alt={beat.title}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                    {isThisTrackPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Volume2 className="h-4 w-4 text-crimson-light animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={cn(
                          "truncate text-sm font-semibold tracking-wide transition-colors",
                          isThisTrackActive
                            ? "text-crimson-light font-bold"
                            : "text-white group-hover:text-crimson-light"
                        )}
                      >
                        {beat.title}
                      </h4>
                      {beat.is_featured && (
                        <span className="hidden xl:inline-flex rounded bg-crimson/15 px-1.5 py-0.2 text-[9px] font-mono text-crimson-light border border-crimson/30">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-zinc-400">
                      {beat.producer}
                    </p>
                  </div>
                </div>

                {/* Col 3: BPM / Key (Technical monospace) */}
                <div className="relative z-10 hidden sm:flex sm:col-span-2 items-center justify-center gap-2 font-mono text-xs">
                  <span className="rounded bg-white/[0.05] px-2 py-0.5 text-zinc-300">
                    {beat.bpm} BPM
                  </span>
                  <span className="rounded bg-crimson/[0.08] border border-crimson/20 px-2 py-0.5 text-crimson-light">
                    {beat.key}
                  </span>
                </div>

                {/* Col 4: Genre Badge */}
                <div className="relative z-10 hidden md:flex md:col-span-2 items-center justify-center">
                  <span className="rounded-full border border-white/10 bg-zinc-900/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                    {beat.genre}
                  </span>
                </div>

                {/* Col 5: Duration */}
                <div className="relative z-10 hidden lg:flex lg:col-span-1 items-center justify-center text-xs font-mono text-zinc-500">
                  {formatTime(beat.duration || 180)}
                </div>

                {/* Col 6: Instant License Button & Action */}
                <div className="relative z-10 col-span-6 sm:col-span-3 lg:col-span-2 flex items-center justify-end gap-2 pr-1">
                  {/* Info modal trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBeatDetail(beat);
                    }}
                    title="Track details & stems breakdown"
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </button>

                  {/* License Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLicensingDrawer(beat);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-crimson/40 bg-crimson/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-crimson-light transition-all hover:bg-gradient-to-r hover:from-crimson hover:to-amber-500 hover:text-white hover:shadow-ruby"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>$29.99+</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // GRID VIEW: Boutique Luxury Cards with artwork, hover effects, play triggers
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {beats.map((beat) => {
        const isThisTrackPlaying = currentTrack?.id === beat.id && isPlaying;
        const isThisTrackActive = currentTrack?.id === beat.id;

        return (
          <div
            key={beat.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0b0d]/80 p-4 transition-all duration-300 hover:border-crimson/50 hover:shadow-ruby"
          >
            {/* Top Artwork with Play Overlay */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 group-hover:border-crimson/30">
              <Image
                src={beat.artwork_url}
                alt={beat.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

              {/* Badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-crimson-light border border-crimson/30 backdrop-blur-md">
                  {beat.bpm} BPM
                </span>
                <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-white/20 backdrop-blur-md">
                  {beat.key}
                </span>
              </div>

              {/* Direct Play Center Button */}
              <button
                onClick={() => {
                  if (isThisTrackActive) {
                    togglePlay();
                  } else {
                    playTrack(beat);
                  }
                }}
                aria-label={isThisTrackPlaying ? "Pause" : "Play"}
                className={cn(
                  "absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300",
                  isThisTrackPlaying
                    ? "bg-gradient-to-tr from-crimson to-amber-500 text-white shadow-ruby scale-100 opacity-100"
                    : "bg-black/80 text-white border border-white/20 opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-crimson hover:text-white"
                )}
              >
                {isThisTrackPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="ml-1 h-6 w-6 fill-current" />
                )}
              </button>

              {/* Bottom Tag inside card image */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="rounded bg-black/70 px-2 py-0.5 backdrop-blur-md">
                  {beat.genre}
                </span>
                <span className="font-mono text-white/80">
                  {formatTime(beat.duration || 180)}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="mt-3.5 space-y-1">
              <h4 className="truncate font-sans text-base font-bold text-white group-hover:text-crimson-light transition-colors">
                {beat.title}
              </h4>
              <p className="truncate text-xs text-zinc-400">
                {beat.producer}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
              <button
                onClick={() => onSelectBeatDetail(beat)}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Inspect Stems
              </button>

              <button
                onClick={() => openLicensingDrawer(beat)}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-crimson via-red-600 to-amber-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-105 shadow-ruby"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>$29.99+</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
