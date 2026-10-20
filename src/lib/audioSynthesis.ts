// Web Audio API procedural audio fallback
// Generates realistic musical synthesis (808 bass, hi-hats, synth cords) tailored to BPM and Key

class BeatSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentStep = 0;
  private bpm = 120;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;

  constructor() {
    // Lazy initialize when user interacts
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public start(bpm: number = 130) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.bpm = bpm;
    this.isPlaying = true;
    this.currentStep = 0;

    const stepInterval = (60 / this.bpm) / 4; // 16th notes
    let nextStepTime = this.ctx.currentTime + 0.05;

    const schedule = () => {
      if (!this.isPlaying || !this.ctx) return;
      while (nextStepTime < this.ctx.currentTime + 0.1) {
        this.playStep(this.currentStep, nextStepTime);
        this.currentStep = (this.currentStep + 1) % 16;
        nextStepTime += stepInterval;
      }
      this.timerId = window.setTimeout(schedule, 25);
    };

    schedule();
  }

  private playStep(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Kick / 808 on 0, 6, 10
    if (step === 0 || step === 6 || step === 10) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.35);

      gain.gain.setValueAtTime(0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.45);
    }

    // Snare / Clap on 4, 12
    if (step === 4 || step === 12) {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.12);

      oscGain.gain.setValueAtTime(0.5, time);
      oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.18);

      // Noise layer for snare crack
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1000;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(time);
    }

    // Hi-hats on every even 16th note, plus rolls on 14, 15
    if (step % 2 === 0 || step === 14 || step === 15) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(8000, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 7000;

      gain.gain.setValueAtTime(step === 14 || step === 15 ? 0.08 : 0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.05);
    }

    // Melodic Synth Chords on bar start (step 0, 8)
    if (step === 0 || step === 8) {
      const chordNotes = step === 0 ? [220, 261.63, 329.63] : [196, 246.94, 293.66]; // A Minor / G Major
      chordNotes.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, time);

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, time);
        filter.frequency.exponentialRampToValueAtTime(400, time + 0.8);

        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 1.0);
      });
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol * 0.4)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

let synthInstance: BeatSynthesizer | null = null;

export function getBeatSynthesizer(): BeatSynthesizer {
  if (!synthInstance) {
    synthInstance = new BeatSynthesizer();
  }
  return synthInstance;
}
