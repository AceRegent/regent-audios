"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  FileCheck,
  ShieldCheck,
  Music,
  FileArchive,
  Layers,
  Crown,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DownloadPortalProps {
  token: string;
}

export function DownloadPortal({ token }: DownloadPortalProps) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // Sample order matching the token
  const orderDetails = {
    id: "REG-" + token.slice(-6).toUpperCase(),
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    buyerEmail: "artist@regentaudios.vip",
    buyerName: "Certified Recording Artist",
    track: {
      title: "MIDNIGHT DYNASTY",
      producer: "Regent Audio Lab",
      bpm: 142,
      key: "F# Minor",
      artwork_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    },
    license: {
      name: "WAV Lease + Trackout Stems",
      tier: "Commercial Multi-Platform",
      price: 149.99,
      file_type: "24-Bit / 48kHz WAV & Multi-Track Stems",
    },
  };

  const handleDownload = (fileName: string, type: string) => {
    setDownloadingFile(type);

    // Create a mock clean download blob to ensure real browser download
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `REGENT AUDIOS CERTIFIED ASSET\n\nTitle: ${orderDetails.track.title}\nLicensee: ${orderDetails.buyerName}\nToken: ${token}\nType: ${type}\nStandard: 24-Bit / 48kHz Studio Master\nAll rights reserved by Regent Audios.`
      ], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadingFile(null);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Regent Storefront
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase">Authenticated Token</span>
          </div>
        </div>

        {/* Certificate / Order Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] via-zinc-950/80 to-[#0c0c0e] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-amber-500/40 shadow-gold">
                <Image
                  src={orderDetails.track.artwork_url}
                  alt={orderDetails.track.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-amber-300 border border-amber-500/40">
                    {orderDetails.license.name}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {orderDetails.track.bpm} BPM • {orderDetails.track.key}
                  </span>
                </div>
                <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                  {orderDetails.track.title}
                </h1>
                <p className="text-xs text-zinc-400">
                  Produced by {orderDetails.track.producer} • Issued to {orderDetails.buyerName}
                </p>
              </div>
            </div>

            {/* Order Stamp */}
            <div className="rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-right backdrop-blur-md">
              <span className="block text-[10px] text-zinc-500 uppercase">Order Certificate</span>
              <span className="block text-sm font-bold text-amber-400">{orderDetails.id}</span>
              <span className="block text-[11px] text-zinc-400">{orderDetails.date}</span>
            </div>
          </div>
        </div>

        {/* Deliverables Download Center */}
        <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="font-sans text-lg font-bold uppercase text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Download Master Audio Assets
            </h2>
            <p className="text-xs text-zinc-400">
              Clean, un-watermarked high-resolution masters prepared specifically for vocal tracking, radio broadcast, and album mixing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Master WAV */}
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Master Untagged WAV</h4>
                  <p className="text-[11px] font-mono text-zinc-400">24-Bit / 48kHz • 58.4 MB</p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(`${orderDetails.track.title}_Master_WAV.txt`, "wav")}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-gold"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{downloadingFile === "wav" ? "Packing..." : "Download"}</span>
              </button>
            </div>

            {/* High Quality MP3 */}
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lossless 320kbps MP3</h4>
                  <p className="text-[11px] font-mono text-zinc-400">High-Bitrate MP3 • 9.8 MB</p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(`${orderDetails.track.title}_320kbps.txt`, "mp3")}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-gold"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{downloadingFile === "mp3" ? "Packing..." : "Download"}</span>
              </button>
            </div>

            {/* Multi-Track Stems Archive */}
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <FileArchive className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Multi-Track Stems (ZIP)</h4>
                  <p className="text-[11px] font-mono text-zinc-400">Full Session Multi-Tracks • 184 MB</p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(`${orderDetails.track.title}_Stems_Archive.txt`, "stems")}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-gold"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{downloadingFile === "stems" ? "Packing..." : "Download"}</span>
              </button>
            </div>

            {/* Legal PDF Agreement */}
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Signed License Agreement</h4>
                  <p className="text-[11px] font-mono text-zinc-400">PDF Legal Transfer Certificate</p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(`Regent_License_Agreement_${token}.pdf`, "pdf")}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloadingFile === "pdf" ? "Signing..." : "Download"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* License Terms Summary */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/50 p-6 text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold uppercase tracking-wider font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>Cryptographic Proof of License</span>
          </div>
          <p>
            This download token <code className="text-amber-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">{token}</code> is permanently registered on Regent Audios. You retain royalty-free distribution rights according to your selected lease tier. For sync licensing queries or custom producer inquiries, contact <span className="text-white">legal@regentaudios.vip</span>.
          </p>
        </div>

      </div>
    </div>
  );
}
