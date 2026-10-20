"use client";

import React from "react";
import {
  Check,
  X,
  FileText,
  ShieldCheck,
  HelpCircle,
  Download,
  Award,
  Radio,
  Video,
  Music,
} from "lucide-react";
import { LICENSING_TIERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface LicensingPageContentProps {
  onSelectTier?: (tierSlug: string) => void;
}

export function LicensingPageContent({ onSelectTier }: LicensingPageContentProps) {
  const comparisonFeatures = [
    { name: "Untagged Audio File", mp3: "320kbps MP3", wav: "24-Bit WAV + MP3", stems: "WAV + Stems (ZIP)", exclusive: "Master WAV + Stems" },
    { name: "Audio Streams (Spotify, Apple)", mp3: "100,000", wav: "500,000", stems: "Unlimited", exclusive: "Unlimited" },
    { name: "Music Videos", mp3: "1 (Non-Monetized)", wav: "2 (Monetized)", stems: "Unlimited", exclusive: "Unlimited" },
    { name: "Radio Broadcasting Stations", mp3: "None", wav: "Up to 2 Stations", stems: "Unlimited", exclusive: "Unlimited" },
    { name: "Commercial Live Performances", mp3: "Non-Profit", wav: "Up to $2,000 Revenue", stems: "Unlimited", exclusive: "Unlimited" },
    { name: "Trackout Multi-Track Stems", mp3: false, wav: false, stems: true, exclusive: true },
    { name: "Beat Removed from Storefront", mp3: false, wav: false, stems: false, exclusive: true },
    { name: "Full Master Copyright Buyout", mp3: false, wav: false, stems: false, exclusive: true },
    { name: "Signed PDF Legal Bill of Sale", mp3: true, wav: true, stems: true, exclusive: true },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/10 px-3.5 py-1 text-xs font-mono font-semibold text-crimson-light">
          <Award className="h-3.5 w-3.5 text-crimson" />
          <span>LEGAL STANDARDS & RIGHTS REPERTORY</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          LICENSING & CONTRACT MATRIX
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Clear, artist-friendly commercial audio licenses. Every purchase includes an instantly downloadable cryptographic certificate and legally binding PDF license agreement.
        </p>
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-6 backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-4 text-xs font-mono uppercase tracking-wider text-zinc-400">
                Licensing Rights & Terms
              </th>
              {LICENSING_TIERS.map((tier) => (
                <th key={tier.id} className="pb-4 text-center">
                  <span className="block text-sm font-bold text-white uppercase">{tier.name}</span>
                  <span className="font-mono text-base font-black text-amber-400">
                    {formatCurrency(tier.price)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {comparisonFeatures.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 font-medium text-zinc-300">{row.name}</td>

                {/* MP3 */}
                <td className="py-3.5 text-center font-mono">
                  {typeof row.mp3 === "boolean" ? (
                    row.mp3 ? <Check className="h-4 w-4 text-amber-400 mx-auto" /> : <X className="h-4 w-4 text-zinc-600 mx-auto" />
                  ) : (
                    <span className="text-zinc-400">{row.mp3}</span>
                  )}
                </td>

                {/* WAV */}
                <td className="py-3.5 text-center font-mono">
                  {typeof row.wav === "boolean" ? (
                    row.wav ? <Check className="h-4 w-4 text-amber-400 mx-auto" /> : <X className="h-4 w-4 text-zinc-600 mx-auto" />
                  ) : (
                    <span className="text-amber-200 font-semibold">{row.wav}</span>
                  )}
                </td>

                {/* STEMS */}
                <td className="py-3.5 text-center font-mono">
                  {typeof row.stems === "boolean" ? (
                    row.stems ? <Check className="h-4 w-4 text-amber-400 mx-auto" /> : <X className="h-4 w-4 text-zinc-600 mx-auto" />
                  ) : (
                    <span className="text-white font-semibold">{row.stems}</span>
                  )}
                </td>

                {/* EXCLUSIVE */}
                <td className="py-3.5 text-center font-mono">
                  {typeof row.exclusive === "boolean" ? (
                    row.exclusive ? <Check className="h-4 w-4 text-amber-400 mx-auto" /> : <X className="h-4 w-4 text-zinc-600 mx-auto" />
                  ) : (
                    <span className="text-amber-400 font-black">{row.exclusive}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <h3 className="font-sans text-xl font-bold uppercase text-white tracking-wide text-center">
          Frequently Answered Inquiries
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 space-y-2">
            <h4 className="text-sm font-semibold text-amber-300">Are voice tags removed upon purchase?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes, absolutely. All purchased leases (MP3, WAV, Stems, and Exclusive) include clean, un-tagged studio masters with zero voiceover watermarks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 space-y-2">
            <h4 className="text-sm font-semibold text-amber-300">What happens when someone buys Exclusive rights?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The beat is instantly delisted from the Regent Audios storefront forever. Previous non-exclusive leaseholders may finish their granted stream limits, but no new licenses will ever be sold.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 space-y-2">
            <h4 className="text-sm font-semibold text-amber-300">Can I upgrade my license later?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes. If your track blows up past your initial lease stream threshold, you can upgrade to WAV or Stems by simply paying the difference.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 space-y-2">
            <h4 className="text-sm font-semibold text-amber-300">How do multi-track stems work?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You receive a compressed ZIP file containing every individual audio element rendered dry and wet (kicks, 808 sub, hi-hats, percussions, synths, melodies, and FX) at 24-bit/48kHz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
