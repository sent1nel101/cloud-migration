import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
      <div className="page-container">
      <h1>Privacy Policy</h1>

      <div className="legal-notice">
        <p>
          <strong>Last Updated:</strong> December 29, 2024
        </p>
        <p>
          This Privacy Policy explains how Cloud Designs ("Company," "we," "us," or "our") collects, uses, discloses, and otherwise processes your personal information through our website, mobile applications, and related services (collectively, the "Services").
        </p>
      </div>

      <section className="policy-section">
        <h2>1. Information We Collect</h2>

        <h3>Information You Provide Directly</h3>
        <ul>
          <li>
            <strong>Account Information:</strong> When you create an account, we collect your name, email address, password, and company information.
          </li>
          <li>
            <strong>Career Information:</strong> When you use our Services, we collect information about your current role, target role, skills, experience, goals, and constraints.
          </li>
          <li>
            <strong>Communication:</strong> When you contact us via email, chat, or other means, we collect the content of your communications.
          </li>
          <li>
            <strong>Payment Information:</strong> For paid subscriptions, we collect billing address, payment method, and transaction history (processed securely by Stripe).
          </li>
        </ul>

        <h3>Information Collected Automatically</h3>
        <ul>
          <li>
            <strong>Usage Information:</strong> Pages visited, features used, roadmaps generated, time spent, clicks, and interactions.
          </li>
          <li>
            <strong>Device Information:</strong> Device type, operating system, browser, IP address, and unique identifiers.
          </li>
          <li>
            <strong>Location Information:</strong> Approximate location based on IP address (city/region level, not precise).
          </li>
          <li>
            <strong>Cookies & Similar Technologies:</strong> We use cookies, pixels, and local storage for authentication, preferences, and analytics.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>2. How We Use Your Information</h2>

        <p>We use the information we collect to:</p>

        <ul>
          <li>Provide, maintain, and improve our Services</li>
          <li>Generate personalized career roadmaps and recommendations</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send service-related announcements and support communications</li>
          <li>Respond to your inquiries and customer support requests</li>
          <li>Analyze usage patterns to improve user experience</li>
          <li>Detect, prevent, and address fraud, abuse, and security issues</li>
          <li>Comply with legal obligations</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Conduct research and analytics (anonymized)</li>
        </ul>

        <p>
          <strong>Important:</strong> We do NOT use your personal career data to train our AI models without explicit opt-in consent. Your data remains private.
        </p>
      </section>

      <section className="policy-section">
        <h2>3. How We Share Your Information</h2>

        <p>We may share your information with:</p>

        <ul>
          <li>
            <strong>Service Providers:</strong> Payment processors (Stripe), email services, hosting providers, analytics services. All bound by confidentiality agreements.
          </li>
          <li>
            <strong>Business Partners:</strong> For Enterprise customers, with HR/HRIS integrations you explicitly authorize.
          </li>
          <li>
            <strong>Legal Requirements:</strong> If required by law, court order, or government request.
          </li>
          <li>
            <strong>Business Transactions:</strong> In case of merger, acquisition, or sale of assets (with notice).
          </li>
        </ul>

        <p>
          <strong>We do NOT sell your personal information to third parties for marketing purposes.</strong>
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Data Security</h2>

        <p>We implement industry-standard security measures including:</p>

        <ul>
          <li>AES 256-bit encryption for data at rest</li>
          <li>TLS 1.2+ encryption for data in transit</li>
          <li>Secure password hashing with bcrypt</li>
          <li>Regular security audits and penetration testing</li>
          <li>Access controls and authentication requirements</li>
          <li>Intrusion detection and monitoring</li>
          <li>Employee privacy training and NDAs</li>
        </ul>

        <p>
          However, no method of transmission over the internet is 100% secure. While we take reasonable precautions, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. Your Privacy Rights</h2>

        <p>Depending on your location, you may have the following rights:</p>

        <h3>GDPR (EU/EEA Residents)</h3>
        <ul>
          <li>Right of access: Request a copy of your personal data</li>
          <li>Right to correction: Request we fix inaccurate information</li>
          <li>Right to erasure: Request deletion of your data ("right to be forgotten")</li>
          <li>Right to restrict processing: Limit how we use your data</li>
          <li>Right to data portability: Receive data in portable format</li>
          <li>Right to object: Object to certain processing activities</li>
          <li>Right to lodge a complaint: Contact your data protection authority</li>
        </ul>

        <h3>CCPA (California Residents)</h3>
        <ul>
          <li>Right to know: Request what personal information we have</li>
          <li>Right to delete: Request deletion of your information</li>
          <li>Right to opt-out: Opt out of data sales (we don't sell, but you can opt-out)</li>
          <li>Right to non-discrimination: Non-discrimination for exercising rights</li>
        </ul>

        <h3>For All Users</h3>
        <ul>
          <li>Account settings: Manage your privacy preferences anytime</li>
          <li>Opt-out of marketing: Unsubscribe from emails anytime</li>
          <li>Download your data: Export roadmaps and account data</li>
          <li>Delete your account: Permanently delete your account and data</li>
        </ul>

        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:darec@darecmcdaniel.info">darec@darecmcdaniel.info</a>.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Cookies & Tracking</h2>

        <p>We use cookies for:</p>

        <ul>
          <li>
            <strong>Authentication:</strong> Keeping you logged in
          </li>
          <li>
            <strong>Preferences:</strong> Remembering your theme (light/dark), language, settings
          </li>
          <li>
            <strong>Analytics:</strong> Understanding how users interact with our service (Google Analytics)
          </li>
          <li>
            <strong>Security:</strong> Preventing fraud and detecting abuse
          </li>
        </ul>

        <p>
          Most browsers allow you to control cookies through settings. You can also use "Do Not Track" signals, though we don't respond to DNT headers (but respect your cookie preferences).
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Data Retention</h2>

        <p>
          We retain personal information for as long as necessary to provide Services and fulfill the purposes outlined in this policy. Specifically:
        </p>

        <ul>
          <li>
            <strong>Active Accounts:</strong> Kept for the duration of your subscription
          </li>
          <li>
            <strong>Deleted Accounts:</strong> Data deleted within 30 days (some data may persist in backups for 90 days)
          </li>
          <li>
            <strong>Marketing Data:</strong> Retained until you unsubscribe
          </li>
          <li>
            <strong>Legal/Compliance:</strong> Retained as required by law
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>8. Children's Privacy</h2>

        <p>
          Our Services are not intended for children under 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect information from children under 13. If we learn we have collected such information, we will delete it promptly. If you believe a child has provided us information, please contact us at <a href="mailto:privacy@clouddesigns.ai">privacy@clouddesigns.ai</a>.
        </p>
      </section>

      <section className="policy-section">
        <h2>9. International Data Transfers</h2>

        <p>
          Cloud Designs is based in the United States. Your information may be transferred to, stored in, and processed in the United States or other countries where we operate. These countries may not have the same data protection laws as your home country.
        </p>

        <p>
          By using our Services, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection rules.
        </p>
      </section>

      <section className="policy-section">
        <h2>10. Third-Party Links</h2>

        <p>
          Our Services may contain links to third-party websites (courses, resources, job boards). We're not responsible for their privacy practices. Please review their privacy policies before sharing information.
        </p>
      </section>

      <section className="policy-section">
        <h2>11. Policy Updates</h2>

        <p>
          We may update this Privacy Policy periodically. We'll notify you of material changes by email or prominent notice on our website. Continued use of our Services constitutes acceptance of updated policies.
        </p>
      </section>

      <section className="policy-section">
        <h2>12. Contact Us</h2>

        <p>For privacy-related questions or to exercise your rights:</p>

        <p>
          <strong>Darec McDaniel</strong>
          <br />
          Email: <a href="mailto:darec@darecmcdaniel.info">darec@darecmcdaniel.info</a>
        </p>

        <p>
          We'll respond to all privacy requests within 30 days (or as required by law).
        </p>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
