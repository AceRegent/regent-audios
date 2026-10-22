"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  CreditCard,
  FileCheck,
  AlertCircle,
  Tag,
  Flame,
  Gift,
} from "lucide-react";
import { Beat, License, PromoCode } from "@/types";
import { useAudio } from "@/context/AudioContext";
import { formatCurrency, cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface LicensingDrawerProps {
  isOpen: boolean;
  beat: Beat | null;
  onClose: () => void;
}

export function LicensingDrawer({ isOpen, beat, onClose }: LicensingDrawerProps) {
  const { licenses, promoCodes } = useAudio();
  const [selectedTier, setSelectedTier] = useState<License>(licenses[1] || licenses[0]);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Promo Code Engine State
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoStatus, setPromoStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Sync selected tier if prices change in licenses state
  useEffect(() => {
    if (selectedTier) {
      const current = licenses.find((l) => l.id === selectedTier.id);
      if (current && current.price !== selectedTier.price) {
        setSelectedTier(current);
      }
    }
  }, [licenses, selectedTier]);

  if (!isOpen || !beat) return null;

  const currentTier = licenses.find((l) => l.id === selectedTier.id) || selectedTier;

  // Calculate pricing with applied promo discount
  const basePrice = currentTier.price;
  const discountAmount = appliedPromo ? (basePrice * appliedPromo.discount_percent) / 100 : 0;
  const finalPrice = Math.max(1, basePrice - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promoInput.trim().toUpperCase();
    if (!query) return;

    const matchedPromo = promoCodes.find((p) => p.code.toUpperCase() === query && p.is_active);
    if (matchedPromo) {
      setAppliedPromo(matchedPromo);
      setPromoStatus({
        message: `Success! ${matchedPromo.discount_percent}% off discount applied.`,
        isError: false,
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#E11D48", "#F59E0B", "#10B981"],
      });
    } else {
      setPromoStatus({
        message: "Invalid or expired promo code.",
        isError: true,
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoStatus(null);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address for delivery.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beatId: beat.id,
          licenseId: currentTier.id,
          buyerEmail,
          buyerName: buyerName || "Valued Artist",
          appliedPromoCode: appliedPromo?.code || null,
          finalAmount: finalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate checkout");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.downloadToken) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#E11D48", "#DC2626", "#F59E0B", "#FFFFFF"],
        });

        onClose();
        window.location.href = `/downloads/${data.downloadToken}`;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMsg(err.message || "Checkout session could not be created.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto overflow-hidden rounded-3xl border border-crimson/35 bg-[#0a080a] p-6 sm:p-8 shadow-[0_0_60px_rgba(225,29,72,0.3)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close licensing modal"
          className="absolute right-5 top-5 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
              <Image
                src={beat.artwork_url}
                alt={beat.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-crimson-light">
                  Select License Agreement
                </span>
                <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">
                  {beat.bpm} BPM • {beat.key}
                </span>
              </div>
              <h2 className="font-sans text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                {beat.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Lock className="h-3.5 w-3.5 text-crimson" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* BOGO Incentive Banner */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-crimson/10 to-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">
              PRODUCER BOGO DEAL: Buy 1 Lease, Get Your Next Track 100% Free!
            </span>
          </div>
          <span className="hidden sm:inline-block rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200">
            Auto-Applied
          </span>
        </div>

        {/* Licensing Tiers Grid (Dynamic Prices) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {licenses.map((tier) => {
            const isSelected = currentTier.id === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer select-none",
                  isSelected
                    ? "border-crimson bg-crimson/[0.08] shadow-ruby"
                    : "border-white/[0.08] bg-zinc-950/60 hover:border-white/20"
                )}
              >
                {/* Popular Pill */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-crimson to-amber-500 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-ruby">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      {tier.name}
                    </span>
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                        isSelected
                          ? "border-crimson bg-crimson text-white"
                          : "border-zinc-600 bg-transparent"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-mono text-2xl font-black text-white">
                      {formatCurrency(tier.price)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">/ single</span>
                  </div>

                  <p className="mt-1 text-[11px] font-mono text-crimson-light">
                    {tier.file_type}
                  </p>

                  <p className="mt-2 text-xs text-zinc-400 leading-snug">
                    {tier.description}
                  </p>

                  {/* Features List */}
                  <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-crimson flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tier Summary, Promo Engine & Checkout Form */}
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-xl space-y-5">
          {/* Promo Code Input Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Tag className="h-4 w-4 text-crimson" />
              <span>Have a discount or VIP promo code?</span>
            </div>

            {!appliedPromo ? (
              <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. REGENT20"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-36 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs uppercase font-mono text-white placeholder-zinc-500 outline-none focus:border-crimson"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>{appliedPromo.code} (-{appliedPromo.discount_percent}%)</span>
                </span>
                <button
                  onClick={handleRemovePromo}
                  className="text-xs text-zinc-400 hover:text-red-400 underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {promoStatus && (
            <div className={cn("text-xs font-mono", promoStatus.isError ? "text-red-400" : "text-emerald-400")}>
              {promoStatus.message}
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Delivery Inputs */}
              <div className="flex-1 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-crimson-light flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" />
                  Licensee Delivery Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Your Artist / Stage Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Travis Vance"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-crimson"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Delivery Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-crimson"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Total & Checkout Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-6">
                <div className="text-right">
                  <span className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Total Due:
                  </span>
                  {appliedPromo && (
                    <span className="font-mono text-xs text-zinc-500 line-through mr-2">
                      {formatCurrency(basePrice)}
                    </span>
                  )}
                  <span className="font-mono text-3xl font-black text-crimson-light">
                    {formatCurrency(finalPrice)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson via-red-600 to-amber-500 px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-ruby hover:scale-[1.02] hover:shadow-ruby-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Generating Secure Order...</span>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 stroke-[2.5]" />
                      <span>Instant License & Download</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
