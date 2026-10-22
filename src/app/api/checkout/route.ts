import { NextRequest, NextResponse } from "next/server";
import { INITIAL_BEATS, LICENSING_TIERS } from "@/lib/constants";
import { generateDownloadToken } from "@/lib/utils";
import Stripe from "stripe";

// Initialize Stripe if secret key is configured
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-09-30.acacia" as any }) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { beatId, licenseId, buyerEmail, buyerName, appliedPromoCode, finalAmount } = body;

    if (!beatId || !licenseId || !buyerEmail) {
      return NextResponse.json(
        { message: "Missing required parameters (beatId, licenseId, buyerEmail)" },
        { status: 400 }
      );
    }

    const beat = INITIAL_BEATS.find((b) => b.id === beatId) || INITIAL_BEATS[0];
    const license = LICENSING_TIERS.find((l) => l.id === licenseId) || LICENSING_TIERS[0];
    const chargePrice = typeof finalAmount === "number" && finalAmount > 0 ? finalAmount : license.price;

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const downloadToken = generateDownloadToken();

    // If Stripe is configured with a real or test secret key, create a Stripe Checkout Session
    if (stripe && stripeSecret && !stripeSecret.includes("51...")) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${beat.title} - ${license.name}${appliedPromoCode ? ` (Promo: ${appliedPromoCode})` : ""}`,
                description: `Boutique license (${license.file_type}) for instrumental "${beat.title}" produced by ${beat.producer}.`,
                images: [beat.artwork_url],
              },
              unit_amount: Math.round(chargePrice * 100),
            },
            quantity: 1,
          },
        ],
        customer_email: buyerEmail,
        metadata: {
          beat_id: beat.id,
          license_id: license.id,
          download_token: downloadToken,
          buyer_name: buyerName || "Artist",
          applied_promo: appliedPromoCode || "none",
        },
        mode: "payment",
        success_url: `${origin}/downloads/${downloadToken}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // High-Fidelity Demo / Fallback Mode (Instant automated fulfillment)
    return NextResponse.json({
      success: true,
      downloadToken,
      beatTitle: beat.title,
      licenseName: license.name,
      amount: chargePrice,
      appliedPromoCode: appliedPromoCode || null,
      message: "Order fulfilled instantly in luxury demo mode.",
    });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
