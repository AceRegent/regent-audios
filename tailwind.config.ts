import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070707",
        surface: {
          DEFAULT: "#0f0d0e",
          elevated: "#161315",
          subtle: "#0a090a",
          border: "rgba(255, 255, 255, 0.08)",
        },
        crimson: {
          DEFAULT: "#E11D48",
          light: "#FB7185",
          hover: "#F43F5E",
          dark: "#9F1239",
          deep: "#881337",
          glow: "rgba(225, 29, 72, 0.35)",
        },
        ruby: {
          DEFAULT: "#DC2626",
          dark: "#991B1B",
          glow: "rgba(220, 38, 38, 0.35)",
        },
        peat: {
          DEFAULT: "#121011",
          dark: "#090809",
          accent: "#1e181b",
        },
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#B45309",
          hover: "#D97706",
          glow: "rgba(245, 158, 11, 0.25)",
        },
        muted: {
          DEFAULT: "#71717A",
          dark: "#3F3F46",
          light: "#A1A1AA",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        ruby: "0 0 25px -5px rgba(225, 29, 72, 0.45)",
        "ruby-lg": "0 0 50px -5px rgba(225, 29, 72, 0.6)",
        pearlescent: "0 0 35px -5px rgba(225, 29, 72, 0.35), 0 0 20px -3px rgba(245, 158, 11, 0.2)",
        gold: "0 0 25px -5px rgba(245, 158, 11, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "peatlescent-gradient": "linear-gradient(135deg, rgba(225,29,72,0.9) 0%, rgba(185,28,28,0.95) 50%, rgba(245,158,11,0.85) 100%)",
        "crimson-glow": "radial-gradient(ellipse at center, rgba(225,29,72,0.18) 0%, rgba(15,13,14,0) 70%)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
