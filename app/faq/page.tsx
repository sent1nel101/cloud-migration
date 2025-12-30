import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQ() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
      <div className="page-container">
      <h1>Frequently Asked Questions</h1>

      <section className="faq-intro">
        <p>
          Find answers to common questions about Cloud Designs and our AI-powered career planning platform.
        </p>
      </section>

      <section className="faq-sections">
        <div className="faq-section">
          <h2>Getting Started</h2>

          <div className="faq-item">
            <h3>How do I get started?</h3>
            <p>Simply fill out the quick form on our home page with information about your current role, target role, skills, and experience. Our AI will generate a personalized 4-phase roadmap in under 60 seconds.</p>
          </div>

          <div className="faq-item">
            <h3>Do I need to create an account?</h3>
            <p>You can generate one free roadmap without creating an account. To save multiple roadmaps and access Pro features, you'll need a free Cloud Designs account.</p>
          </div>

          <div className="faq-item">
            <h3>What information do I need to provide?</h3>
            <p>
              We ask for:
              <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                <li>Your current job title and years of experience</li>
                <li>Your target role</li>
                <li>Current skills and certifications</li>
                <li>Career goals and timeline preferences</li>
                <li>Any constraints (budget, location, time availability)</li>
              </ul>
            </p>
          </div>

          <div className="faq-item">
            <h3>How accurate are the roadmaps?</h3>
            <p>Our roadmaps are generated using Claude AI, trained on thousands of successful career transitions. They're highly personalized but should be used as a guide. We recommend consulting with mentors and industry professionals for specific advice.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Pricing & Billing</h2>

          <div className="faq-item">
            <h3>Is the free tier really free?</h3>
            <p>Yes, completely free. You can generate one AI roadmap and access all basic features forever without paying. No credit card required, no hidden fees.</p>
          </div>

          <div className="faq-item">
            <h3>What does the Pro tier include?</h3>
            <p>Pro includes real course links, detailed portfolio projects, resume optimization, AI career coaching, multiple roadmaps, priority support, and an ad-free experience for $29/month.</p>
          </div>

          <div className="faq-item">
            <h3>Can I try Pro before paying?</h3>
            <p>Yes. All new users get a 14-day free trial of Pro features. No credit card required. If you don't upgrade, your account simply reverts to Free.</p>
          </div>

          <div className="faq-item">
            <h3>What's the Enterprise plan?</h3>
            <p>Enterprise is designed for organizations managing career development for multiple employees. It includes team management, advanced analytics, API access, custom training, SSO, and dedicated support. Pricing is custom based on team size.</p>
          </div>

          <div className="faq-item">
            <h3>Do you offer discounts for annual billing?</h3>
            <p>Yes. Pro annual billing (paying yearly instead of monthly) includes a 16% discount. Contact our sales team for Enterprise annual pricing.</p>
          </div>

          <div className="faq-item">
            <h3>What if I'm not satisfied?</h3>
            <p>We offer a 30-day money-back guarantee. If you upgrade to Pro and aren't satisfied for any reason, we'll refund you 100% with no questions asked.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Features & Capabilities</h2>

          <div className="faq-item">
            <h3>How does the AI roadmap generation work?</h3>
            <p>
              We use Claude AI with a specialized career advisor prompt. The AI:
              <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                <li>Analyzes your background and target role</li>
                <li>Creates a 4-phase transition plan with timelines</li>
                <li>Identifies skill gaps you need to fill</li>
                <li>Recommends relevant courses and certifications</li>
                <li>Provides salary insights and market data</li>
              </ul>
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I save my roadmap?</h3>
            <p>Free users can export their roadmap as PDF. Pro users can save unlimited roadmaps to their account and access them anytime.</p>
          </div>

          <div className="faq-item">
            <h3>Can I generate multiple roadmaps?</h3>
            <p>Free tier: one roadmap. Pro tier: unlimited roadmaps. You can explore different career paths and compare options.</p>
          </div>

          <div className="faq-item">
            <h3>Does Cloud Designs recommend specific courses?</h3>
            <p>The Free tier includes general course categories. Pro users get direct links to actual courses on Coursera, Udemy, LinkedIn Learning, A Cloud Guru, and other platforms.</p>
          </div>

          <div className="faq-item">
            <h3>Can I print or download my roadmap?</h3>
            <p>Yes. All users can download roadmaps as PDF files. Pro users also get additional export formats and can embed roadmaps on personal websites.</p>
          </div>

          <div className="faq-item">
            <h3>What is the AI Career Coach feature?</h3>
            <p>Pro users get monthly consultations with our AI-powered career advisors. You can ask specific questions about your transition, get resume reviews, and receive personalized guidance.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Data & Privacy</h2>

          <div className="faq-item">
            <h3>Is my data secure?</h3>
            <p>Yes. We use enterprise-grade encryption, secure servers, and follow all GDPR and privacy best practices. Your data is never shared with third parties.</p>
          </div>

          <div className="faq-item">
            <h3>What data do you collect?</h3>
            <p>We collect only the information you provide (job titles, skills, career goals) plus basic usage analytics. We don't track browsing history or sell data.</p>
          </div>

          <div className="faq-item">
            <h3>Can I delete my account?</h3>
            <p>Yes. You can delete your account anytime. All your data will be permanently removed within 30 days.</p>
          </div>

          <div className="faq-item">
            <h3>Does Cloud Designs use my data to train AI models?</h3>
            <p>No. Your data is private and never used for model training unless you explicitly opt in. See our Privacy Policy for details.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Support & Troubleshooting</h2>

          <div className="faq-item">
            <h3>How do I get help?</h3>
            <p>Email support@clouddesigns.ai with any questions. Free users get standard support (3-5 days). Pro users get priority support (24 hours). Enterprise customers have 24/7 phone support.</p>
          </div>

          <div className="faq-item">
            <h3>What if the AI roadmap doesn't match my goals?</h3>
            <p>You can generate new roadmaps with different inputs. Pro users can request personalized modifications from our career advisors through the AI Coach feature.</p>
          </div>

          <div className="faq-item">
            <h3>Is there a roadmap for [specific role transition]?</h3>
            <p>Cloud Designs handles any career transition - tech, finance, healthcare, marketing, sales, and more. Our AI adapts to any source and target role.</p>
          </div>

          <div className="faq-item">
            <h3>Can I use Cloud Designs for career exploration?</h3>
            <p>Absolutely. Many users generate multiple roadmaps to explore different career paths before deciding on a target role.</p>
          </div>

          <div className="faq-item">
            <h3>What browsers does Cloud Designs support?</h3>
            <p>Cloud Designs works on all modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). It's fully mobile-responsive.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Enterprise & Integration</h2>

          <div className="faq-item">
            <h3>Can my company use Cloud Designs for employee development?</h3>
            <p>Yes. Our Enterprise plan is designed for HR teams and organizations. You can manage multiple employees, track progress, and generate team reports.</p>
          </div>

          <div className="faq-item">
            <h3>Do you offer API access?</h3>
            <p>Yes. Enterprise customers get API access to integrate Cloud Designs with their HR systems, HRIS platforms, or custom applications.</p>
          </div>

          <div className="faq-item">
            <h3>Can you customize the roadmap content for my company?</h3>
            <p>Yes. Enterprise customers can customize skills, roles, and recommendations based on their company's needs. We can also train custom AI models.</p>
          </div>

          <div className="faq-item">
            <h3>What kind of SLA does Enterprise include?</h3>
            <p>Enterprise customers get a 99.9% uptime SLA, dedicated account manager, 1-hour response times, and 24/7 phone support.</p>
          </div>
        </div>
      </section>

      <section className="faq-contact">
        <h2>Still have questions?</h2>
        <p>
          Can't find the answer you're looking for? Email us at{' '}
          <a href="mailto:darec@darecmcdaniel.info">darec@darecmcdaniel.info</a>.
        </p>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
