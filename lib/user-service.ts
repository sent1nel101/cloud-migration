/**
 * User Service
 * Handles user-related database operations
 */

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Create a new user with email and password
 * @param email - User email address
 * @param password - Plain text password (will be hashed)
 * @param name - Optional user name
 * @returns Created user object or null if email exists
 */
export async function createUser(
  email: string,
  password: string,
  name?: string
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || email.split("@")[0], // Default to email prefix
      tier: "FREE", // New users start with FREE tier
    },
  });

  return user;
}

/**
 * Get user by ID with roadmaps and payment info
 * @param userId - User ID
 * @returns User object with related data
 */
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      roadmaps: true,
      payments: {
        where: { status: "SUCCEEDED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Update user tier after successful payment
 * @param userId - User ID
 * @param tier - New tier (PROFESSIONAL or PREMIUM)
 * @returns Updated user object
 */
export async function upgradeTier(userId: string, tier: "FREE" | "PROFESSIONAL" | "PREMIUM") {
  if (tier === "FREE") {
    throw new Error("Cannot downgrade to FREE tier");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { tier },
  });
}

/**
 * Get user's tier level
 * @param userId - User ID
 * @returns User tier (FREE, PROFESSIONAL, or PREMIUM)
 */
export async function getUserTier(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  });
  return user?.tier ?? null;
}

/**
 * Check if user has access to a feature
 * @param userId - User ID
 * @param requiredTier - Minimum tier required (FREE, PROFESSIONAL, PREMIUM)
 * @returns True if user has access
 */
export async function hasAccessTo(
  userId: string,
  requiredTier: "FREE" | "PROFESSIONAL" | "PREMIUM"
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  });

  if (!user) return false;

  const tierHierarchy = { FREE: 0, PROFESSIONAL: 1, PREMIUM: 2 };
  const userLevel = tierHierarchy[user.tier];
  const requiredLevel = tierHierarchy[requiredTier];

  return userLevel >= requiredLevel;
}

/**
 * Save Stripe customer ID to user
 * @param userId - User ID
 * @param stripeCustomerId - Stripe customer ID from Stripe API
 */
export async function saveStripeCustomerId(
  userId: string,
  stripeCustomerId: string
) {
  return prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId },
  });
}
