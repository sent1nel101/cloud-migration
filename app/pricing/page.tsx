import Link from "next/link";

export default function Pricing() {
  return (
    <div className="page-container">
      <h1>Simple, Transparent Pricing</h1>

      <section className="pricing-intro">
        <p>
          Choose the plan that's right for you. All plans include our core AI roadmap generation. Upgrade anytime.
        </p>
      </section>

      <section className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-header">
            <h2>Free</h2>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">0</span>
              <span className="period">/month</span>
            </div>
          </div>

          <div className="pricing-features">
            <p className="feature-intro">Everything you need to get started</p>
            <ul>
              <li>✓ AI Career Roadmap Generation</li>
              <li>✓ Skill Gap Analysis</li>
              <li>✓ Timeline Estimates (4 phases)</li>
              <li>✓ Recommended Roles & Salaries</li>
              <li>✓ Resource Recommendations</li>
              <li>✓ Printable Roadmap (PDF)</li>
              <li>✓ Email Support</li>
            </ul>
          </div>
          <Link href="/" className="pricing-button">Get Started Free</Link>
        </div>

        <div className="pricing-card featured">
          <div className="popular-badge">Most Popular</div>
          <div className="pricing-header">
            <h2>Pro</h2>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">29</span>
              <span className="period">/month</span>
            </div>
          </div>

          <div className="pricing-features">
            <p className="feature-intro">For serious career changers</p>
            <ul>
              <li>✓ Everything in Free</li>
              <li>✓ Real Course Links (Coursera, Udemy, etc.)</li>
              <li>✓ Detailed Portfolio Project Ideas</li>
              <li>✓ Resume Optimization Guide</li>
              <li>✓ LinkedIn Profile Template</li>
              <li>✓ AI Career Coach (Monthly)</li>
              <li>✓ Save Multiple Roadmaps</li>
              <li>✓ Priority Email Support (24h)</li>
              <li>✓ Ad-Free Experience</li>
            </ul>
          </div>
          <button className="pricing-button pricing-button-primary">Start Free Trial</button>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h2>Enterprise</h2>
            <div className="price">
              <span className="custom">Custom</span>
            </div>
          </div>

          <div className="pricing-features">
            <p className="feature-intro">For teams and organizations</p>
            <ul>
              <li>✓ Everything in Pro</li>
              <li>✓ Team Member Management (Up to 100)</li>
              <li>✓ Advanced Analytics Dashboard</li>
              <li>✓ Custom AI Training</li>
              <li>✓ API Access & Integrations</li>
              <li>✓ SSO/SAML Authentication</li>
              <li>✓ Dedicated Account Manager</li>
              <li>✓ 24/7 Phone Support</li>
              <li>✓ 99.9% SLA Guarantee</li>
            </ul>
          </div>
          <Link href="/#contact" className="pricing-button">Contact Sales</Link>
        </div>
      </section>

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>Can I change plans anytime?</h3>
          <p>Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately for new charges and refunds are prorated.</p>
        </div>

        <div className="faq-item">
          <h3>Do you offer annual billing discounts?</h3>
          <p>Yes. Pro tier annual billing (pay $290/year instead of $348) saves you 16%. Contact sales for Enterprise annual pricing.</p>
        </div>

        <div className="faq-item">
          <h3>What payment methods do you accept?</h3>
          <p>We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can arrange invoicing.</p>
        </div>

        <div className="faq-item">
          <h3>Is there a free trial for Pro?</h3>
          <p>Yes. Get 14 days free of all Pro features. No credit card required to start your trial.</p>
        </div>

        <div className="faq-item">
          <h3>What happens after the free trial?</h3>
          <p>We'll send you an email reminder 3 days before trial ends. You won't be charged unless you explicitly upgrade.</p>
        </div>

        <div className="faq-item">
          <h3>Do you offer refunds?</h3>
          <p>We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund you in full, no questions asked.</p>
        </div>
      </section>

      <section className="pricing-cta">
        <h2>Ready to Transform Your Career?</h2>
        <p>Start your free roadmap generation today. No credit card required.</p>
        <Link href="/" className="cta-button">Generate Your Roadmap</Link>
      </section>
    </div>
  );
}
