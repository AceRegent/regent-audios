# REGENT AUDIOS — Luxury Boutique Instrumental Store & Audio Licensing Platform

An ultra-modern, high-contrast pitch-black boutique marketplace for recording artists, songwriters, mix engineers, and film/sync supervisors.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **HTML5 Web Audio API**, **Supabase (PostgreSQL)**, and **Stripe Checkout**.

---

## 🌟 Key Highlights & Architectural Features

### 1. Luxury Design System & Motion Aesthetics
- **Pitch-Black Luxury Base:** High-contrast `#070707` pitch-black foundation with `#121212` elevated glass surfaces.
- **Gold & Amber Accents:** `#F59E0B` amber brand highlights, glowing ambient highlights, and crisp `#FFFFFF` typography.
- **Monospace Technical Badges:** JetBrains Mono typography for technical audio parameters (BPM, Key Signatures, Track Durations, 24-Bit / 96kHz Lossless indicators).
- **Framer Motion Fluid Animations:**
  - `layoutId="trackHoverBg"`: Seamless sliding highlight following the cursor across rows in the `LuxuryTracklist`.
  - `layoutId="genreActivePill"`: Spring-animated pill background tracking category selection (All, Trap, Boom Bap, R&B, Cinematic, Drill, Synthwave, Lo-Fi).

### 2. Persistent Global Audio Engine (`AudioContext.tsx`)
- Native HTML5 Audio instance wrapped in a global React Context provider.
- **Uninterrupted Cross-Page Playback:** Audio never stops or reloads when navigating between the Storefront, Licensing Matrix, Producer Dashboard, or Downloads portal.
- **Dynamic Scrubber & Live Frequency Spectrum:** Interactive scrubber with hover timestamp preview, volume controls, mute toggle, and an 16-band live frequency audio visualizer.
- **Hardware Media Session API:** Native browser integration with `navigator.mediaSession` for play, pause, next track, previous track, and lock screen metadata display.
- **Procedural Beat Synthesizer Fallback (`audioSynthesis.ts`):** Client-side Web Audio API synthesizer that procedurally synthesizes 808 subs, kicks, claps, hats, and chords according to BPM and key if an external preview is throttled or offline.

### 3. Comprehensive Licensing Matrix & Stripe Integration
Four tier licensing model:
1. **MP3 Lease ($29.99):** High-quality 320kbps MP3, up to 100k audio streams, 1 commercial single.
2. **WAV Lease ($49.99):** Lossless 24-bit/48kHz Master WAV + MP3, up to 500k streams, radio airplay, music video rights.
3. **Trackout Stems ($149.99):** Master WAV + Untagged MP3 + Full multi-track stems archive (Drums, Bass, Synths, FX in ZIP), unlimited streaming, performance & sync rights.
4. **Exclusive Rights ($899.00):** 100% master copyright buyout, beat permanently delisted from the store, signed PDF legal bill of sale and transfer agreement.

- **Stripe Checkout Integration (`/api/checkout`):** Generates hosted Stripe checkout sessions or provides instant automated fulfillment in development demo mode.
- **Secure Webhook Handler (`/api/webhooks/stripe`):** Validates Stripe signatures on `checkout.session.completed` and registers order records.
- **Authenticated Download Portal (`/downloads/[token]`):** Instant access to master WAVs, MP3s, stems ZIP archives, and signed license certificates.

### 4. Producer Admin Dashboard & Studio Control Room
- **Revenue Analytics:** Gross royalties, unit sales count, stream impressions, and conversion rates.
- **Visual Performance Graph:** Monthly sales volume and license tier revenue distribution breakdown.
- **Top Performers Catalog:** Ranking of top-performing beats by stream counts and royalties.
- **Drag-and-Drop Beat Drop Publisher:** Drag-and-drop uploader for artwork (.PNG/.JPG), tagged preview (.MP3), untagged master (.WAV), and multi-track stems (.ZIP), with full metadata configuration (BPM, Key, Genre, Tags, Featured flag).
- **Live Orders Ledger:** Real-time stream of completed customer transactions and direct links to authenticated download portals.

---

## 🗄️ Database Architecture (`supabase/schema.sql`)

PostgreSQL schema configured with Row Level Security (RLS) policies:

- **`beats`:** `id`, `title`, `producer`, `bpm`, `key`, `genre`, `artwork_url`, `tagged_audio_url`, `master_audio_url`, `stems_url`, `play_count`, `is_featured`, `tags`, `created_at`
- **`licenses`:** `id`, `name`, `tier_slug`, `price`, `file_type`, `features`, `description`, `created_at`
- **`orders`:** `id`, `beat_id`, `license_id`, `buyer_email`, `buyer_name`, `stripe_session_id`, `download_token`, `amount_paid`, `status`, `created_at`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Environment Configuration (`.env.local`)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Supabase Production Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Stripe Production Credentials
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

*Note: In local or demo mode without Stripe keys, the site seamlessly provides instant order generation and directs to the authenticated download portal.*
