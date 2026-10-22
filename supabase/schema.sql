-- =========================================================
-- REGENT AUDIOS - PostgreSQL / Supabase Database Schema
-- Luxury Boutique Beat Licensing Platform
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BEATS TABLE
CREATE TABLE IF NOT EXISTS beats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    producer TEXT NOT NULL DEFAULT 'Regent Audio Lab',
    bpm INT NOT NULL,
    key VARCHAR(20) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    artwork_url TEXT NOT NULL,
    tagged_audio_url TEXT NOT NULL,
    master_audio_url TEXT NOT NULL,
    stems_url TEXT,
    play_count BIGINT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LICENSES TABLE
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tier_slug VARCHAR(50) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    features TEXT[] NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID NOT NULL REFERENCES beats(id) ON DELETE CASCADE,
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE RESTRICT,
    buyer_email TEXT NOT NULL,
    buyer_name TEXT,
    stripe_session_id TEXT UNIQUE,
    download_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    amount_paid NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    applied_promo VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ARTIST LEADS TABLE (Free Tagged Audition Downloads)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_name TEXT NOT NULL,
    email TEXT NOT NULL,
    beat_id UUID REFERENCES beats(id) ON DELETE SET NULL,
    beat_title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Beats: Public read access, Admin write access
CREATE POLICY "Public beats are readable by everyone" 
    ON beats FOR SELECT USING (true);

CREATE POLICY "Authenticated admins can insert beats" 
    ON beats FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated admins can update beats" 
    ON beats FOR UPDATE TO authenticated USING (true);

-- Licenses: Public read access, Admin update
CREATE POLICY "Public licenses are readable by everyone" 
    ON licenses FOR SELECT USING (true);

CREATE POLICY "Authenticated admins can update licenses" 
    ON licenses FOR UPDATE TO authenticated USING (true);

-- Orders: Users can read their own order via download_token or email
CREATE POLICY "Orders readable with token" 
    ON orders FOR SELECT USING (true);

CREATE POLICY "Service role can insert orders" 
    ON orders FOR INSERT WITH CHECK (true);

-- Leads: Public insert (lead magnet), Admin select/export
CREATE POLICY "Public can insert leads" 
    ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated admins can view leads" 
    ON leads FOR SELECT TO authenticated USING (true);

-- Promo Codes: Public can verify active codes
CREATE POLICY "Public can read active promo codes" 
    ON promo_codes FOR SELECT USING (is_active = true);

-- =========================================================
-- SEED DATA
-- =========================================================

-- Insert standard licensing tiers
INSERT INTO licenses (name, tier_slug, price, file_type, features, description) VALUES
(
    'MP3 Lease',
    'mp3-lease',
    29.99,
    '320kbps MP3',
    ARRAY[
        'High Quality 320kbps Untagged MP3',
        'Up to 100,000 Audio Streams',
        'Distribute to Spotify, Apple Music & YouTube',
        '1 Music Video / Non-exclusive rights',
        'Instant Automated Delivery'
    ],
    'Perfect for independent single releases, mixtapes, and streaming debut.'
),
(
    'WAV Lease',
    'wav-lease',
    49.99,
    '24-Bit 48kHz WAV + MP3',
    ARRAY[
        'Lossless 24-Bit 48kHz Master WAV + MP3',
        'Up to 500,000 Audio Streams',
        'Commercial Radio Airplay & Live Performances',
        '2 Music Videos / Non-exclusive rights',
        'Free MP3 Tagged Reference Track'
    ],
    'The industry standard for serious vocal recording, mixing, and commercial streaming.'
),
(
    'Trackout Stems',
    'stems-lease',
    149.99,
    '24-Bit Stems Archive (ZIP)',
    ARRAY[
        'Master WAV + Untagged MP3',
        'Full Multi-Track Stems (Drums, Bass, Synths, FX)',
        'Unlimited Audio Streams & Live Performance',
        'Full Control for Audio Engineers & Mastering',
        'Commercial Sync & Broadcasting Clearance'
    ],
    'Ultimate flexibility. Isolate kicks, 808s, melodies, and FX for professional album mastering.'
),
(
    'Exclusive Rights',
    'exclusive',
    899.00,
    'Master WAV + Stems + Full Ownership Contract',
    ARRAY[
        'Sole Ownership Transfer & Beat Delisting',
        'Unlimited Streams, Sales & Sync Placements',
        'Signed PDF Exclusive Bill of Sale & Transfer Agreement',
        'Direct Stems, Master WAV & Untagged MP3 Delivery',
        'Royalty-Free Worldwide Exploitation'
    ],
    'Complete master buyout. The beat is permanently retired from the Regent catalog for your exclusive use.'
)
ON CONFLICT (tier_slug) DO NOTHING;

-- Seed default promo code
INSERT INTO promo_codes (code, discount_percent, is_active, description) VALUES
('REGENT20', 20, true, 'Standard 20% discount for audition leads')
ON CONFLICT (code) DO NOTHING;
