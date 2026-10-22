"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Beat, License, Lead, PromoCode } from "@/types";
import { INITIAL_BEATS, LICENSING_TIERS } from "@/lib/constants";
import { getBeatSynthesizer } from "@/lib/audioSynthesis";

interface AudioContextType {
  currentTrack: Beat | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  frequencyData: number[];
  playlist: Beat[];
  licensingBeat: Beat | null;
  isLicensingOpen: boolean;
  freeDownloadBeat: Beat | null;
  isFreeDownloadOpen: boolean;
  licenses: License[];
  leads: Lead[];
  promoCodes: PromoCode[];
  playTrack: (track: Beat) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  openLicensingDrawer: (beat: Beat) => void;
  closeLicensingDrawer: () => void;
  openFreeDownloadModal: (beat: Beat) => void;
  closeFreeDownloadModal: () => void;
  setPlaylist: (tracks: Beat[]) => void;
  updateLicensePrice: (tierId: string, newPrice: number) => void;
  addLead: (artist_name: string, email: string, beat: Beat) => void;
  addPromoCode: (code: string, discount_percent: number) => void;
  togglePromoCode: (id: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const INITIAL_PROMO_CODES: PromoCode[] = [
  { id: "promo-1", code: "REGENT20", discount_percent: 20, is_active: true, description: "Welcome 20% discount for audition leads" },
  { id: "promo-2", code: "VIP50", discount_percent: 50, is_active: false, description: "VIP producer flash sale discount" },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    artist_name: "Kidd Travis",
    email: "travis.wav@gmail.com",
    beat_id: "beat-1",
    beat_title: "MIDNIGHT DYNASTY",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead-2",
    artist_name: "Luna Vance",
    email: "lunavance.music@outlook.com",
    beat_id: "beat-3",
    beat_title: "VELVET PENTHOUSE",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "lead-3",
    artist_name: "Dax Sterling",
    email: "daxsterling@defjamrecords.demo",
    beat_id: "beat-5",
    beat_title: "NEO TOKYO 2099",
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
  },
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Beat[]>(INITIAL_BEATS);
  const [currentTrack, setCurrentTrack] = useState<Beat | null>(INITIAL_BEATS[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(16).fill(10));
  
  // Modals state
  const [licensingBeat, setLicensingBeat] = useState<Beat | null>(null);
  const [isLicensingOpen, setIsLicensingOpen] = useState<boolean>(false);
  const [freeDownloadBeat, setFreeDownloadBeat] = useState<Beat | null>(null);
  const [isFreeDownloadOpen, setIsFreeDownloadOpen] = useState<boolean>(false);

  // Dynamic Pricing, Leads & Promo Engine State
  const [licenses, setLicenses] = useState<License[]>(LICENSING_TIERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<ReturnType<typeof getBeatSynthesizer> | null>(null);
  const isUsingSynthRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Load persisted licenses, leads, and promos from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedLicenses = localStorage.getItem("regent_licenses");
      if (storedLicenses) {
        setLicenses(JSON.parse(storedLicenses));
      }
      const storedLeads = localStorage.getItem("regent_leads");
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      }
      const storedPromos = localStorage.getItem("regent_promos");
      if (storedPromos) {
        setPromoCodes(JSON.parse(storedPromos));
      }
    } catch (e) {
      console.warn("Could not read local storage for state:", e);
    }
  }, []);

  // Initialize native HTML5 Audio element
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;
    synthRef.current = getBeatSynthesizer();

    const updateProgress = () => {
      if (audio.currentTime) {
        setProgress(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = () => {
      if (isPlaying && currentTrack) {
        isUsingSynthRef.current = true;
        synthRef.current?.start(currentTrack.bpm);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      synthRef.current?.stop();
    };
  }, []);

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    synthRef.current?.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Audio frequency simulation & live analyzer
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setFrequencyData(new Array(16).fill(6));
      return;
    }

    const updateFrequencies = () => {
      if (analyserRef.current) {
        const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(buffer);
        const sliced = Array.from(buffer.slice(0, 16)).map((val) => Math.max(10, Math.min(100, (val / 255) * 100)));
        setFrequencyData(sliced);
      } else {
        const time = Date.now() / 150;
        const simulated = Array.from({ length: 16 }, (_, i) => {
          const wave = Math.sin(time + i * 0.4) * 35 + Math.cos(time * 0.8 + i) * 25 + 35;
          return Math.max(10, Math.min(95, wave));
        });
        setFrequencyData(simulated);
      }
      animFrameRef.current = requestAnimationFrame(updateFrequencies);
    };

    animFrameRef.current = requestAnimationFrame(updateFrequencies);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Media Session API support
  const updateMediaSession = useCallback((track: Beat) => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.producer,
      album: "Regent Audios Exclusive Vault",
      artwork: [
        { src: track.artwork_url, sizes: "512x512", type: "image/jpeg" },
        { src: track.artwork_url, sizes: "256x256", type: "image/jpeg" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      setIsPlaying(true);
      audioRef.current?.play().catch(() => {});
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      setIsPlaying(false);
      audioRef.current?.pause();
      synthRef.current?.stop();
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) {
        seek(details.seekTime);
      }
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      prevTrack();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      nextTrack();
    });
  }, []);

  const playTrack = useCallback((track: Beat) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setDuration(track.duration || 180);
    updateMediaSession(track);

    if (audioRef.current) {
      isUsingSynthRef.current = false;
      audioRef.current.src = track.tagged_audio_url;
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          isUsingSynthRef.current = true;
          synthRef.current?.start(track.bpm);
        });
      }
    } else {
      isUsingSynthRef.current = true;
      synthRef.current?.start(track.bpm);
    }
  }, [updateMediaSession]);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    synthRef.current?.stop();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      if (currentTrack) {
        setIsPlaying(true);
        if (isUsingSynthRef.current) {
          synthRef.current?.start(currentTrack.bpm);
        } else if (audioRef.current) {
          audioRef.current.play().catch(() => {
            isUsingSynthRef.current = true;
            synthRef.current?.start(currentTrack.bpm);
          });
        }
      } else if (playlist.length > 0) {
        playTrack(playlist[0]);
      }
    }
  }, [isPlaying, currentTrack, playlist, pauseTrack, playTrack]);

  const seek = useCallback((seconds: number) => {
    setProgress(seconds);
    if (audioRef.current && !isUsingSynthRef.current) {
      audioRef.current.currentTime = seconds;
    }
  }, []);

  const setVolumeLevel = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((b) => b.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  }, [currentTrack, playlist, playTrack]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((b) => b.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  }, [currentTrack, playlist, playTrack]);

  const openLicensingDrawer = useCallback((beat: Beat) => {
    setLicensingBeat(beat);
    setIsLicensingOpen(true);
  }, []);

  const closeLicensingDrawer = useCallback(() => {
    setIsLicensingOpen(false);
  }, []);

  const openFreeDownloadModal = useCallback((beat: Beat) => {
    setFreeDownloadBeat(beat);
    setIsFreeDownloadOpen(true);
  }, []);

  const closeFreeDownloadModal = useCallback(() => {
    setIsFreeDownloadOpen(false);
  }, []);

  // Dynamic Pricing Update
  const updateLicensePrice = useCallback((tierId: string, newPrice: number) => {
    setLicenses((prev) => {
      const updated = prev.map((l) => (l.id === tierId ? { ...l, price: Math.max(1, newPrice) } : l));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("regent_licenses", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  // Add captured artist lead
  const addLead = useCallback((artist_name: string, email: string, beat: Beat) => {
    const newLead: Lead = {
      id: "lead-" + Date.now(),
      artist_name,
      email,
      beat_id: beat.id,
      beat_title: beat.title,
      created_at: new Date().toISOString(),
    };
    setLeads((prev) => {
      const updated = [newLead, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("regent_leads", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  // Promo codes management
  const addPromoCode = useCallback((code: string, discount_percent: number) => {
    const newPromo: PromoCode = {
      id: "promo-" + Date.now(),
      code: code.trim().toUpperCase(),
      discount_percent: Math.min(100, Math.max(1, discount_percent)),
      is_active: true,
      description: `${discount_percent}% off discount coupon`,
    };
    setPromoCodes((prev) => {
      const updated = [newPromo, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("regent_promos", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  const togglePromoCode = useCallback((id: string) => {
    setPromoCodes((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("regent_promos", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        frequencyData,
        playlist,
        licensingBeat,
        isLicensingOpen,
        freeDownloadBeat,
        isFreeDownloadOpen,
        licenses,
        leads,
        promoCodes,
        playTrack,
        pauseTrack,
        togglePlay,
        seek,
        setVolumeLevel,
        toggleMute,
        nextTrack,
        prevTrack,
        openLicensingDrawer,
        closeLicensingDrawer,
        openFreeDownloadModal,
        closeFreeDownloadModal,
        setPlaylist,
        updateLicensePrice,
        addLead,
        addPromoCode,
        togglePromoCode,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
