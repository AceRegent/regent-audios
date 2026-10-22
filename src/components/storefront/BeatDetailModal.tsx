"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  Play,
  Pause,
  Layers,
  Sparkles,
  ShieldCheck,
  Disc,
  Clock,
  Music,
  Share2,
  Download,
} from "lucide-react";
import { Beat } from "@/types";
import { useAudio } from "@/context/AudioContext";
import { formatTime, cn } from "@/lib/utils";

interface BeatDetailModalProps {
  beat: Beat | null;
  onClose: () => void;
  onOpenLicense: (beat: Beat) => void;
}

export function BeatDetailModal({
  beat,
  onClose,
  onOpenLicense,
}: BeatDetailModalProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, openFreeDownloadModal, licenses } = useAudio();

  if (!beat) return null;

  const startingPrice = licenses.length > 0 ? Math.min(...licenses.map((l) => l.price)) : 29.99;

  const isCurrentPlaying = currentTrack?.id === beat.id && isPlaying;

  const stemsList = [
    { name: "Kick & 808 Sub", format: "24-Bit WAV", size: "18.4 MB" },
    { name: "Snares, Claps & Percs", format: "24-Bit WAV", size: "14.2 MB" },
    { name: "Hi-Hats & Rolls", format: "24-Bit WAV", size: "9.8 MB" },
    { name: "Main Synth Chords & Melodies", format: "24-Bit WAV", size: "32.1 MB" },
    { name: "Atmospheric FX & Risers", format: "24-Bit WAV", size: "12.6 MB" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0c0c0e] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Artwork & Quick Play */}
          <div className="relative h-44 w-44 flex-shrink-0 mx-auto sm:mx-0 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={beat.artwork_url}
              alt={beat.title}
              fill
              className="object-cover"
            />
            <button
              onClick={() => {
                if (currentTrack?.id === beat.id) {
                  togglePlay();
                } else {
                  playTrack(beat);
                }
              }}
              className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-gold hover:scale-105 transition-all"
            >
              {isCurrentPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="ml-1 h-6 w-6 fill-current" />
              )}
            </button>
          </div>

          {/* Metadata */}
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-mono text-amber-400 border border-amber-500/30">
              <Sparkles className="h-3 w-3" />
              <span>REGENT MASTER VAULT</span>
            </div>

            <h3 className="font-sans text-2xl font-black uppercase tracking-wide text-white">
              {beat.title}
            </h3>

            <p className="text-sm text-zinc-400">
              Composed and engineered by <span className="text-white font-medium">{beat.producer}</span>
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="rounded-lg bg-zinc-900/80 p-2 text-center border border-white/5">
                <span className="block text-[10px] font-mono text-zinc-500">TEMPO</span>
                <span className="font-mono text-xs font-bold text-white">{beat.bpm} BPM</span>
              </div>
              <div className="rounded-lg bg-zinc-900/80 p-2 text-center border border-white/5">
                <span className="block text-[10px] font-mono text-zinc-500">SCALE / KEY</span>
                <span className="font-mono text-xs font-bold text-amber-300">{beat.key}</span>
              </div>
              <div className="rounded-lg bg-zinc-900/80 p-2 text-center border border-white/5">
                <span className="block text-[10px] font-mono text-zinc-500">GENRE</span>
                <span className="font-mono text-xs font-bold text-white">{beat.genre}</span>
              </div>
            </div>

            {/* Tags */}
            {beat.tags && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {beat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stems & Trackout Breakdown section */}
        <div className="mt-6 border-t border-white/[0.08] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <Layers className="h-4 w-4 text-amber-400" />
              Included Multi-Track Stems Archive
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">Available with Stems & Exclusive tier</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {stemsList.map((stem, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-3 py-1.5 text-xs border border-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <Music className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-zinc-200">{stem.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
                  <span>{stem.format}</span>
                  <span className="text-zinc-600">|</span>
                  <span>{stem.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
          <button
            onClick={() => {
              onClose();
              openFreeDownloadModal(beat);
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-crimson/50 bg-crimson/10 px-4 py-2.5 text-xs font-semibold text-crimson-light hover:bg-crimson/20 transition-all"
          >
            <Download className="h-4 w-4 text-crimson" />
            <span>Download Free Audition MP3</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLicense(beat);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-ruby hover:scale-[1.02] transition-transform"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Select License Tier (${startingPrice.toFixed(2)}+)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
