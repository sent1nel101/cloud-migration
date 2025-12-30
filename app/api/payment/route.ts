import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPayment } from '@/lib/payment-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/payment
 * Create a Stripe payment intent for the user's tier upgrade
 *
 * Request body:
 * - tier: 'PROFESSIONAL' | 'PREMIUM'
 * - amount: number (in cents, e.g., 3900 for $39.00)
 *
 * Returns:
 * - clientSecret: string (for Stripe Elements)
 * - paymentId: string (database ID for tracking)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tier, amount } = await req.json();

    // Validate tier and amount
    if (!['PROFESSIONAL', 'PREMIUM'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      metadata: {
        userEmail: session.user.email,
        tier,
        userId: session.user.id,
      },
    });

    // Record payment in database
    const payment = await createPayment(
      session.user.id!,
      amount,
      tier as 'PROFESSIONAL' | 'PREMIUM',
      paymentIntent.id
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      success: true,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
}
