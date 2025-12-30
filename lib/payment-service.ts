/**
 * Payment Service
 * Handles payment processing and tracking
 */

import { prisma } from "@/lib/prisma";

/**
 * Create a payment record in the database
 * @param userId - User ID
 * @param tier - Tier being purchased (PROFESSIONAL or PREMIUM)
 * @param stripePaymentId - Stripe payment ID
 * @param stripeSessionId - Optional Stripe session ID
 * @returns Created payment object
 */
export async function createPayment(
  userId: string,
  tier: "PROFESSIONAL" | "PREMIUM",
  stripePaymentId: string,
  stripeSessionId?: string
) {
  // Get amount based on tier
  const amount = tier === "PROFESSIONAL" ? 3900 : 12900; // in cents

  return prisma.payment.create({
    data: {
      userId,
      tier,
      amount,
      currency: "usd",
      stripePaymentId,
      stripeSessionId,
      status: "PENDING",
      description: `${tier} tier upgrade`,
    },
  });
}

/**
 * Mark payment as succeeded and upgrade user tier
 * @param stripePaymentId - Stripe payment ID
 * @returns Updated payment object
 */
export async function confirmPayment(stripePaymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { stripePaymentId },
    data: {
      status: "SUCCEEDED",
      paidAt: new Date(),
    },
  });

  // Upgrade user tier
  await prisma.user.update({
    where: { id: payment.userId },
    data: { tier: payment.tier as any },
  });

  return updatedPayment;
}

/**
 * Mark payment as failed
 * @param stripePaymentId - Stripe payment ID
 * @returns Updated payment object
 */
export async function failPayment(stripePaymentId: string) {
  return prisma.payment.update({
    where: { stripePaymentId },
    data: {
      status: "FAILED",
    },
  });
}

/**
 * Process a refund
 * @param stripePaymentId - Stripe payment ID
 * @param reason - Reason for refund
 * @returns Updated payment object
 */
export async function refundPayment(stripePaymentId: string, reason: string) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Update payment as refunded
  const refundedPayment = await prisma.payment.update({
    where: { stripePaymentId },
    data: {
      status: "REFUNDED",
      refundedAt: new Date(),
      refundReason: reason,
    },
  });

  // Downgrade user to FREE tier
  await prisma.user.update({
    where: { id: payment.userId },
    data: { tier: "FREE" },
  });

  return refundedPayment;
}

/**
 * Get payment history for a user
 * @param userId - User ID
 * @param limit - Maximum number of payments to return
 * @returns Array of payment objects
 */
export async function getPaymentHistory(userId: string, limit: number = 10) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get a specific payment by Stripe ID
 * @param stripePaymentId - Stripe payment ID
 * @returns Payment object or null
 */
export async function getPaymentByStripeId(stripePaymentId: string) {
  return prisma.payment.findUnique({
    where: { stripePaymentId },
  });
}

/**
 * Check if user has valid active payment for a tier
 * @param userId - User ID
 * @param tier - Tier to check
 * @returns True if user has succeeded payment
 */
export async function hasValidPayment(
  userId: string,
  tier: "FREE" | "PROFESSIONAL" | "PREMIUM"
): Promise<boolean> {
  const tierHierarchy = { FREE: 0, PROFESSIONAL: 1, PREMIUM: 2 };
  const requiredLevel = tierHierarchy[tier];

  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      status: "SUCCEEDED",
    },
    orderBy: { paidAt: "desc" },
  });

  if (!payment) return false;

  const paidTierLevel = tierHierarchy[payment.tier as keyof typeof tierHierarchy];
  return paidTierLevel >= requiredLevel;
}
