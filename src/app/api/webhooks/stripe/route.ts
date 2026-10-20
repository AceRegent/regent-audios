import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-09-30.acacia" as any }) : null;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ received: true, note: "Stripe not fully configured, webhook simulated." });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      const beatId = metadata?.beat_id;
      const licenseId = metadata?.license_id;
      const downloadToken = metadata?.download_token;
      const buyerEmail = session.customer_details?.email || session.customer_email;
      const buyerName = metadata?.buyer_name || session.customer_details?.name;

      console.log(`[Regent Audios Webhook] Order Completed!`, {
        sessionId: session.id,
        beatId,
        licenseId,
        downloadToken,
        buyerEmail,
        buyerName,
        amount: session.amount_total ? session.amount_total / 100 : 0,
      });

      // Here in production, Supabase or PostgreSQL order is inserted with downloadToken
      // e.g. await supabase.from('orders').insert({ beat_id, license_id, buyer_email, stripe_session_id: session.id, download_token })
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}
