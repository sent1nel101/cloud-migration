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
            <h3>What does the Professional tier include?</h3>
            <p>Professional ($39 one-time) includes curated course links by phase, portfolio project ideas, skills prioritized by market demand, and resume tailoring suggestions.</p>
          </div>

          <div className="faq-item">
            <h3>What does the Premium tier include?</h3>
            <p>Premium ($59 one-time) includes everything in Professional, plus AI-powered resume rewrite, multiple resume versions, LinkedIn profile optimization, and certification roadmap ranked by ROI.</p>
          </div>

          <div className="faq-item">
            <h3>What if I'm not satisfied?</h3>
            <p>We offer a 30-day money-back guarantee. If you upgrade to Professional or Premium and aren't satisfied for any reason, we'll refund you 100% with no questions asked. Just email contact@darecmcdaniel.info.</p>
          </div>

          <div className="faq-item">
            <h3>Are these one-time payments or recurring?</h3>
            <p>One-time payments. Professional ($39) and Premium ($59) are charged once and give you permanent access to those features. No recurring charges or subscriptions.</p>
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
            <p>Create an account to save multiple roadmaps to your dashboard. Logged-in users can save unlimited roadmaps and regenerate them anytime.</p>
          </div>

          <div className="faq-item">
            <h3>Can I generate multiple roadmaps?</h3>
            <p>Yes. Create an account and generate as many roadmaps as you want to explore different career paths and compare options.</p>
          </div>

          <div className="faq-item">
            <h3>Does Cloud Designs recommend specific courses?</h3>
            <p>Free tier includes general course suggestions. Professional and Premium tiers include curated course links to real courses on Coursera, Udemy, LinkedIn Learning, and other platforms, organized by phase.</p>
          </div>

          <div className="faq-item">
            <h3>Can I print or download my roadmap?</h3>
            <p>Yes. All users can download roadmaps as PDF files for offline reference and printing.</p>
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
            <p>Email contact@darecmcdaniel.info with any questions or issues. I aim to respond within 2-3 business days.</p>
          </div>

          <div className="faq-item">
            <h3>What if the AI roadmap doesn't match my goals?</h3>
            <p>You can generate new roadmaps with different inputs to explore alternative paths. Try adjusting your target role, skills, or timeline.</p>
          </div>

          <div className="faq-item">
            <h3>Is there a rate limit on roadmap generation?</h3>
            <p>Yes, to prevent abuse and ensure quality service for everyone: unauthenticated users get 5 requests per hour, authenticated users get 20 per hour. Limits reset hourly.</p>
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
          <h2>Account & Security</h2>

          <div className="faq-item">
            <h3>How is my data secured?</h3>
            <p>We use enterprise-grade encryption for data in transit and at rest. Your password is hashed with bcryptjs. All data is stored securely on Supabase PostgreSQL.</p>
          </div>

          <div className="faq-item">
            <h3>Can I delete my account?</h3>
            <p>Yes. You can delete your account anytime from your dashboard settings. All your data will be removed from our servers.</p>
          </div>

          <div className="faq-item">
            <h3>Is Cloud Designs free to use?</h3>
            <p>Yes. The Free tier is completely free forever. Professional ($39) and Premium ($59) are optional for advanced features. No credit card needed for Free tier.</p>
          </div>
        </div>
      </section>

      <section className="faq-contact">
        <h2>Still have questions?</h2>
        <p>
          Can't find the answer you're looking for? Email us at{' '}
          <a href="mailto:contact@darecmcdaniel.info">contact@darecmcdaniel.info</a>.
        </p>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
