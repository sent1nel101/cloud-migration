import Link from "next/link";

export default function Features() {
  return (
    <div className="page-container">
      <h1>Features</h1>

      <section className="features-intro">
        <p>
          Cloud Designs provides comprehensive AI-powered career planning and migration tools. Our platform helps professionals transition to new roles with confidence.
        </p>
      </section>

      <section className="features-grid">
        <div className="feature-tier">
          <h2>Free Tier</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>AI Career Roadmap</h3>
              <p>Get a personalized 4-phase migration path tailored to your career goals</p>
            </div>
            <div className="feature-item">
              <h3>Skill Gap Analysis</h3>
              <p>Identify exactly what skills you need to develop for your target role</p>
            </div>
            <div className="feature-item">
              <h3>Timeline Estimates</h3>
              <p>Realistic month-by-month timeline to complete your career transition</p>
            </div>
            <div className="feature-item">
              <h3>Resource Categories</h3>
              <p>Curated lists of courses, certifications, and communities to learn from</p>
            </div>
            <div className="feature-item">
              <h3>Salary Insights</h3>
              <p>Market-based salary ranges for your target role and location</p>
            </div>
            <div className="feature-item">
              <h3>Printable Roadmap</h3>
              <p>Export your personalized roadmap as a PDF for offline reference</p>
            </div>
          </div>
          <Link href="/" className="cta-button">Get Started Free</Link>
        </div>

        <div className="feature-tier featured">
          <div className="tier-badge">Most Popular</div>
          <h2>Pro Tier</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>Everything in Free</h3>
              <p>All free tier features included</p>
            </div>
            <div className="feature-item">
              <h3>Real Course Links</h3>
              <p>Direct links to actual courses on Coursera, Udemy, LinkedIn Learning</p>
            </div>
            <div className="feature-item">
              <h3>Portfolio Projects</h3>
              <p>Detailed portfolio project ideas to build during your transition</p>
            </div>
            <div className="feature-item">
              <h3>AI Career Coach</h3>
              <p>Monthly consultation calls with AI-powered career advisors</p>
            </div>
            <div className="feature-item">
              <h3>Resume Template</h3>
              <p>Download optimized resume templates for your target role</p>
            </div>
            <div className="feature-item">
              <h3>Priority Support</h3>
              <p>Email support with 24-hour response time</p>
            </div>
            <div className="feature-item">
              <h3>Multiple Roadmaps</h3>
              <p>Create and manage multiple career roadmaps</p>
            </div>
          </div>
          <Link href="/pricing" className="cta-button cta-primary">Get Pro</Link>
        </div>

        <div className="feature-tier">
          <h2>Enterprise</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>Everything in Pro</h3>
              <p>All Pro tier features included</p>
            </div>
            <div className="feature-item">
              <h3>Team Management</h3>
              <p>Manage career development for multiple team members</p>
            </div>
            <div className="feature-item">
              <h3>Custom Reports</h3>
              <p>Advanced analytics and team progress tracking</p>
            </div>
            <div className="feature-item">
              <h3>Integration APIs</h3>
              <p>API access for custom integrations with HR systems</p>
            </div>
            <div className="feature-item">
              <h3>Dedicated Account Manager</h3>
              <p>Personal account manager for your organization</p>
            </div>
            <div className="feature-item">
              <h3>Custom AI Training</h3>
              <p>AI models trained on your company's specific needs</p>
            </div>
            <div className="feature-item">
              <h3>SLA & Priority Support</h3>
              <p>99.9% uptime SLA with 1-hour response time</p>
            </div>
          </div>
          <Link href="/#contact" className="cta-button">Contact Sales</Link>
        </div>
      </section>

      <section className="comparison-section">
        <h2>Feature Comparison</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Pro</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AI Roadmap Generation</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Skill Gap Analysis</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Real Course Links</td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Portfolio Projects</td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>AI Career Coach</td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Multiple Roadmaps</td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Team Management</td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Integration APIs</td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Dedicated Support</td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
