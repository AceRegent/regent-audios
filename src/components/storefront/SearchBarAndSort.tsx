"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarAndSortProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedKey: string;
  onKeyChange: (key: string) => void;
  sortBy: "newest" | "popular" | "bpm-asc" | "bpm-desc";
  onSortChange: (sort: "newest" | "popular" | "bpm-asc" | "bpm-desc") => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  bpmRange: [number, number];
  onBpmRangeChange: (range: [number, number]) => void;
  onResetFilters: () => void;
}

const KEYS = ["All Keys", "Minor", "Major", "F# Minor", "C Minor", "Bb Major", "D Minor", "E Minor", "Ab Minor", "G Minor", "A Minor"];

export function SearchBarAndSort({
  searchQuery,
  onSearchChange,
  selectedKey,
  onKeyChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  bpmRange,
  onBpmRangeChange,
  onResetFilters,
}: SearchBarAndSortProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by beat title, producer, vibe, or key signature..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 backdrop-blur-md outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter toggler & Sort Selectors */}
        <div className="flex items-center gap-2">
          {/* Key filter dropdown */}
          <select
            value={selectedKey}
            onChange={(e) => onKeyChange(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2.5 text-xs font-mono text-zinc-200 outline-none hover:border-white/20 transition-all cursor-pointer"
          >
            {KEYS.map((k) => (
              <option key={k} value={k} className="bg-zinc-900 text-white">
                {k}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2.5 text-xs font-medium text-zinc-200 outline-none hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="popular" className="bg-zinc-900 text-white">Most Popular</option>
              <option value="newest" className="bg-zinc-900 text-white">Newest Drops</option>
              <option value="bpm-asc" className="bg-zinc-900 text-white">BPM (Slowest first)</option>
              <option value="bpm-desc" className="bg-zinc-900 text-white">BPM (Fastest first)</option>
            </select>
          </div>

          {/* Toggle BPM & extra filters drawer */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all",
              showFilters
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-zinc-900/80 text-zinc-400 hover:text-white"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* View Mode Toggle: List vs Grid */}
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1">
            <button
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                viewMode === "list"
                  ? "bg-amber-500 text-black"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-amber-500 text-black"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Expandable Secondary Filter Panel (BPM slider, etc.) */}
      {showFilters && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-4 backdrop-blur-xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 max-w-md">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Tempo Range:</span>
                <span className="text-amber-400 font-bold">
                  {bpmRange[0]} - {bpmRange[1]} BPM
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-500">60</span>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={bpmRange[1]}
                  onChange={(e) => onBpmRangeChange([bpmRange[0], parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] font-mono text-zinc-500">180</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
