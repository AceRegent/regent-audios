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
  Tag,
  Users,
  Download,
  SlidersHorizontal,
  Check,
  Save,
  Flame,
} from "lucide-react";
import { Beat, Order } from "@/types";
import { formatCurrency, formatTime, cn } from "@/lib/utils";
import { useAudio } from "@/context/AudioContext";
import confetti from "canvas-confetti";

interface ProducerDashboardProps {
  beats: Beat[];
  onAddNewBeat: (newBeat: Beat) => void;
}

export function ProducerDashboard({ beats, onAddNewBeat }: ProducerDashboardProps) {
  const {
    licenses,
    updateLicensePrice,
    leads,
    promoCodes,
    addPromoCode,
    togglePromoCode,
  } = useAudio();

  const [activeTab, setActiveTab] = useState<"analytics" | "pricing" | "leads" | "uploader" | "orders">("analytics");

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

  // Pricing Form State (Initialized from active context licenses)
  const [pricesState, setPricesState] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    licenses.forEach((l) => {
      map[l.id] = l.price;
    });
    return map;
  });
  const [priceSaveSuccess, setPriceSaveSuccess] = useState(false);

  // Promo Code Form State
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoPercent, setNewPromoPercent] = useState(25);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState("");

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

  const handlePriceChange = (tierId: string, val: string) => {
    const num = parseFloat(val);
    setPricesState((prev) => ({
      ...prev,
      [tierId]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(pricesState).forEach(([id, val]) => {
      if (val > 0) {
        updateLicensePrice(id, val);
      }
    });

    setPriceSaveSuccess(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#E11D48", "#F59E0B", "#10B981"],
    });

    setTimeout(() => setPriceSaveSuccess(false), 3000);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    addPromoCode(newPromoCode.trim(), newPromoPercent);
    setPromoSuccessMsg(`Coupon '${newPromoCode.trim().toUpperCase()}' created!`);
    setNewPromoCode("");
    setTimeout(() => setPromoSuccessMsg(""), 3000);
  };

  const handleExportLeadsCSV = () => {
    if (leads.length === 0) return;

    const headers = ["ID", "Artist Name", "Email Address", "Auditioned Beat", "Timestamp"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.artist_name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.beat_title.replace(/"/g, '""')}"`,
      `"${new Date(l.created_at).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Regent_Audios_Artist_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/10 px-3 py-0.5 text-xs font-mono text-crimson-light">
            <Shield className="h-3.5 w-3.5 text-crimson" />
            <span>PRODUCER CONTROL ROOM • PRIVATE VAULT</span>
          </div>
          <h1 className="mt-2 font-sans text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            AUDIO LAB METRICS & CATALOG
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1.5 shadow-glass">
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "analytics"
                ? "bg-gradient-to-r from-crimson to-amber-500 text-white shadow-ruby font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "pricing"
                ? "bg-gradient-to-r from-crimson to-amber-500 text-white shadow-ruby font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Pricing & Promos
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "leads"
                ? "bg-gradient-to-r from-crimson to-amber-500 text-white shadow-ruby font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Users className="h-3.5 w-3.5" />
            Artist Leads
            <span className="rounded-full bg-crimson/30 px-1.5 py-0.2 text-[9px] font-mono text-crimson-light">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("uploader")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "uploader"
                ? "bg-gradient-to-r from-crimson to-amber-500 text-white shadow-ruby font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Beat Drop
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "orders"
                ? "bg-gradient-to-r from-crimson to-amber-500 text-white shadow-ruby font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Orders
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-crimson/30 bg-gradient-to-b from-crimson/[0.08] to-transparent p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Gross Royalty Revenue</span>
                <DollarSign className="h-4 w-4 text-crimson-light" />
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
                Across {beats.length} published masters
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Artist Lead Pipeline</span>
                <Users className="h-4 w-4 text-crimson" />
              </div>
              <div className="mt-2 font-mono text-3xl font-black text-white">
                {leads.length} leads
              </div>
              <div className="mt-2 text-xs font-mono text-emerald-400">
                Ready for email/DM pitches
              </div>
            </div>
          </div>

          {/* Monthly Trend Simulator */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-sans text-base font-bold uppercase text-white">
                  Quarterly Sales Trajectory
                </h3>
                <p className="text-xs text-zinc-400">Monthly gross volume in USD</p>
              </div>
              <span className="rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1 text-xs font-mono text-crimson-light">
                2026 YTD
              </span>
            </div>

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
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-crimson-light">
                    {item.rev}
                  </div>
                  <div className="w-full bg-zinc-900 rounded-t-lg h-44 relative overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-crimson via-red-600 to-amber-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${item.val}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC PRICING & PROMOS MANAGER */}
      {activeTab === "pricing" && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Section: Base Licensing Tier Pricing Controls */}
          <div className="rounded-2xl border border-crimson/30 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-ruby space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-crimson" />
                <h3 className="font-sans text-xl font-bold uppercase text-white">
                  Live Dynamic Pricing Manager
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Adjust base prices across your storefront in real time. Changes take effect instantly for all customers.
              </p>
            </div>

            {priceSaveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-mono">
                <Check className="h-4 w-4" />
                <span>All prices updated and published live across Regent Audios!</span>
              </div>
            )}

            <form onSubmit={handleSavePrices} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {licenses.map((tier) => (
                  <div
                    key={tier.id}
                    className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 space-y-2 hover:border-crimson/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {tier.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {tier.file_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-crimson">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={pricesState[tier.id] ?? tier.price}
                        onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm font-mono font-bold text-white outline-none focus:border-crimson"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{tier.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                <span className="text-xs font-mono text-zinc-500">
                  Updates storefront, tracklists, hero buttons, and checkout calculations.
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-ruby hover:scale-105 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save & Publish New Prices</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section: Promo Codes & Discount Generator */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-amber-400" />
                <h3 className="font-sans text-xl font-bold uppercase text-white">
                  Promo Codes & VIP Discounts
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Create custom discount coupons for Instagram DMs, email campaigns, or seasonal flash sales.
              </p>
            </div>

            {/* Create new promo form */}
            <form onSubmit={handleCreatePromo} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  required
                  placeholder="CODE (e.g. SUMMER30, FLASH40)"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs uppercase font-mono text-white outline-none focus:border-crimson"
                />
              </div>

              <div className="w-full sm:w-36 flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="100"
                  required
                  value={newPromoPercent}
                  onChange={(e) => setNewPromoPercent(parseInt(e.target.value) || 20)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-crimson"
                />
                <span className="text-xs font-mono text-zinc-400">% OFF</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span>Create Code</span>
              </button>
            </form>

            {promoSuccessMsg && (
              <div className="text-xs font-mono text-emerald-400">{promoSuccessMsg}</div>
            )}

            {/* Existing Promo Codes Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase text-zinc-500">
                    <th className="pb-3">Coupon Code</th>
                    <th className="pb-3 text-center">Discount</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {promoCodes.map((promo) => (
                    <tr key={promo.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono font-bold text-amber-400 tracking-wider">
                        {promo.code}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-white">
                        {promo.discount_percent}%
                      </td>
                      <td className="py-3 text-zinc-400 text-[11px]">
                        {promo.description || "General promotion"}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-mono",
                            promo.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-500"
                          )}
                        >
                          {promo.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => togglePromoCode(promo.id)}
                          className="text-[11px] font-mono text-zinc-400 hover:text-white underline"
                        >
                          {promo.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ARTIST LEADS CRM */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="font-sans text-xl font-bold uppercase text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-crimson" />
                Artist Leads CRM & Pipeline
              </h3>
              <p className="text-xs text-zinc-400">
                Artists who downloaded free audition MP3s. These are warm leads ready for DM or email outreach.
              </p>
            </div>

            <button
              onClick={handleExportLeadsCSV}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-all shadow-glass"
            >
              <Download className="h-3.5 w-3.5 text-crimson" />
              <span>Export Leads to CSV</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Total Leads Captured</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">{leads.length}</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Pipeline Commercial Potential</span>
              <div className="text-2xl font-bold font-mono text-crimson-light mt-1">
                {formatCurrency(leads.length * 49.99)}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Top Auditioned Beat</span>
              <div className="text-sm font-bold text-amber-300 mt-2 truncate">
                {leads[0]?.beat_title || "MIDNIGHT DYNASTY"}
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase text-zinc-500">
                    <th className="pb-3">Artist / Producer Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Auditioned Beat</th>
                    <th className="pb-3 text-right">Date Captured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-semibold text-white">
                        {lead.artist_name}
                      </td>
                      <td className="py-3 font-mono text-crimson-light">
                        <a href={`mailto:${lead.email}`} className="hover:underline">
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3">
                        <span className="rounded bg-white/[0.06] px-2 py-0.5 text-zinc-200 font-medium">
                          {lead.beat_title}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-500 text-[11px]">
                        {new Date(lead.created_at).toLocaleDateString()} • {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BEAT DROP UPLOADER */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-crimson/50 transition-colors">
                <ImageIcon className="h-6 w-6 text-crimson mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Album Artwork (.PNG/.JPG)</span>
                <span className="text-[10px] font-mono text-zinc-500">Minimum 1500x1500px</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>

              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-crimson/50 transition-colors">
                <FileAudio className="h-6 w-6 text-crimson mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Tagged Preview MP3</span>
                <span className="text-[10px] font-mono text-zinc-500">Voice-tagged public preview file</span>
                <input
                  type="file"
                  accept="audio/mp3,audio/*"
                  onChange={(e) => setTaggedAudioFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>

              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-crimson/50 transition-colors">
                <FileAudio className="h-6 w-6 text-crimson mx-auto mb-2" />
                <span className="block text-xs font-semibold text-white">Master Untagged WAV</span>
                <span className="text-[10px] font-mono text-zinc-500">24-Bit 48kHz / 96kHz Lossless</span>
                <input
                  type="file"
                  accept="audio/wav,audio/*"
                  onChange={(e) => setMasterAudioFile(e.target.files?.[0] || null)}
                  className="mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-800 file:text-xs file:text-white"
                />
              </div>

              <div className="rounded-xl border border-dashed border-white/20 bg-zinc-900/50 p-4 text-center hover:border-crimson/50 transition-colors">
                <FileArchive className="h-6 w-6 text-crimson mx-auto mb-2" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Track Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PHANTOM ROYALE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-crimson uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Producer Alias</label>
                <input
                  type="text"
                  placeholder="e.g. Regent Audio Lab"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-crimson"
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
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-crimson"
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
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Genre Category</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-crimson"
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
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-crimson"
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-crimson-light">
                  <span>Uploading lossless assets to Regent storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                  <div className="h-full bg-crimson transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>Beat published successfully! Added to live storefront catalogue.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-ruby hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              <Upload className="h-4 w-4 stroke-[2.5]" />
              <span>Publish Beat to Storefront</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: ORDERS LEDGER */}
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
                      <span className="ml-2 rounded bg-crimson/10 px-1.5 py-0.2 text-[10px] font-mono text-crimson-light border border-crimson/20">
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
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-crimson-light hover:text-white underline"
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
