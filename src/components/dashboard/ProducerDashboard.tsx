"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DollarSign,
  TrendingUp,
  Music,
  ShoppingBag,
  Upload,
  Plus,
  FileAudio,
  FileArchive,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Beat, Order } from "@/types";
import { formatCurrency, formatTime, cn } from "@/lib/utils";

interface ProducerDashboardProps {
  beats: Beat[];
  onAddNewBeat: (newBeat: Beat) => void;
}

export function ProducerDashboard({ beats, onAddNewBeat }: ProducerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "uploader" | "orders">("analytics");

  // Form State for new beat uploader
  const [title, setTitle] = useState("");
  const [producer, setProducer] = useState("Regent Audio Lab");
  const [bpm, setBpm] = useState(140);
  const [keySig, setKeySig] = useState("F# Minor");
  const [genre, setGenre] = useState("Trap");
  const [tags, setTags] = useState("Dark, 808, Platinum");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [taggedAudioFile, setTaggedAudioFile] = useState<File | null>(null);
  const [masterAudioFile, setMasterAudioFile] = useState<File | null>(null);
  const [stemsFile, setStemsFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Sample analytics data
  const totalRevenue = 42850;
  const totalSales = 348;
  const totalPlays = beats.reduce((acc, b) => acc + (b.play_count || 0), 0);

  const recentOrders: Order[] = [
    {
      id: "ord-9821",
      beat_id: beats[0]?.id || "beat-1",
      beat: beats[0],
      license_id: "lic-wav",
      buyer_email: "marcus.cole@defjamrecords.com",
      buyer_name: "Marcus Cole",
      amount_paid: 49.99,
      download_token: "regent-wav-9821-tok",
      status: "completed",
      created_at: "14 minutes ago",
    },
    {
      id: "ord-9820",
      beat_id: beats[1]?.id || "beat-2",
      beat: beats[1],
      license_id: "lic-stems",
      buyer_email: "vocalist.aria@gmail.com",
      buyer_name: "Aria Ross",
      amount_paid: 149.99,
      download_token: "regent-stem-9820-tok",
      status: "completed",
      created_at: "1 hour ago",
    },
    {
      id: "ord-9819",
      beat_id: beats[2]?.id || "beat-3",
      beat: beats[2],
      license_id: "lic-mp3",
      buyer_email: "beats@ovo.ca",
      buyer_name: "Noah '40' Team",
      amount_paid: 29.99,
      download_token: "regent-mp3-9819-tok",
      status: "completed",
      created_at: "3 hours ago",
    },
    {
      id: "ord-9818",
      beat_id: beats[4]?.id || "beat-5",
      beat: beats[4],
      license_id: "lic-exclusive",
      buyer_email: "legal@warnerchappell.com",
      buyer_name: "Sync Licensing Team",
      amount_paid: 899.00,
      download_token: "regent-excl-9818-tok",
      status: "completed",
      created_at: "Yesterday",
    },
  ];

  const handleCreateBeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);

          const newBeat: Beat = {
            id: "beat-" + Date.now(),
            title: title.toUpperCase(),
            producer: producer || "Regent Audio Lab",
            bpm: Number(bpm) || 130,
            key: keySig || "A Minor",
            genre: genre || "Trap",
            artwork_url:
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
            tagged_audio_url: "https://cdn.freesound.org/previews/536/536108_5674468-lq.mp3",
            master_audio_url: "/api/download/master",
            stems_url: "/api/download/stems",
            play_count: 1,
            duration: 180,
            is_featured: false,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            created_at: new Date().toISOString(),
          };

          onAddNewBeat(newBeat);

          setTimeout(() => {
            setUploadSuccess(false);
            setTitle("");
            setActiveTab("analytics");
          }, 1800);

          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-mono text-amber-300">
            <Shield className="h-3.5 w-3.5" />
            <span>PRODUCER CONTROL ROOM • PRIVATE VAULT</span>
          </div>
          <h1 className="mt-2 font-sans text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            AUDIO LAB METRICS & CATALOG
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1">
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "analytics"
                ? "bg-amber-500 text-black shadow-gold font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("uploader")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "uploader"
                ? "bg-amber-500 text-black shadow-gold font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Beat Drop
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "orders"
                ? "bg-amber-500 text-black shadow-gold font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Orders Ledger
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.08] to-transparent p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Gross Royalty Revenue</span>
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 font-mono text-3xl font-black text-white">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+24.8% vs last month</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Total Leases & Licenses</span>
                <ShoppingBag className="h-4 w-4 text-zinc-300" />
              </div>
              <div className="mt-2 font-mono text-3xl font-black text-white">
                {totalSales}
              </div>
              <div className="mt-2 text-xs font-mono text-zinc-500">
                Avg order: $123.13 / sale
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Stream Impressions</span>
                <Music className="h-4 w-4 text-zinc-300" />
              </div>
              <div className="mt-2 font-mono text-3xl font-black text-white">
                {(totalPlays / 1000).toFixed(1)}k
              </div>
              <div className="mt-2 text-xs font-mono text-amber-300">
                Across 8 published masters
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Conversion Ratio</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 font-mono text-3xl font-black text-white">
                4.82%
              </div>
              <div className="mt-2 text-xs font-mono text-emerald-400">
                Industry benchmark: 1.8%
              </div>
            </div>
          </div>

          {/* Revenue Distribution & Performance Graph Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Monthly Trend Simulator */}
            <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-sans text-base font-bold uppercase text-white">
                    Quarterly Sales Trajectory
                  </h3>
                  <p className="text-xs text-zinc-400">Monthly gross volume in USD</p>
                </div>
                <span className="rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1 text-xs font-mono text-amber-300">
                  2026 YTD
                </span>
              </div>

              {/* Responsive Bar Chart Simulation */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-white/[0.08] pb-2">
                {[
                  { month: "Jan", val: 45, rev: "$4,500" },
                  { month: "Feb", val: 58, rev: "$5,800" },
                  { month: "Mar", val: 52, rev: "$5,200" },
                  { month: "Apr", val: 74, rev: "$7,400" },
                  { month: "May", val: 82, rev: "$8,200" },
                  { month: "Jun", val: 68, rev: "$6,800" },
                  { month: "Jul", val: 91, rev: "$9,100" },
                  { month: "Aug", val: 86, rev: "$8,600" },
                  { month: "Sep", val: 95, rev: "$9,500" },
                  { month: "Oct", val: 100, rev: "$10,200" },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-amber-300">
                      {item.rev}
                    </div>
                    <div className="w-full bg-zinc-900 rounded-t-lg h-44 relative overflow-hidden flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${item.val}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* License Tier Share */}
            <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-xl space-y-4">
              <h3 className="font-sans text-base font-bold uppercase text-white">
                Revenue by License Tier
              </h3>
              <p className="text-xs text-zinc-400">Share of total licensing royalties</p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300 font-semibold">WAV Lease ($49.99)</span>
                    <span className="text-amber-400 font-bold">52%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "52%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300 font-semibold">Trackout Stems ($149.99)</span>
                    <span className="text-amber-400 font-bold">28%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300 font-semibold">Exclusive Buyout ($899)</span>
                    <span className="text-amber-400 font-bold">12%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: "12%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300 font-semibold">MP3 Lease ($29.99)</span>
                    <span className="text-amber-400 font-bold">8%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-zinc-600 rounded-full" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Top-Performing Tracks Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-xl">
            <h3 className="font-sans text-base font-bold uppercase text-white mb-4">
              Top Catalog Performers
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase text-zinc-500">
                    <th className="pb-3">Beat</th>
                    <th className="pb-3 text-center">BPM / Key</th>
                    <th className="pb-3 text-center">Genre</th>
                    <th className="pb-3 text-center">Stream Plays</th>
                    <th className="pb-3 text-right">Est. Royalties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {beats.slice(0, 5).map((beat) => (
                    <tr key={beat.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                          <Image src={beat.artwork_url} alt={beat.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white uppercase">{beat.title}</div>
                          <div className="text-zinc-400 text-[11px]">{beat.producer}</div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-mono text-zinc-400">
                        {beat.bpm} • {beat.key}
                      </td>
                      <td className="py-3 text-center">
                        <span className="rounded bg-white/[0.06] px-2 py-0.5 text-zinc-300 font-medium">
                          {beat.genre}
                        </span>
                      </td>
                      <td className="py-3 text-center font-mono text-zinc-300">
                        {beat.play_count.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-amber-400">
                        {formatCurrency((beat.play_count * 0.42) + 490)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEAT DROP UPLOADER */}
      {activeTab === "uploader" && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl max-w-3xl mx-auto">
          <div className="border-b border-white/[0.08] pb-4 mb-6">
            <h3 className="font-sans text-xl font-bold uppercase text-white">
              Publish New Studio Master
            </h3>
            <p className="text-xs text-zinc-400">
              Drag-and-drop your audio assets, artwork, and configure licensing metadata.
            </p>
          </div>

          <form onSubmit={handleCreateBeat} className="space-y-6">
            {/* Asset Drag-and-Drop Zones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Artwork Box */}
              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-amber-500/50 transition-colors">
                <ImageIcon className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Album Artwork (.PNG/.JPG)</span>
                <span className="text-[10px] font-mono text-zinc-500">Minimum 1500x1500px</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>

              {/* Tagged Preview MP3 */}
              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-amber-500/50 transition-colors">
                <FileAudio className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Tagged Preview MP3</span>
                <span className="text-[10px] font-mono text-zinc-500">Voice-tagged public preview file</span>
                <input
                  type="file"
                  accept="audio/mp3,audio/*"
                  onChange={(e) => setTaggedAudioFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>

              {/* Master WAV */}
              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-amber-500/50 transition-colors">
                <FileAudio className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Master Untagged WAV</span>
                <span className="text-[10px] font-mono text-zinc-500">24-Bit 48kHz / 96kHz Lossless</span>
                <input
                  type="file"
                  accept="audio/wav,audio/*"
                  onChange={(e) => setMasterAudioFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>

              {/* Multi-track Stems ZIP */}
              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-amber-500/50 transition-colors">
                <FileArchive className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Trackout Stems Archive (.ZIP)</span>
                <span className="text-[10px] font-mono text-zinc-500">All dry/wet stems for mixing</span>
                <input
                  type="file"
                  accept=".zip,.rar,.tar"
                  onChange={(e) => setStemsFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Track Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PHANTOM ROYALE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Producer Alias</label>
                <input
                  type="text"
                  placeholder="e.g. Regent Audio Lab"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Tempo (BPM) *</label>
                <input
                  type="number"
                  required
                  min="50"
                  max="220"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Musical Scale / Key *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. F# Minor, C Major"
                  value={keySig}
                  onChange={(e) => setKeySig(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Genre Category</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="Trap">Trap</option>
                  <option value="Boom Bap">Boom Bap</option>
                  <option value="R&B">R&B</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Drill">Drill</option>
                  <option value="Synthwave">Synthwave</option>
                  <option value="Lo-Fi">Lo-Fi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Dark, 808, Metro Boomin, Hard"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Progress indicator */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-amber-300">
                  <span>Uploading lossless assets to Regent storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>Beat published successfully! Added to live storefront catalogue.</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-gold hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              <Upload className="h-4 w-4 stroke-[2.5]" />
              <span>Publish Beat to Storefront</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ORDERS LEDGER */}
      {activeTab === "orders" && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans text-base font-bold uppercase text-white">
                Live Transaction & Orders Ledger
              </h3>
              <p className="text-xs text-zinc-400">Real-time Stripe checkout & license fulfillment</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase text-zinc-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer Email</th>
                  <th className="pb-3">Track & Tier</th>
                  <th className="pb-3 text-center">Amount Paid</th>
                  <th className="pb-3 text-center">Time</th>
                  <th className="pb-3 text-right">Download Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-mono text-zinc-400 font-semibold">{ord.id}</td>
                    <td className="py-3">
                      <div className="text-white font-medium">{ord.buyer_name}</div>
                      <div className="text-zinc-500 text-[11px] font-mono">{ord.buyer_email}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-amber-200">{ord.beat?.title || "MASTER BEAT"}</span>
                      <span className="ml-2 rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-mono text-amber-400 border border-amber-500/20">
                        {ord.license_id.replace("lic-", "").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-white">
                      {formatCurrency(ord.amount_paid)}
                    </td>
                    <td className="py-3 text-center text-zinc-400 font-mono text-[11px]">
                      {ord.created_at}
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`/downloads/${ord.download_token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 underline"
                      >
                        <span>Access Portal</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
