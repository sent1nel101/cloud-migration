/**
 * Tier Constants & Hierarchy
 * 
 * Defines the tier system and hierarchy validation logic.
 * Used to prevent users from downgrading to lower tiers.
 */

export const TIER_HIERARCHY = {
  FREE: 0,
  PROFESSIONAL: 1,
  PREMIUM: 2,
} as const

export type TierLevel = keyof typeof TIER_HIERARCHY

/**
 * Checks if a user can upgrade to a target tier.
 * Users can only upgrade to higher tiers, not downgrade.
 * 
 * @param currentTier - User's current tier
 * @param targetTier - Tier they want to upgrade to
 * @returns true if upgrade is allowed, false if downgrade or same tier
 */
export function canUpgradeToTier(currentTier: string, targetTier: TierLevel): boolean {
  const current = TIER_HIERARCHY[currentTier as TierLevel] ?? -1
  const target = TIER_HIERARCHY[targetTier]
  
  // Can only upgrade if target is higher than current
  return target > current
}

/**
 * Gets the display text for a tier button based on user state.
 * 
 * @param userTier - User's current tier (or undefined if not logged in)
 * @param targetTier - The tier this button represents
 * @returns Button display text
 */
export function getTierButtonText(
  userTier: string | undefined,
  targetTier: TierLevel
): string {
  if (!userTier) {
    return targetTier === "FREE" ? "Get Started Free" : "Sign In to Upgrade"
  }

  if (userTier === targetTier) {
    return "Current Plan"
  }

  const canUpgrade = canUpgradeToTier(userTier, targetTier)
  if (!canUpgrade) {
    return "Downgrade Not Available"
  }

  if (targetTier === "PROFESSIONAL") {
    return "Upgrade to Professional"
  }
  if (targetTier === "PREMIUM") {
    return "Get Premium"
  }
  return "Get Started Free"
}

/**
 * Determines if a button should be disabled.
 * Buttons are disabled when:
 * - User is at current tier
 * - User would be downgrading
 * 
 * @param userTier - User's current tier
 * @param targetTier - The tier this button represents
 * @returns true if button should be disabled
 */
export function shouldDisableTierButton(
  userTier: string | undefined,
  targetTier: TierLevel
): boolean {
  if (!userTier) {
    // Not logged in - free button not disabled (no payment needed)
    return false
  }

  if (userTier === targetTier) {
    // Same tier as current - disable
    return true
  }

  // If target tier is lower than current - disable (can't downgrade)
  return !canUpgradeToTier(userTier, targetTier)
}
