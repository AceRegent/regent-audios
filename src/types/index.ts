export type Genre = 
  | 'All'
  | 'Trap'
  | 'Boom Bap'
  | 'R&B'
  | 'Cinematic'
  | 'Drill'
  | 'Synthwave'
  | 'Lo-Fi';

export interface Beat {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  genre: Genre | string;
  artwork_url: string;
  tagged_audio_url: string;
  master_audio_url: string;
  stems_url?: string;
  play_count: number;
  duration?: number; // duration in seconds
  is_featured?: boolean;
  tags?: string[];
  created_at: string;
  exclusive_sold?: boolean;
}

export type LicenseTierSlug = 'mp3-lease' | 'wav-lease' | 'stems-lease' | 'exclusive';

export interface License {
  id: string;
  name: string;
  tier_slug: LicenseTierSlug;
  price: number;
  file_type: string;
  features: string[];
  description: string;
  popular?: boolean;
}

export interface Order {
  id: string;
  beat_id: string;
  beat?: Beat;
  license_id: string;
  license?: License;
  buyer_email: string;
  buyer_name?: string;
  stripe_session_id?: string;
  download_token: string;
  amount_paid: number;
  status: 'completed' | 'processing' | 'refunded';
  created_at: string;
}

export interface ProducerStats {
  totalRevenue: number;
  totalSales: number;
  totalPlays: number;
  activeLicenses: number;
  monthlyRevenue: { month: string; amount: number }[];
  tierBreakdown: { tier: string; count: number; revenue: number }[];
}
