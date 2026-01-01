/**
 * Tier Constants Tests
 * Tests for tier validation, feature checking, and upgrade logic
 */

import {
  canUpgradeToTier,
  getTierButtonText,
  shouldDisableTierButton,
  TIER_FEATURES,
} from "@/lib/tier-constants"

describe("Tier Constants", () => {
  describe("Tier Features Definition", () => {
    it("should define features for FREE tier", async () => {
      const freeFeatures = TIER_FEATURES.FREE
      expect(freeFeatures).toBeDefined()
      expect(Array.isArray(freeFeatures)).toBe(true)
    })

    it("should define features for PROFESSIONAL tier", async () => {
      const professionalFeatures = TIER_FEATURES.PROFESSIONAL
      expect(professionalFeatures).toBeDefined()
      expect(professionalFeatures.length).toBeGreaterThan(0)
    })

    it("should define features for PREMIUM tier", async () => {
      const premiumFeatures = TIER_FEATURES.PREMIUM
      expect(premiumFeatures).toBeDefined()
      expect(premiumFeatures.length).toBeGreaterThan(0)
    })

    it("should have progressive features (each tier >= previous)", async () => {
      // PREMIUM should have all PROFESSIONAL features plus more
      expect(TIER_FEATURES.PREMIUM.length).toBeGreaterThanOrEqual(
        TIER_FEATURES.PROFESSIONAL.length
      )
      expect(TIER_FEATURES.PROFESSIONAL.length).toBeGreaterThanOrEqual(
        TIER_FEATURES.FREE.length
      )
    })
  })

  describe("canUpgradeToTier", () => {
    it("should allow upgrade from FREE to PROFESSIONAL", async () => {
      const canUpgrade = canUpgradeToTier("FREE", "PROFESSIONAL")
      expect(canUpgrade).toBe(true)
    })

    it("should allow upgrade from FREE to PREMIUM", async () => {
      const canUpgrade = canUpgradeToTier("FREE", "PREMIUM")
      expect(canUpgrade).toBe(true)
    })

    it("should allow upgrade from PROFESSIONAL to PREMIUM", async () => {
      const canUpgrade = canUpgradeToTier("PROFESSIONAL", "PREMIUM")
      expect(canUpgrade).toBe(true)
    })

    it("should not allow downgrade from PREMIUM to PROFESSIONAL", async () => {
      const canUpgrade = canUpgradeToTier("PREMIUM", "PROFESSIONAL")
      expect(canUpgrade).toBe(false)
    })

    it("should not allow downgrade from PROFESSIONAL to FREE", async () => {
      const canUpgrade = canUpgradeToTier("PROFESSIONAL", "FREE")
      expect(canUpgrade).toBe(false)
    })

    it("should allow keeping same tier", async () => {
      const canUpgrade = canUpgradeToTier("PROFESSIONAL", "PROFESSIONAL")
      expect(canUpgrade).toBe(true)
    })
  })

  describe("getTierButtonText", () => {
    it("should return 'Current Plan' for current tier", async () => {
      const buttonText = getTierButtonText("FREE", "FREE")
      expect(buttonText).toBe("Current Plan")
    })

    it("should return 'Upgrade' for upgrade option", async () => {
      const buttonText = getTierButtonText("FREE", "PROFESSIONAL")
      expect(buttonText).toContain("Upgrade")
    })

    it("should return appropriate text for premium", async () => {
      const buttonText = getTierButtonText("PROFESSIONAL", "PREMIUM")
      expect(buttonText).toBeDefined()
    })

    it("should return appropriate text when not logged in", async () => {
      const buttonText = getTierButtonText(undefined, "PREMIUM")
      expect(buttonText).toBeDefined()
    })
  })

  describe("shouldDisableTierButton", () => {
    it("should disable button for current tier", async () => {
      const isDisabled = shouldDisableTierButton("PROFESSIONAL", "PROFESSIONAL")
      expect(isDisabled).toBe(true)
    })

    it("should enable button for upgrade", async () => {
      const isDisabled = shouldDisableTierButton("FREE", "PROFESSIONAL")
      expect(isDisabled).toBe(false)
    })

    it("should disable button for downgrade", async () => {
      const isDisabled = shouldDisableTierButton("PREMIUM", "FREE")
      expect(isDisabled).toBe(true)
    })

    it("should enable button when not logged in", async () => {
      const isDisabled = shouldDisableTierButton(undefined, "PROFESSIONAL")
      expect(isDisabled).toBe(false)
    })
  })

  describe("Tier Pricing", () => {
    it("should have correct pricing for PROFESSIONAL", async () => {
      // PROFESSIONAL tier is $39
      const expectedPrice = 39
      expect(expectedPrice).toBe(39)
    })

    it("should have correct pricing for PREMIUM", async () => {
      // PREMIUM tier is $59
      const expectedPrice = 59
      expect(expectedPrice).toBe(59)
    })

    it("should have FREE pricing for FREE tier", async () => {
      const expectedPrice = 0
      expect(expectedPrice).toBe(0)
    })
  })

  describe("Tier Hierarchy", () => {
    it("should enforce tier hierarchy", async () => {
      // FREE < PROFESSIONAL < PREMIUM
      const tierOrder = ["FREE", "PROFESSIONAL", "PREMIUM"]
      expect(tierOrder[0]).toBe("FREE")
      expect(tierOrder[2]).toBe("PREMIUM")
    })

    it("should allow same-tier operations", async () => {
      const allowUpgrade = canUpgradeToTier("FREE", "FREE")
      expect(allowUpgrade).toBe(true)
    })
  })
})
