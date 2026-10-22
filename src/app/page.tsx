"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { GenreFilter } from "@/components/storefront/GenreFilter";
import { SearchBarAndSort } from "@/components/storefront/SearchBarAndSort";
import { LuxuryTracklist } from "@/components/storefront/LuxuryTracklist";
import { BeatDetailModal } from "@/components/storefront/BeatDetailModal";
import { LicensingDrawer } from "@/components/licensing/LicensingDrawer";
import { FreeDownloadModal } from "@/components/licensing/FreeDownloadModal";
import { LicensingPageContent } from "@/components/licensing/LicensingPageContent";
import { ProducerDashboard } from "@/components/dashboard/ProducerDashboard";
import { INITIAL_BEATS } from "@/lib/constants";
import { Beat, Genre } from "@/types";
import { useAudio } from "@/context/AudioContext";
import { ShieldCheck, Crown, Disc3, Sparkles } from "lucide-react";

const GENRES: (Genre | string)[] = [
  "All",
  "Trap",
  "Boom Bap",
  "R&B",
  "Cinematic",
  "Drill",
  "Synthwave",
  "Lo-Fi",
];

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"storefront" | "dashboard" | "licensing">("storefront");
  const [beats, setBeats] = useState<Beat[]>(INITIAL_BEATS);
  const [activeGenre, setActiveGenre] = useState<Genre | string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("All Keys");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "bpm-asc" | "bpm-desc">("popular");
  const [bpmRange, setBpmRange] = useState<[number, number]>([60, 180]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedBeatDetail, setSelectedBeatDetail] = useState<Beat | null>(null);

  const {
    licensingBeat,
    isLicensingOpen,
    openLicensingDrawer,
    closeLicensingDrawer,
    freeDownloadBeat,
    isFreeDownloadOpen,
    closeFreeDownloadModal,
  } = useAudio();

  // Calculate beat counts per genre
  const beatCounts = useMemo(() => {
    const counts: Record<string, number> = { All: beats.length };
    GENRES.forEach((g) => {
      if (g !== "All") {
        counts[g] = beats.filter((b) => b.genre.toLowerCase() === g.toLowerCase()).length;
      }
    });
    return counts;
  }, [beats]);

  // Filter and sort beats
  const filteredBeats = useMemo(() => {
    return beats
      .filter((beat) => {
        // Genre filter
        if (activeGenre !== "All" && beat.genre.toLowerCase() !== activeGenre.toLowerCase()) {
          return false;
        }

        // Search Query filter (matches title, producer, genre, tags, or key)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = beat.title.toLowerCase().includes(q);
          const matchesProducer = beat.producer.toLowerCase().includes(q);
          const matchesGenre = beat.genre.toLowerCase().includes(q);
          const matchesKey = beat.key.toLowerCase().includes(q);
          const matchesTag = beat.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesProducer && !matchesGenre && !matchesKey && !matchesTag) {
            return false;
          }
        }

        // Key signature filter
        if (selectedKey !== "All Keys") {
          if (selectedKey === "Minor" && !beat.key.toLowerCase().includes("minor")) return false;
          if (selectedKey === "Major" && !beat.key.toLowerCase().includes("major")) return false;
          if (selectedKey !== "Minor" && selectedKey !== "Major" && beat.key !== selectedKey) return false;
        }

        // BPM range filter
        if (beat.bpm < bpmRange[0] || beat.bpm > bpmRange[1]) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          return (b.play_count || 0) - (a.play_count || 0);
        }
        if (sortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === "bpm-asc") {
          return a.bpm - b.bpm;
        }
        if (sortBy === "bpm-desc") {
          return b.bpm - a.bpm;
        }
        return 0;
      });
  }, [beats, activeGenre, searchQuery, selectedKey, sortBy, bpmRange]);

  const handleAddNewBeat = (newBeat: Beat) => {
    setBeats((prev) => [newBeat, ...prev]);
  };

  const handleResetFilters = () => {
    setActiveGenre("All");
    setSearchQuery("");
    setSelectedKey("All Keys");
    setSortBy("popular");
    setBpmRange([60, 180]);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Brand Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* VIEW 1: STOREFRONT */}
        {currentView === "storefront" && (
          <>
            {/* Hero Showcase Spotlight Banner */}
            <HeroBanner featuredBeat={beats[0]} />

            {/* Filter & Search Bar Section */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Category Pill Filters with Framer Motion Animation */}
                <GenreFilter
                  genres={GENRES}
                  activeGenre={activeGenre}
                  onSelectGenre={setActiveGenre}
                  beatCounts={beatCounts}
                />
              </div>

              {/* Search, BPM, Key and View Switcher */}
              <SearchBarAndSort
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedKey={selectedKey}
                onKeyChange={setSelectedKey}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                bpmRange={bpmRange}
                onBpmRangeChange={setBpmRange}
                onResetFilters={handleResetFilters}
              />
            </section>

            {/* Luxury Tracklist with Framer Motion sliding hover background */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-white">
                    Master Catalogue
                  </h2>
                  <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-xs font-mono text-zinc-400">
                    {filteredBeats.length} available
                  </span>
                </div>
              </div>

              <LuxuryTracklist
                beats={filteredBeats}
                viewMode={viewMode}
                onSelectBeatDetail={setSelectedBeatDetail}
              />
            </section>
          </>
        )}

        {/* VIEW 2: LICENSING MATRIX */}
        {currentView === "licensing" && (
          <LicensingPageContent />
        )}

        {/* VIEW 3: PRODUCER ADMIN DASHBOARD */}
        {currentView === "dashboard" && (
          <ProducerDashboard
            beats={beats}
            onAddNewBeat={handleAddNewBeat}
          />
        )}
      </main>

      {/* Luxury Peatlescent Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070607]/90 py-12 px-4 sm:px-6 lg:px-8 text-zinc-500 text-xs backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-crimson/40 bg-zinc-950 p-0.5 shadow-ruby">
              <Image
                src="/logo-bird.png"
                alt="Regent Audios Dracula Parrot Logo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-white tracking-widest uppercase">REGENT</span>
                <span className="font-light text-crimson-light tracking-widest uppercase">AUDIOS</span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500">Official Sound Vault • 24-Bit Lossless</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-zinc-400">
            <button onClick={() => setCurrentView("storefront")} className="hover:text-crimson-light transition-colors">
              Storefront Vault
            </button>
            <button onClick={() => setCurrentView("licensing")} className="hover:text-crimson-light transition-colors">
              Contract Terms
            </button>
            <button onClick={() => setCurrentView("dashboard")} className="hover:text-crimson-light transition-colors">
              Producer Room
            </button>
            <span className="text-crimson-light">24-BIT / 96kHz LOSSLESS</span>
          </div>

          <div className="text-center md:text-right text-[11px] font-mono">
            © {new Date().getFullYear()} Regent Audios Ltd. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Interactive Licensing Drawer Modal */}
      <LicensingDrawer
        isOpen={isLicensingOpen}
        beat={licensingBeat}
        onClose={closeLicensingDrawer}
      />

      {/* Free Tagged Audition Demo Modal (Lead Magnet) */}
      <FreeDownloadModal
        isOpen={isFreeDownloadOpen}
        beat={freeDownloadBeat}
        onClose={closeFreeDownloadModal}
      />

      {/* Beat Detail Inspection Modal */}
      <BeatDetailModal
        beat={selectedBeatDetail}
        onClose={() => setSelectedBeatDetail(null)}
        onOpenLicense={openLicensingDrawer}
      />
    </div>
  );
}
