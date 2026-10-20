"use client";

import React from "react";
import { motion } from "framer-motion";
import { Genre } from "@/types";
import { cn } from "@/lib/utils";

interface GenreFilterProps {
  genres: (Genre | string)[];
  activeGenre: Genre | string;
  onSelectGenre: (genre: Genre | string) => void;
  beatCounts?: Record<string, number>;
}

export function GenreFilter({
  genres,
  activeGenre,
  onSelectGenre,
  beatCounts = {},
}: GenreFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {genres.map((genre) => {
        const isActive = activeGenre === genre;
        const count = beatCounts[genre];

        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
              isActive ? "text-white font-bold" : "text-zinc-400 hover:text-white"
            )}
          >
            {/* Fluid animated pill background with peatlescent crimson-to-ruby glow */}
            {isActive && (
              <motion.div
                layoutId="genreActivePill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-crimson via-red-600 to-amber-500 shadow-ruby"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <span className="relative z-10">{genre}</span>

            {count !== undefined && (
              <span
                className={cn(
                  "relative z-10 rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                  isActive
                    ? "bg-black/30 text-white font-bold"
                    : "bg-white/[0.08] text-zinc-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
