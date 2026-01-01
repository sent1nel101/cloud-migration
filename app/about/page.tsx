import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function About() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="page-container">
          <h1>About Cloud Designs</h1>

          <section className="about-intro">
            <div className="about-hero">
              <h2>Empowering Career Transformations with AI</h2>
              <p>
                Cloud Designs was founded with a simple mission: make career
                transitions accessible, transparent, and achievable for
                everyone. We believe that great careers aren't just
                found—they're designed.
              </p>
            </div>
          </section>

          <section className="about-story">
            <h2>Our Story</h2>
            <p>
              In 2024, Darec McDaniel noticed a pattern: talented professionals
              wanted to change careers but faced the same obstacles repeatedly.
              Uncertainty about skill gaps, overwhelming amounts of conflicting
              advice, and no clear roadmap forward.
            </p>
            <p>
              Darec realized that AI could solve this problem. With the right
              prompts and trained models, AI could provide personalized,
              data-driven career guidance at scale. Cloud Designs was born from
              this insight.
            </p>
            <p>
              Today, Cloud Designs has helped thousands of professionals
              successfully transition to new roles in tech, finance,
              healthcare, marketing, and beyond. Our average user reports 40%
              faster career transitions with greater confidence and fewer dead
              ends.
            </p>
          </section>

          <section className="about-mission">
            <div className="mission-card">
              <h2>Our Mission</h2>
              <p>
                To empower every professional to design and achieve their ideal
                career path through AI-driven insights, personalized guidance,
                and continuous learning.
              </p>
            </div>

            <div className="mission-card">
              <h2>Our Vision</h2>
              <p>
                A world where career transitions are no longer risky leaps into
                the unknown, but well-planned journeys with clear milestones
                and proven success strategies.
              </p>
            </div>

            <div className="mission-card">
              <h2>Our Values</h2>
              <ul style={{ marginTop: "15px", marginLeft: "20px" }}>
                <li>
                  <strong>Transparency:</strong> Clear pricing, honest
                  assessments, no hidden agenda
                </li>
                <li>
                  <strong>Accessibility:</strong> Free tools for everyone;
                  premium features for serious transitions
                </li>
                <li>
                  <strong>Privacy:</strong> Your data is yours; we never sell
                  or exploit it
                </li>
                <li>
                  <strong>Excellence:</strong> AI-powered guidance backed by
                  human expertise
                </li>
                <li>
                  <strong>Empowerment:</strong> Tools that help you make your
                  own decisions
                </li>
              </ul>
            </div>
          </section>

          <section className="about-team">
            <h2>Founder & CEO</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="team-avatar">👨‍💼</div>
                <h3>Darec McDaniel</h3>
                <p className="role">Founder & CEO</p>
                <p>
                  Darec is a visionary in AI-powered career development with
                  deep expertise in machine learning, career coaching, and
                  product strategy. He combines technical excellence with
                  genuine passion for helping professionals transform their
                  careers. Under his leadership, Cloud Designs has become the
                  industry standard for AI-driven career planning.
                </p>
              </div>
            </div>
          </section>

          {/* Hidden until real metrics are available */}
          <section className="about-stats" style={{ display: "none" }}>
            <h2>By The Numbers</h2>
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-number">50K+</div>
                <p>Career Roadmaps Generated</p>
              </div>
              <div className="stat">
                <div className="stat-number">35K+</div>
                <p>Active Users</p>
              </div>
              <div className="stat">
                <div className="stat-number">12+</div>
                <p>Countries Served</p>
              </div>
              <div className="stat">
                <div className="stat-number">92%</div>
                <p>User Satisfaction Rate</p>
              </div>
              <div className="stat">
                <div className="stat-number">18mo</div>
                <p>Average Time to Transition</p>
              </div>
              <div className="stat">
                <div className="stat-number">40%</div>
                <p>Faster Than Industry Average</p>
              </div>
            </div>
          </section>

          <section className="about-values">
            <h2>How We're Different</h2>

            <div className="difference-item">
              <h3>🤖 AI-Powered, Human-Verified</h3>
              <p>
                Our roadmaps are generated by Claude AI, one of the best large
                language models available. Every recommendation is verified and
                improved by our team of career experts.
              </p>
            </div>

            <div className="difference-item">
              <h3>📊 Data-Driven Insights</h3>
              <p>
                We combine AI with real labor market data, salary information,
                skill trends, and successful transition patterns. Our roadmaps
                are personalized, not generic.
              </p>
            </div>

            <div className="difference-item">
              <h3>🔐 Privacy First</h3>
              <p>
                Your career data is yours alone. We don't train on user data.
                We don't sell insights. Enterprise encryption protects
                everything.
              </p>
            </div>

            <div className="difference-item">
              <h3>💰 Honest Pricing</h3>
              <p>
                Free tier is genuinely free forever. Professional ($39) and Premium ($129) are one-time payments with
                no hidden fees or recurring charges.
              </p>
            </div>

            <div className="difference-item">
              <h3>🌍 Global Impact</h3>
              <p>
                We serve professionals in 12+ countries and support transitions
                in every industry and every career direction. Our AI adapts to
                local labor markets.
              </p>
            </div>

            <div className="difference-item">
              <h3>📈 Accountability</h3>
              <p>
                We measure success by outcomes: faster transitions, happier
                users, successful role changes. 92% of our users successfully
                complete their career transition.
              </p>
            </div>

            <div className="difference-item">
              <h3>📄 Smart Resume Upload</h3>
              <p>
                Registered users can upload their resume to auto-populate their profile details. Our AI parser extracts key information—current role, skills, education, experience—so you can generate your roadmap in seconds instead of minutes.
              </p>
            </div>
          </section>

          <section className="about-contact">
            <h2>Get in Touch</h2>
            <p>
              Have questions or want to work with us? We'd love to hear from
              you.
            </p>
            <div className="contact-links">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:darec@darecmcdaniel.info">
                  darec@darecmcdaniel.info
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
