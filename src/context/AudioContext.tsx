"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Beat } from "@/types";
import { INITIAL_BEATS } from "@/lib/constants";
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
  setPlaylist: (tracks: Beat[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Beat[]>(INITIAL_BEATS);
  const [currentTrack, setCurrentTrack] = useState<Beat | null>(INITIAL_BEATS[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(16).fill(10));
  const [licensingBeat, setLicensingBeat] = useState<Beat | null>(null);
  const [isLicensingOpen, setIsLicensingOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<ReturnType<typeof getBeatSynthesizer> | null>(null);
  const isUsingSynthRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

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
      // If audio file URL cannot load (e.g. CORS or network restriction), use synth fallback seamlessly
      if (isPlaying && currentTrack) {
        console.warn("Audio file preview unavailable, engaging studio audio synthesizer engine.");
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
        // High fidelity rhythmic visualizer simulation based on BPM
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
          console.warn("HTML5 audio playback blocked or restricted; engaging audio synthesizer.", err);
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
        setPlaylist,
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
