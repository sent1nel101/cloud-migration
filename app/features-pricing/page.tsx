'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FeaturesPricing() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleUpgrade = (tier: 'PROFESSIONAL' | 'PREMIUM') => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    const amount = tier === 'PROFESSIONAL' ? 3900 : 12900;
    router.push(`/checkout?tier=${tier}`);
  };
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="page-container">
          <h1>Features & Pricing</h1>

          <section className="intro-section">
            <p>
              Cloud Designs provides comprehensive AI-powered career planning at every stage. Choose the plan that's right for you.
            </p>
          </section>

          {/* PRICING SECTION */}
          <section className="features-pricing-section">
            <h2>Pricing Plans</h2>

            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Free</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">0</span>
                    <span className="period">forever</span>
                  </div>
                </div>

                <div className="pricing-features">
                  <p className="feature-intro">Forever free, no credit card</p>
                  <ul>
                    <li>✓ Full 4-phase career roadmap</li>
                    <li>✓ Complete skill gaps analysis</li>
                    <li>✓ Recommended career paths</li>
                    <li>✓ Personalized timeline</li>
                    <li>✓ Printable PDF roadmap</li>
                    <li>✗ Curated course recommendations</li>
                    <li>✗ Resume optimization</li>
                  </ul>
                </div>
                <Link href="/" className="pricing-button">Get Started Free</Link>
              </div>

              <div className="pricing-card featured">
                <div className="popular-badge">Most Popular</div>
                <div className="pricing-header">
                  <h3>Professional</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">39</span>
                    <span className="period">one-time</span>
                  </div>
                </div>

                <div className="pricing-features">
                  <p className="feature-intro">Detailed roadmap + resources</p>
                  <ul>
                    <li>✓ Everything in Free</li>
                    <li>✓ Curated course links by phase</li>
                    <li>✓ Portfolio project ideas</li>
                    <li>✓ Skills gap prioritized by demand</li>
                    <li>✓ Resume tailoring suggestions</li>
                    <li>✓ Email support</li>
                    <li>✗ AI-powered resume rewrite</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleUpgrade('PROFESSIONAL')}
                  className="pricing-button pricing-button-primary"
                >
                  {session ? 'Upgrade to Professional' : 'Sign In to Upgrade'}
                </button>
              </div>

              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Premium</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">129</span>
                    <span className="period">one-time</span>
                  </div>
                </div>

                <div className="pricing-features">
                  <p className="feature-intro">Complete career transformation</p>
                  <ul>
                    <li>✓ Everything in Professional</li>
                    <li>✓ AI-powered resume rewrite</li>
                    <li>✓ Multiple resume versions</li>
                    <li>✓ LinkedIn profile optimization</li>
                    <li>✓ Specific copy suggestions</li>
                    <li>✓ Certification roadmap by ROI</li>
                    <li>✓ One revision/update (3 months)</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleUpgrade('PREMIUM')}
                  className="pricing-button"
                >
                  {session ? 'Get Premium' : 'Sign In to Upgrade'}
                </button>
              </div>
            </div>
          </section>

          {/* FEATURES BY TIER */}
          <section className="features-section">
            <h2>Features by Tier</h2>

            <div className="features-grid">
              <div className="feature-tier">
                <h3>Free Tier</h3>
                <div className="feature-list">
                  <div className="feature-item">
                    <h4>4-Phase Career Roadmap</h4>
                    <p>Get a personalized 4-phase migration path tailored to your career goals</p>
                  </div>
                  <div className="feature-item">
                    <h4>Complete Skill Gap Analysis</h4>
                    <p>Identify exactly what skills you need to develop for your target role</p>
                  </div>
                  <div className="feature-item">
                    <h4>Personalized Timeline</h4>
                    <p>Realistic month-by-month timeline to complete your career transition</p>
                  </div>
                  <div className="feature-item">
                    <h4>Recommended Career Paths</h4>
                    <p>Explore alternative roles and progression options in your industry</p>
                  </div>
                  <div className="feature-item">
                    <h4>Salary Insights</h4>
                    <p>Market-based salary ranges for your target role and location</p>
                  </div>
                  <div className="feature-item">
                    <h4>Printable PDF Roadmap</h4>
                    <p>Export your personalized roadmap as a PDF for offline reference</p>
                  </div>
                </div>
              </div>

              <div className="feature-tier featured">
                <div className="tier-badge">Most Popular</div>
                <h3>Professional Tier</h3>
                <div className="feature-list">
                  <div className="feature-item">
                    <h4>Everything in Free</h4>
                    <p>All free tier features included</p>
                  </div>
                  <div className="feature-item">
                    <h4>Curated Course Links</h4>
                    <p>Direct links to courses organized by phase on Coursera, Udemy, LinkedIn Learning</p>
                  </div>
                  <div className="feature-item">
                    <h4>Portfolio Project Ideas</h4>
                    <p>Detailed portfolio project ideas to build during your transition</p>
                  </div>
                  <div className="feature-item">
                    <h4>Skills Gap Prioritized</h4>
                    <p>Skills ranked by market demand and salary impact</p>
                  </div>
                  <div className="feature-item">
                    <h4>Resume Tailoring Suggestions</h4>
                    <p>Specific tips for tailoring your resume to your target role</p>
                  </div>
                  <div className="feature-item">
                    <h4>Email Support</h4>
                    <p>Support team ready to help with your career transition questions</p>
                  </div>
                </div>
              </div>

              <div className="feature-tier">
                <h3>Premium Tier</h3>
                <div className="feature-list">
                  <div className="feature-item">
                    <h4>Everything in Professional</h4>
                    <p>All Professional tier features included</p>
                  </div>
                  <div className="feature-item">
                    <h4>AI-Powered Resume Rewrite</h4>
                    <p>Get an AI-optimized resume tailored to your target role</p>
                  </div>
                  <div className="feature-item">
                    <h4>Multiple Resume Versions</h4>
                    <p>Generate multiple resume versions for different job types</p>
                  </div>
                  <div className="feature-item">
                    <h4>LinkedIn Profile Optimization</h4>
                    <p>Specific copy suggestions to optimize your LinkedIn profile</p>
                  </div>
                  <div className="feature-item">
                    <h4>Certification Roadmap by ROI</h4>
                    <p>Recommended certifications ranked by return on investment</p>
                  </div>
                  <div className="feature-item">
                    <h4>One Revision/Update</h4>
                    <p>One revision or update of your roadmap within 3 months</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* COMPARISON TABLE */}
          <section className="comparison-section">
            <h2>Feature Comparison</h2>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Free</th>
                    <th>Professional</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>4-Phase Career Roadmap</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Complete Skill Gap Analysis</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Personalized Timeline</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Recommended Career Paths</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Printable PDF Roadmap</td>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Curated Course Links</td>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Portfolio Project Ideas</td>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Skills Gap Prioritized by Demand</td>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Resume Tailoring Suggestions</td>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>AI-Powered Resume Rewrite</td>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Multiple Resume Versions</td>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>LinkedIn Profile Optimization</td>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>One Revision/Update (3 months)</td>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="pricing-faq">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
              <h3>Is the free tier really free forever?</h3>
              <p>Yes. The free tier gives you access to your complete 4-phase career roadmap, skill gap analysis, and timeline forever. No credit card needed, no limits.</p>
            </div>

            <div className="faq-item">
              <h3>Can I upgrade later?</h3>
              <p>Absolutely. Start with the free tier and upgrade to Professional or Premium anytime. Your roadmap data will be saved.</p>
            </div>

            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>We offer a 30-day money-back guarantee on paid tiers. If you're not satisfied, we'll refund you in full, no questions asked.</p>
            </div>

            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Google Pay. All payments are processed securely.</p>
            </div>
          </section>

          {/* CTA */}
          <section className="pricing-cta">
            <h2>Ready to Transform Your Career?</h2>
            <p>Start your free roadmap generation today. No credit card required.</p>
            <Link href="/" className="cta-button cta-primary">Generate Your Roadmap</Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
