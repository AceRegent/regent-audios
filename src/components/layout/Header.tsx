"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Disc3,
  LayoutDashboard,
  Store,
  FileText,
  Search,
  Sparkles,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentView: "storefront" | "dashboard" | "licensing";
  onViewChange: (view: "storefront" | "dashboard" | "licensing") => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Header({
  currentView,
  onViewChange,
  searchQuery = "",
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070607]/85 backdrop-blur-2xl transition-all">
      {/* Top micro ruby-gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-crimson via-amber-500 to-transparent opacity-80" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Identity / Dracula Parrot Emblem */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onViewChange("storefront");
            }}
            className="group flex items-center gap-3.5 transition-transform hover:scale-[1.02]"
          >
            {/* The Bird Logo Crest */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl p-0.5 bg-gradient-to-br from-crimson via-amber-500/80 to-peat-accent shadow-ruby">
              <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#0d0a0c] border border-crimson/30">
                <Image
                  src="/logo-bird.png"
                  alt="Regent Audios Dracula Parrot Logo"
                  fill
                  sizes="48px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  priority
                />
                {/* Pearlescent crimson sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/20 via-transparent to-white/10 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-xl font-black tracking-[0.25em] text-white group-hover:text-crimson-light transition-colors">
                  REGENT
                </span>
                <span className="font-sans text-xl font-light tracking-[0.25em] bg-gradient-to-r from-crimson to-amber-400 bg-clip-text text-transparent">
                  AUDIOS
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-zinc-950/70 p-1.5 backdrop-blur-md shadow-glass">
          <button
            onClick={() => onViewChange("storefront")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all",
              currentView === "storefront"
                ? "bg-gradient-to-r from-crimson via-red-600 to-amber-500 text-white shadow-ruby"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Store className="h-3.5 w-3.5" />
            STOREFRONT
          </button>

          <button
            onClick={() => onViewChange("licensing")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all",
              currentView === "licensing"
                ? "bg-gradient-to-r from-crimson via-red-600 to-amber-500 text-white shadow-ruby"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            LICENSING MATRIX
          </button>

          <button
            onClick={() => onViewChange("dashboard")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all",
              currentView === "dashboard"
                ? "bg-gradient-to-r from-crimson via-red-600 to-amber-500 text-white shadow-ruby"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            PRODUCER VAULT
            <span className="ml-1 rounded-full bg-crimson/20 border border-crimson/40 px-1.5 py-0.2 text-[9px] font-mono text-crimson-light">
              ADMIN
            </span>
          </button>
        </nav>

        {/* Right side: Search bar & 24-Bit Lossless Badge */}
        <div className="flex items-center gap-3">
          {onSearchChange && (
            <div className="relative hidden lg:block w-52 xl:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search BPM, key, mood..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full border border-white/[0.08] bg-zinc-900/60 py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:border-crimson/60 focus:ring-1 focus:ring-crimson/40"
              />
            </div>
          )}

          {/* Quick Mobile View Switcher */}
          <div className="flex md:hidden items-center gap-1 rounded-lg border border-white/10 bg-zinc-900 p-1">
            <button
              onClick={() => onViewChange("storefront")}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium",
                currentView === "storefront" ? "bg-crimson text-white" : "text-zinc-400"
              )}
            >
              Store
            </button>
            <button
              onClick={() => onViewChange("dashboard")}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium",
                currentView === "dashboard" ? "bg-crimson text-white" : "text-zinc-400"
              )}
            >
              Admin
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-crimson/30 bg-crimson/10 px-3 py-1 text-xs font-mono text-crimson-light shadow-[0_0_15px_rgba(225,29,72,0.15)]">
            <Flame className="h-3.5 w-3.5 text-crimson" />
            <span>24-BIT / 96kHZ</span>
          </div>
        </div>

      </div>
    </header>
  );
}
