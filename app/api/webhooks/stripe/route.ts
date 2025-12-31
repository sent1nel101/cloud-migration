import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { confirmPayment, failPayment } from "@/lib/payment-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events for payment confirmation
 *
 * Stripe events:
 * - payment_intent.succeeded - Payment completed, upgrade user tier
 * - payment_intent.payment_failed - Payment failed, mark as failed
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const stripePaymentId = paymentIntent.id
        const tier =
          (paymentIntent.metadata?.tier as "PROFESSIONAL" | "PREMIUM") ||
          "PROFESSIONAL"

        console.log("=== STRIPE WEBHOOK: payment_intent.succeeded ===")
        console.log("Stripe Payment ID:", stripePaymentId)
        console.log("Tier:", tier)
        console.log("Metadata:", paymentIntent.metadata)

        try {
          // Confirm payment in database and upgrade user tier
          const result = await confirmPayment(stripePaymentId)
          console.log(`✅ Payment ${stripePaymentId} confirmed, user upgraded to tier:`, result)
          console.log("User ID that was upgraded:", result.userId)
        } catch (error) {
          console.error(`❌ Failed to confirm payment ${stripePaymentId}:`, error)
          throw error
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const stripePaymentId = paymentIntent.id

        // Mark payment as failed in database
        await failPayment(stripePaymentId)
        console.log(`Payment ${stripePaymentId} failed`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
