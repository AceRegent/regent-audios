"use client";

import React, { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  hue: number; // Red / Crimson to Amber/Gold (345 to 35)
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: -500,
    y: -500,
    targetX: -500,
    targetY: -500,
  });
  const { isPlaying, frequencyData } = useAudio();
  const isPlayingRef = useRef(isPlaying);
  const freqRef = useRef(frequencyData);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    freqRef.current = frequencyData;
  }, [isPlaying, frequencyData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Generate Pearlescent Ember Particles
    const particleCount = 45;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2, // Drifting upwards
        opacity: Math.random() * 0.6 + 0.1,
        fadeSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        hue: Math.random() > 0.7 ? 38 : 348 + Math.random() * 15, // Crimson/Ruby red with gold touches
      });
    }

    let beatPulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Audio beat intensity
      if (isPlayingRef.current && freqRef.current.length > 0) {
        const bassAvg = (freqRef.current[0] + freqRef.current[1] + freqRef.current[2]) / 3;
        beatPulse = (bassAvg / 100) * 0.8;
      } else {
        beatPulse *= 0.95;
      }

      // 1. Interactive Crimson/Peatlescent Mouse Glow
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const glowRadius = 320 + beatPulse * 80;
        const radialGradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          glowRadius
        );
        // Pearlescent transition: Crimson Ruby -> Smokey Peat -> Transparent
        radialGradient.addColorStop(0, "rgba(225, 29, 72, 0.14)");
        radialGradient.addColorStop(0.35, "rgba(185, 28, 28, 0.07)");
        radialGradient.addColorStop(0.7, "rgba(245, 158, 11, 0.02)");
        radialGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Ambient Deep Red/Peat Corner Aurora Orbs (Breathing)
      const time = Date.now() * 0.0006;
      const orb1X = width * 0.2 + Math.sin(time) * 120;
      const orb1Y = height * 0.25 + Math.cos(time * 0.8) * 80;
      const orb1Radius = 450 + beatPulse * 100;

      const aurora1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, orb1Radius);
      aurora1.addColorStop(0, `rgba(225, 29, 72, ${0.08 + beatPulse * 0.06})`);
      aurora1.addColorStop(0.5, "rgba(153, 27, 27, 0.03)");
      aurora1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = aurora1;
      ctx.beginPath();
      ctx.arc(orb1X, orb1Y, orb1Radius, 0, Math.PI * 2);
      ctx.fill();

      // Right-side ambient amber/crimson pearlescent shimmer
      const orb2X = width * 0.85 + Math.cos(time * 0.7) * 90;
      const orb2Y = height * 0.7 + Math.sin(time) * 100;
      const orb2Radius = 500 + beatPulse * 120;

      const aurora2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, orb2Radius);
      aurora2.addColorStop(0, `rgba(185, 28, 28, ${0.07 + beatPulse * 0.05})`);
      aurora2.addColorStop(0.4, "rgba(245, 158, 11, 0.03)");
      aurora2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = aurora2;
      ctx.beginPath();
      ctx.arc(orb2X, orb2Y, orb2Radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Floating Pearlescent Ember Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY * (1 + beatPulse * 0.8);
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.75 || p.opacity < 0.1) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Wrap around screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.opacity * (1 + beatPulse * 0.4)})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.5)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-1000"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
