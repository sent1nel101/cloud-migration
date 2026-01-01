import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
      <div className="page-container">
      <h1>Terms of Service</h1>

      <div className="legal-notice">
        <p>
          <strong>Last Updated:</strong> December 30, 2024
        </p>
        <p>
          These Terms of Service ("Terms") govern your use of Cloud Designs' website and services (collectively, the "Services"). Cloud Designs is operated by Darec McDaniel as a solo business. By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
        </p>
      </div>

      <section className="policy-section">
        <h2>1. Definitions</h2>

        <ul>
          <li>
            <strong>"Company":</strong> Cloud Designs, operated by Darec McDaniel
          </li>
          <li>
            <strong>"Services":</strong> Our website and AI-powered career roadmap generation service
          </li>
          <li>
            <strong>"User":</strong> You, the person accessing or using our Services
          </li>
          <li>
            <strong>"Content":</strong> Text, images, videos, and other materials in our Services
          </li>
          <li>
            <strong>"User Content":</strong> Information you provide (career data, feedback, messages)
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>2. Use License</h2>

        <p>
          Cloud Designs grants you a limited, non-exclusive, non-transferable license to use our Services for your personal, non-commercial use, subject to these Terms.
        </p>

        <p>
          You may not:
        </p>

        <ul>
          <li>Copy, modify, or create derivative works from our Services</li>
          <li>Reverse-engineer, decompile, or attempt to access source code</li>
          <li>Use our Services for competitive analysis or to build competing products</li>
          <li>Remove copyright notices, trademarks, or proprietary markings</li>
          <li>Use our Services in any illegal or unauthorized manner</li>
          <li>Rent, sell, or transfer your license to others</li>
          <li>Scrape, crawl, or bulk download content without permission</li>
          <li>Use bots, spiders, or automated tools to access Services</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. User Accounts</h2>

        <h3>Account Creation</h3>
        <p>
          To use certain features, you must create an account and provide accurate, current information. You are responsible for:
        </p>

        <ul>
          <li>Maintaining the confidentiality of your password</li>
          <li>Monitoring account activity and reporting unauthorized access</li>
          <li>Keeping your information current and accurate</li>
          <li>All activity under your account</li>
        </ul>

        <h3>Account Eligibility</h3>
        <p>
          You must be at least 13 years old (or the age of digital consent in your jurisdiction) and have the legal authority to enter into these Terms. We reserve the right to refuse service to anyone.
        </p>

        <h3>Account Termination</h3>
        <p>
          You may delete your account anytime by contacting support. We may terminate or suspend your account for:
        </p>

        <ul>
          <li>Violation of these Terms</li>
          <li>Illegal activity or fraud</li>
          <li>Abuse or harassment of our team or other users</li>
          <li>Non-payment (paid accounts)</li>
        </ul>

        <p>
          Upon termination, your access to Services ends, and any outstanding charges become due immediately.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. User Content & Intellectual Property</h2>

        <h3>Your Rights</h3>
        <p>
          You retain all rights to any content you submit (User Content). By submitting User Content, you grant Cloud Designs:
        </p>

        <ul>
          <li>A non-exclusive, royalty-free, worldwide license to use, reproduce, and display your content</li>
          <li>The right to use your content for service improvement and analytics (anonymized)</li>
          <li>The right to display your content to you and service providers</li>
        </ul>

        <h3>Our Intellectual Property</h3>
        <p>
          All content, features, and functionality in our Services (except User Content) are owned by Cloud Designs, including:
        </p>

        <ul>
          <li>Software code and algorithms</li>
          <li>Roadmap templates and recommendations</li>
          <li>Documentation and written content</li>
          <li>AI models and training data</li>
          <li>Logos, trademarks, and branding</li>
        </ul>

        <p>
          These are protected by copyright, trademark, and other intellectual property laws. You may not use them without our explicit permission.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. Acceptable Use Policy</h2>

        <p>
          You agree not to use our Services for:
        </p>

        <ul>
          <li>
            <strong>Illegal activity:</strong> Anything violating federal, state, or local law
          </li>
          <li>
            <strong>Harassment:</strong> Threatening, abusive, or discriminatory content
          </li>
          <li>
            <strong>Fraud:</strong> Misrepresenting your identity or submitting false information
          </li>
          <li>
            <strong>Hacking:</strong> Unauthorized access to systems or accounts
          </li>
          <li>
            <strong>Spam:</strong> Unsolicited commercial messages or abuse of service
          </li>
          <li>
            <strong>Impersonation:</strong> Pretending to be someone else
          </li>
          <li>
            <strong>Privacy violation:</strong> Sharing others' personal information
          </li>
        </ul>

        <p>
          Violations may result in account termination and legal action.
        </p>
      </section>

      <section className="policy-section">
        <h2>5A. Rate Limiting & Abuse Prevention</h2>

        <p>
          To ensure service availability and prevent abuse, Cloud Designs implements rate limiting on our API:
        </p>

        <ul>
          <li>
            <strong>Unauthenticated users:</strong> 5 roadmap generation requests per hour
          </li>
          <li>
            <strong>Authenticated users:</strong> 20 roadmap generation requests per hour
          </li>
          <li>
            <strong>Rate limit enforcement:</strong> Requests exceeding these limits will be rejected with a 429 status code
          </li>
          <li>
            <strong>Limits reset hourly</strong> based on a rolling window
          </li>
        </ul>

        <p>
          These limits are in place to protect service quality for all users and prevent abuse. Attempting to circumvent rate limits (such as through automated scripts or distributed requests) is prohibited.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Fees & Payment</h2>

        <h3>Pricing</h3>
        <p>
          Free tier is free forever with no credit card required. Paid tiers (Professional and Premium) are one-time payments. All prices are in USD. We may change prices for future purchases with 30 days' notice.
        </p>

        <h3>One-Time Payment Terms</h3>
        <ul>
          <li>Professional tier ($39) and Premium tier ($129) are one-time payments</li>
          <li>No recurring charges or auto-renewal</li>
          <li>Paid tiers grant permanent access to enhanced features</li>
        </ul>

        <h3>Refund Policy</h3>
        <p>
          We offer a 30-day refund window with the following structure:
        </p>
        <ul>
          <li><strong>Before Processing (100%):</strong> No work has been done yet</li>
          <li><strong>Technical Error (100%):</strong> Your system failed to deliver</li>
          <li><strong>Content Delivered (0-15%):</strong> We keep the bulk to cover usage and processing fees</li>
        </ul>
        <p>
          To request a refund within 30 days of purchase, email <a href="mailto:support@clouddesigns.com">support@clouddesigns.com</a> with your order details and refund reason. Our team will review your request and arrange the refund accordingly.
        </p>

        <h3>Billing</h3>
        <ul>
          <li>Payment is processed immediately upon upgrade</li>
          <li>Refunds are available within 30 days per our refund policy above</li>
          <li>Failed payments will prevent tier upgrade</li>
          <li>Paid access is permanent (no subscription renewal to manage)</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>7. No Professional Advice</h2>

        <p>
          <strong>THE SERVICES DO NOT CONSTITUTE PROFESSIONAL ADVICE.</strong> Cloud Designs is not a licensed career counselor, employment agency, educational institution, or professional advisor. The information provided through our Services is for general informational purposes only and should not be construed as:
        </p>

        <ul>
          <li>Professional career counseling or employment advice</li>
          <li>Legal, financial, or tax advice</li>
          <li>Educational or academic guidance</li>
          <li>A guarantee or promise of employment, income, or career advancement</li>
        </ul>

        <p>
          You should consult with qualified professionals before making any career, educational, or financial decisions. Cloud Designs expressly disclaims any responsibility for decisions made based on information provided through our Services.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Disclaimers & Limitations</h2>

        <h3>As-Is Services</h3>
        <p>
          Our Services are provided "as is" and "as available" without warranties of any kind, express or implied. Cloud Designs disclaims all warranties including:
        </p>

        <ul>
          <li>Merchantability or fitness for a particular purpose</li>
          <li>Non-infringement of third-party rights</li>
          <li>Accuracy, completeness, or usefulness of content</li>
          <li>Uninterrupted or error-free operation</li>
        </ul>

        <h3>AI Roadmap Disclaimer</h3>
        <p>
          <strong>IMPORTANT:</strong> AI-generated roadmaps are for informational and educational purposes only. They are NOT professional career advice, employment counseling, or guarantees of career success, income, or job placement. Roadmaps are suggestions based on patterns and data that may not reflect current market conditions in your specific location or industry.
        </p>

        <p>Career outcomes depend on many factors beyond our Service, including but not limited to:</p>

        <ul>
          <li>Economic conditions and job market fluctuations</li>
          <li>Your individual skills, effort, and circumstances</li>
          <li>Geographic location and industry demand</li>
          <li>Employer hiring decisions beyond our control</li>
        </ul>

        <p>We strongly recommend:</p>

        <ul>
          <li>Consulting with licensed career counselors or coaches</li>
          <li>Researching actual job market data for your specific location</li>
          <li>Validating all recommendations with industry professionals</li>
          <li>Conducting your own due diligence before making career decisions</li>
        </ul>

        <p>
          <strong>Cloud Designs expressly disclaims all liability for any career decisions, job applications, resignations, educational investments, or financial decisions made in reliance on our roadmaps. You assume full responsibility for all decisions made using our Services.</strong>
        </p>

        <h3>Third-Party Content</h3>
        <p>
          We're not responsible for third-party content, links, or services. We don't endorse external resources and aren't liable for issues arising from them.
        </p>
      </section>

      <section className="policy-section">
        <h2>9. Limitation of Liability</h2>

        <p>
          <strong>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CLOUD DESIGNS, ITS OWNER DAREC MCDANIEL, OR ANY OF ITS AFFILIATES, LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
          </strong>
        </p>

        <ul>
          <li>Loss of revenue, profits, or business</li>
          <li>Loss of anticipated savings</li>
          <li>Loss of data or data corruption</li>
          <li>Loss of goodwill or reputation</li>
          <li>Career outcomes, job loss, or employment decisions</li>
          <li>Educational expenses or course purchases</li>
          <li>Any other pecuniary or non-pecuniary loss</li>
        </ul>

        <p>
          <strong>REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE OR WHETHER CLOUD DESIGNS WAS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</strong>
        </p>

        <p>
          <strong>AGGREGATE LIABILITY CAP:</strong> Our total cumulative liability for any and all claims arising from these Terms or your use of Services shall not exceed the greater of: (a) the amount you actually paid us in the 12 months preceding the claim, or (b) one hundred U.S. dollars ($100.00).
        </p>

        <p>
          <strong>ESSENTIAL PURPOSE:</strong> The limitations set forth in this section shall apply even if any limited remedy fails of its essential purpose.
        </p>

        <p>
          Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations may not apply to you. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.
        </p>
      </section>

      <section className="policy-section">
        <h2>10. Indemnification</h2>

        <p>
          You agree to indemnify, defend, and hold harmless Cloud Designs, its owner Darec McDaniel, and any affiliates, licensors, service providers, employees, agents, officers, and directors (collectively, "Indemnified Parties") from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including but not limited to reasonable attorneys' fees and court costs) arising from or related to:
        </p>

        <ul>
          <li>Your access to or use of our Services</li>
          <li>Your violation of these Terms or any applicable law</li>
          <li>Your User Content or any content you submit, post, or transmit</li>
          <li>Your infringement or misappropriation of any third-party intellectual property, privacy, or other rights</li>
          <li>Any career decisions, job applications, or professional actions taken based on our Services</li>
          <li>Any dispute between you and a third party arising from your use of our Services</li>
        </ul>

        <p>
          This indemnification obligation shall survive the termination of these Terms and your use of our Services.
        </p>
      </section>

      <section className="policy-section">
        <h2>11. Modifications to Terms</h2>

        <p>
          We may modify these Terms anytime. Material changes will be notified by email or prominent website notice. Continued use of Services constitutes acceptance of updated Terms.
        </p>
      </section>

      <section className="policy-section">
        <h2>12. Modifications to Services</h2>

        <p>
          Cloud Designs reserves the right to:
        </p>

        <ul>
          <li>Modify, suspend, or discontinue Services (with notice if possible)</li>
          <li>Change features, functionality, or pricing</li>
          <li>Remove or restrict access to certain features</li>
        </ul>

        <p>
          We're not liable for modifications or discontinuation of Services.
        </p>
      </section>

      <section className="policy-section">
        <h2>13. Dispute Resolution</h2>

        <h3>Informal Resolution</h3>
        <p>
          Before legal action, contact us at <a href="mailto:darec@darecmcdaniel.info">darec@darecmcdaniel.info</a> to resolve the dispute informally.
        </p>

        <h3>Arbitration</h3>
        <p>
          Any dispute arising from these Terms or Services will be resolved by binding arbitration administered by JAMS, not in court. Arbitration rules and procedures apply. Arbitrator's decision is final and binding.
        </p>

        <p>
          <strong>Exception:</strong> Either party may pursue injunctive relief in court to prevent infringement of intellectual property or violation of confidentiality.
        </p>

        <h3>Class Action Waiver</h3>
        <p>
          You waive the right to participate in class actions. All arbitration proceedings and remedies are on an individual basis, not as a class, group, or representative action.
        </p>
      </section>

      <section className="policy-section">
        <h2>14. Governing Law</h2>

        <p>
          These Terms are governed by the laws of California, without regard to conflict of law principles. Arbitration venue is San Francisco, California.
        </p>
      </section>

      <section className="policy-section">
        <h2>15. Severability</h2>

        <p>
          If any provision of these Terms is invalid or unenforceable, the remaining provisions remain in effect. Unenforceable provisions will be modified to the minimum extent necessary to make them enforceable.
        </p>
      </section>

      <section className="policy-section">
        <h2>16. Entire Agreement</h2>

        <p>
          These Terms, together with our Privacy Policy and any other legal notices published by us on the Services, constitute the entire agreement between you and Cloud Designs concerning your use of the Services. These Terms supersede all prior or contemporaneous communications, whether electronic, oral, or written, between you and Cloud Designs.
        </p>
      </section>

      <section className="policy-section">
        <h2>17. Contact Us</h2>

        <p>
          For questions about these Terms, contact us at:
        </p>

        <p>
          <strong>Darec McDaniel</strong>
          <br />
          Email: <a href="mailto:darec@darecmcdaniel.info">darec@darecmcdaniel.info</a>
        </p>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
