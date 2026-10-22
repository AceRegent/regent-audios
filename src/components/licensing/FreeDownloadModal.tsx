"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Download,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Flame,
  ArrowRight,
  Music,
} from "lucide-react";
import { Beat } from "@/types";
import { useAudio } from "@/context/AudioContext";
import confetti from "canvas-confetti";

interface FreeDownloadModalProps {
  isOpen: boolean;
  beat: Beat | null;
  onClose: () => void;
}

export function FreeDownloadModal({ isOpen, beat, onClose }: FreeDownloadModalProps) {
  const { addLead, openLicensingDrawer } = useAudio();
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !beat) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address to receive your download.");
      return;
    }

    setErrorMsg("");

    // 1. Add lead to local CRM state
    addLead(artistName || "Independent Artist", email, beat);

    // 2. Trigger direct client-side file download
    const link = document.createElement("a");
    link.href = beat.tagged_audio_url;
    link.download = `${beat.title}_Tagged_Audition_Demo.mp3`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3. Trigger celebration confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E11D48", "#F59E0B", "#FFFFFF", "#DC2626"],
    });

    setIsSubmitted(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("REGENT20");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUpgradeToCommercial = () => {
    onClose();
    setIsSubmitted(false);
    openLicensingDrawer(beat);
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    setArtistName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-crimson/40 bg-[#0d0a0c] p-6 sm:p-8 shadow-[0_0_60px_rgba(225,29,72,0.35)]">
        
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/[0.08] pb-5">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-crimson/30 shadow-ruby">
                <Image
                  src={beat.artwork_url}
                  alt={beat.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-crimson-light">
                  <Download className="h-3 w-3 text-crimson" />
                  <span>FREE AUDITION DEMO</span>
                </div>
                <h3 className="font-sans text-xl font-black uppercase text-white mt-1">
                  {beat.title}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {beat.bpm} BPM • {beat.key} • {beat.producer}
                </p>
              </div>
            </div>

            {/* Explainer */}
            <div className="py-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Download the high-quality voice-tagged reference track for songwriting, demo recording, and auditioning.
              </p>
            </div>

            {/* Lead Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Artist / Stage Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Travis Vance"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-crimson"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-400 font-mono">{errorMsg}</div>
              )}

              {/* Legal Notice */}
              <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 text-[11px] text-zinc-400 space-y-1">
                <span className="font-semibold text-white block">Non-Commercial License Terms:</span>
                <p>
                  This download is strictly for non-profit evaluation and writing. Commercial distribution to Spotify, Apple Music, and YouTube requires a paid commercial lease.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-ruby hover:scale-[1.01] transition-all"
              >
                <Download className="h-4 w-4 stroke-[2.5]" />
                <span>Unlock Free Audition MP3</span>
              </button>
            </form>
          </div>
        ) : (
          /* Success & Instant Conversion Pitch */
          <div className="text-center space-y-5 py-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-sans text-2xl font-black uppercase text-white">
                Download Commenced!
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Your tagged audition demo for <strong className="text-white">{beat.title}</strong> is downloading to your device.
              </p>
            </div>

            {/* Promotional Offer Box */}
            <div className="rounded-2xl border border-crimson/50 bg-gradient-to-b from-crimson/[0.12] to-transparent p-5 text-left space-y-3 shadow-ruby">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-crimson animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-crimson-light">
                    Exclusive Artist Offer (20% Off)
                  </span>
                </div>
                <span className="rounded bg-crimson/20 border border-crimson/40 px-2 py-0.5 text-[10px] font-mono text-crimson-light">
                  Limited Time
                </span>
              </div>

              <p className="text-xs text-zinc-300">
                Ready to drop your vocals on Spotify and Apple Music? Use your VIP producer discount code to unlock clean 24-bit WAVs and multi-track stems.
              </p>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/60 p-2.5">
                <code className="font-mono text-base font-black text-amber-400 tracking-widest pl-2">
                  REGENT20
                </code>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-mono text-white transition-colors"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            {/* Commercial Upgrade CTA */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleUpgradeToCommercial}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-ruby hover:scale-[1.01] transition-transform"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Apply Code & View Commercial Leases</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleModalClose}
                className="text-xs font-mono text-zinc-500 hover:text-white transition-colors block mx-auto pt-1"
              >
                Close and return to storefront
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
