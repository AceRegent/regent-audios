"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ShieldCheck,
} from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { formatTime, cn } from "@/lib/utils";

export function LuxuryPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    frequencyData,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    nextTrack,
    prevTrack,
    openLicensingDrawer,
  } = useAudio();

  const [isHoveringScrubber, setIsHoveringScrubber] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0);
  const scrubberRef = useRef<HTMLDivElement | null>(null);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = x / rect.width;
    setHoverPosition(x);
    setHoverTime(percent * duration);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = x / rect.width;
    seek(percent * duration);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      {/* Dynamic Scrubber Line with Crimson/Ruby Pearlescent Gradient */}
      <div
        ref={scrubberRef}
        onMouseEnter={() => setIsHoveringScrubber(true)}
        onMouseLeave={() => setIsHoveringScrubber(false)}
        onMouseMove={handleScrubberMouseMove}
        onClick={handleScrubberClick}
        className="group relative h-2.5 w-full cursor-pointer bg-zinc-950/95 transition-all hover:h-3.5"
      >
        {/* Buffered / Background track */}
        <div className="absolute inset-0 bg-white/[0.06]" />

        {/* Active Progress Bar */}
        <div
          className="relative h-full bg-gradient-to-r from-crimson via-red-500 to-amber-400 transition-all duration-75 shadow-[0_0_15px_#E11D48]"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Glowing Scrubber Head */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_12px_#E11D48] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Hover Time Tooltip */}
        {isHoveringScrubber && (
          <div
            className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded bg-zinc-950/95 border border-crimson/50 px-2 py-0.5 text-[11px] font-mono font-medium text-crimson-light shadow-xl backdrop-blur-md"
            style={{ left: `${hoverPosition}px` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Main Luxury Player Bar */}
      <div className="relative border-t border-crimson/20 bg-[#0a080a]/95 backdrop-blur-2xl px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* LEFT: Current Track Identity */}
          <div className="flex items-center gap-3.5 min-w-0 sm:w-1/4">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 group">
              <Image
                src={currentTrack.artwork_url}
                alt={currentTrack.title}
                fill
                sizes="56px"
                className={cn(
                  "object-cover transition-transform duration-500",
                  isPlaying && "scale-105"
                )}
              />
              {/* Crimson aura pulse on artwork when playing */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-crimson/80 shadow-[inset_0_0_15px_rgba(225,29,72,0.6)] animate-pulse" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-semibold tracking-wide text-white">
                  {currentTrack.title}
                </h4>
                {currentTrack.is_featured && (
                  <span className="hidden sm:inline-flex items-center rounded border border-crimson/40 bg-crimson/15 px-1.5 py-0.2 text-[9px] font-mono tracking-wider text-crimson-light">
                    VAULT
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-zinc-400 font-medium">
                {currentTrack.producer}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-zinc-300">
                  {currentTrack.bpm} BPM
                </span>
                <span className="rounded bg-crimson/[0.08] border border-crimson/20 px-1.5 py-0.5 text-crimson-light">
                  {currentTrack.key}
                </span>
                <span className="hidden md:inline rounded bg-white/[0.04] px-1.5 py-0.5 text-zinc-400">
                  {currentTrack.genre}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Playback Controls & Dynamic Audio Waveform */}
          <div className="flex flex-1 flex-col items-center justify-center max-w-xl">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Previous Track */}
              <button
                onClick={prevTrack}
                aria-label="Previous Beat"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Play / Pause Primary Button (Crimson Pearlescent) */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-crimson via-red-600 to-amber-500 text-white shadow-ruby transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-white stroke-white" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-white stroke-white" />
                )}
              </button>

              {/* Next Track */}
              <button
                onClick={nextTrack}
                aria-label="Next Beat"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Audio Spectrum Visualizer (16 dancing micro-bars in Crimson/Amber) */}
              <div className="hidden lg:flex items-center gap-[3px] h-6 px-3 bg-zinc-950/80 border border-crimson/20 rounded-full">
                {frequencyData.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-[3px] rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, (val / 100) * 22)}px`,
                      backgroundColor: idx % 3 === 0 ? "#F59E0B" : "#E11D48",
                      opacity: isPlaying ? 0.35 + (val / 100) * 0.65 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Time counters under controls */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 mt-1">
              <span className="text-crimson-light font-medium">{formatTime(progress)}</span>
              <span className="text-zinc-600">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* RIGHT: Volume, Licensing CTA & Action Drawer */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 sm:w-1/4">
            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-crimson" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                aria-label="Volume slider"
                className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-crimson"
              />
            </div>

            {/* Instant Licensing Drawer CTA */}
            <button
              onClick={() => openLicensingDrawer(currentTrack)}
              className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-crimson via-red-600 to-amber-500 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-ruby transition-all hover:scale-[1.02] hover:shadow-ruby-lg"
            >
              <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
              <span className="font-semibold">License Beat</span>
              <span className="rounded bg-black/25 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white">
                $29.99+
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
