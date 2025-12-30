'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

/**
 * CheckoutForm - Handles payment collection with Stripe Elements
 */
function CheckoutForm({ tier, amount }: { tier: 'PROFESSIONAL' | 'PREMIUM'; amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent on backend
      const paymentRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, amount }),
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const { clientSecret } = await paymentRes.json();

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const confirmRes = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'User' },
        },
      });

      if (confirmRes.error) {
        throw new Error(confirmRes.error.message);
      }

      if (confirmRes.paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = (amount / 100).toFixed(2);
  const tierLabel = tier === 'PROFESSIONAL' ? 'Professional' : 'Premium';

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Complete Your Payment</h2>
      <p className="checkout-summary">
        Upgrading to <strong>{tierLabel}</strong> for ${formattedAmount}
      </p>

      <div className="checkout-input-group">
        <label htmlFor="card">Card Details</label>
        <CardElement
          id="card"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424242',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }}
        />
      </div>

      {error && <div className="checkout-error">{error}</div>}
      {success && (
        <div className="checkout-success">
          Payment successful! Redirecting to dashboard...
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || success}
        className="checkout-button"
      >
        {loading ? 'Processing...' : `Pay $${formattedAmount}`}
      </button>

      <p className="checkout-disclaimer">
        Your payment is secure and processed by Stripe.
      </p>
    </form>
  );
}

/**
 * CheckoutPage - Payment page with Stripe Elements
 */
export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tier = (searchParams.get('tier') as 'PROFESSIONAL' | 'PREMIUM') || 'PROFESSIONAL';
  const amount = tier === 'PROFESSIONAL' ? 3900 : 12900; // in cents

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="checkout-loading">Loading...</main>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-card">
            <Elements stripe={stripePromise}>
              <CheckoutForm tier={tier} amount={amount} />
            </Elements>
          </div>

          <div className="checkout-info">
            <h3>Payment Information</h3>
            <ul>
              <li>✓ Secure payment processing by Stripe</li>
              <li>✓ Your tier upgrades immediately</li>
              <li>✓ 30-day money-back guarantee</li>
              <li>✓ Receipt sent to your email</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
