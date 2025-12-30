/**
 * PricingSection Component
 * 
 * Displays pricing tiers with feature comparisons.
 * Freemium model: Free tier includes full basic roadmap.
 * Professional and Premium tiers unlock enhanced features with one-time payments.
 */

export default function PricingSection() {
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
                You're using this
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
              <button className="pricing-button" style={{ backgroundColor: "var(--primary-color)" }} onClick={() => window.location.href = '/checkout?tier=PROFESSIONAL'}>
                Upgrade to Professional
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
              <button className="pricing-button" style={{ backgroundColor: "#a855f7" }} onClick={() => window.location.href = '/checkout?tier=PREMIUM'}>
                Get Premium
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
