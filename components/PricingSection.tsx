/**
 * PricingSection Component
 * 
 * Displays pricing tiers with feature comparisons.
 * Freemium model: Free tier includes full basic roadmap.
 * Professional and Premium tiers unlock enhanced features with one-time payments.
 */

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PricingSection() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const handleUpgrade = (tier: "PROFESSIONAL" | "PREMIUM") => {
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    const userTier = (session.user as any)?.tier || "FREE"
    
    // Prevent re-purchasing same tier
    if (userTier === tier) {
      alert("You already have this plan!")
      return
    }
    
    const amount = tier === "PROFESSIONAL" ? 3900 : 12900
    router.push(`/checkout?tier=${tier}`)
  }
  
  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-header">
          <h2>Choose Your Path</h2>
          <p>Start free, upgrade anytime. All plans include your personalized AI career roadmap.</p>
        </div>

        <div className="pricing-grid">
          {/* Free Tier - Full Basic Roadmap */}
          <div className="pricing-card">
            <div className="pricing-header-section" style={{ background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)" }}>
              <h3>Free</h3>
              <div className="subtitle">Forever free, no credit card</div>
            </div>
            <div className="pricing-content">
              <div className="pricing-price">$0</div>
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Full 4-phase career roadmap</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Complete skill gaps analysis</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Recommended career paths</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Personalized timeline</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Printable PDF roadmap</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✗</span>
                  <span style={{ color: "var(--text-secondary)" }}>Curated course recommendations</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✗</span>
                  <span style={{ color: "var(--text-secondary)" }}>Resume optimization</span>
                </li>
              </ul>
              <button className="pricing-button" style={{ backgroundColor: "#6b7280" }} disabled>
                 {session && (session.user as any)?.tier === "FREE" ? "You're using this" : "Start Free"}
               </button>
            </div>
          </div>

          {/* Professional Tier - One-time payment */}
          <div className="pricing-card featured">
            <div className="pricing-header-section">
              <div className="badge">MOST POPULAR</div>
              <h3>Professional</h3>
              <div className="subtitle">Detailed roadmap + resources</div>
            </div>
            <div className="pricing-content">
              <div className="pricing-price">$39</div>
              <div className="pricing-period">one-time</div>
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Everything in Free</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Curated course links by phase</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Portfolio project ideas</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Skills gap prioritized by demand</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Resume tailoring suggestions</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Email support</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✗</span>
                  <span style={{ color: "var(--text-secondary)" }}>AI-powered resume rewrite</span>
                </li>
              </ul>
              <button 
                className="pricing-button" 
                style={{ 
                  backgroundColor: "var(--primary-color)",
                  ...(session && (session.user as any)?.tier === "PROFESSIONAL" ? { opacity: 0.6, cursor: "not-allowed" } : {})
                }} 
                onClick={() => handleUpgrade("PROFESSIONAL")}
                disabled={!!(session && (session.user as any)?.tier === "PROFESSIONAL")}
              >
                {session && (session.user as any)?.tier === "PROFESSIONAL" 
                  ? "Current Plan" 
                  : "Upgrade to Professional"}
               </button>
            </div>
          </div>

          {/* Premium Tier - One-time payment */}
          <div className="pricing-card">
            <div className="pricing-header-section" style={{ background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)" }}>
              <h3>Premium</h3>
              <div className="subtitle">Complete career transformation</div>
            </div>
            <div className="pricing-content">
              <div className="pricing-price">$129</div>
              <div className="pricing-period">one-time</div>
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Everything in Professional</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>AI-powered resume rewrite</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Multiple resume versions</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>LinkedIn profile optimization</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Specific copy suggestions</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>Certification roadmap by ROI</span>
                </li>
                <li className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>One revision/update (3 months)</span>
                </li>
              </ul>
              <button 
                className="pricing-button" 
                style={{ 
                  backgroundColor: "#a855f7",
                  ...(session && (session.user as any)?.tier === "PREMIUM" ? { opacity: 0.6, cursor: "not-allowed" } : {})
                }} 
                onClick={() => handleUpgrade("PREMIUM")}
                disabled={!!(session && (session.user as any)?.tier === "PREMIUM")}
              >
                {session && (session.user as any)?.tier === "PREMIUM" 
                  ? "Current Plan" 
                  : "Get Premium"}
               </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            Questions? <a href="/contact" style={{ color: "var(--primary-color)" }}>Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
}
