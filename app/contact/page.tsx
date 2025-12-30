"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send this to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", company: "", subject: "", message: "", type: "general" });
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
      <div className="page-container">
      <h1>Get in Touch</h1>

      <section className="contact-intro">
        <p>
          Have questions? Want to discuss Enterprise? Found a bug? We'd love to hear from you. Average response time: 24 hours.
        </p>
      </section>

      <div className="contact-grid">
        <section className="contact-form-section">
          <h2>Send us a Message</h2>

          {submitted && (
            <div className="success-message">
              ✓ Thanks for reaching out! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Inquiry Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="general">General Question</option>
                <option value="sales">Sales / Enterprise</option>
                <option value="support">Support / Bug Report</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more..."
                rows={6}
              />
            </div>

            <button type="submit" className="cta-button">Send Message</button>
          </form>
        </section>

        <section className="contact-info-section">
          <h2>Other Ways to Reach Us</h2>

          <div className="contact-method">
            <h3>📧 Email</h3>
            <p>
              <strong>Contact:</strong>{" "}
              <a href="mailto:darec@darecmcdaniel.info">darec@darecmcdaniel.info</a>
            </p>
          </div>

          <div className="contact-method">
            <h3>💬 Live Chat</h3>
            <p>
              Questions? Start a live chat on our website. Available Monday-Friday, 9 AM - 6 PM EST.
            </p>
          </div>

          <div className="contact-method">
            <h3>📱 Social Media</h3>
            <p>
              Find us on{" "}
              <a href="https://twitter.com/clouddesigns" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              ,{" "}
              <a href="https://linkedin.com/company/clouddesigns" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              , and{" "}
              <a href="https://instagram.com/clouddesigns" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              .
            </p>
          </div>

          <div className="contact-method">
            <h3>🎓 Onboarding Call</h3>
            <p>
              Want to see how Cloud Designs works? Schedule a free 30-min walkthrough with our team.
            </p>
            <button className="schedule-button">Schedule a Call</button>
          </div>

          <div className="contact-method">
            <h3>🐛 Report a Bug</h3>
            <p>
              Found an issue? Help us improve by reporting it. Include browser, device, and steps to reproduce.
            </p>
            <a href="mailto:darec@darecmcdaniel.info" className="link-button">
              Report Bug
            </a>
          </div>
        </section>
      </div>

      <section className="contact-faq">
        <h2>Quick Answers</h2>
        <div className="qa-grid">
          <div className="qa-item">
            <h3>How quickly will I hear back?</h3>
            <p>
              Typically within 24 hours on business days.
            </p>
          </div>
          <div className="qa-item">
            <h3>Do you have a phone number?</h3>
            <p>
              Email is the best way to reach us at darec@darecmcdaniel.info.
            </p>
          </div>
          <div className="qa-item">
            <h3>Where are you located?</h3>
            <p>Cloud Designs is run by Darec McDaniel.</p>
          </div>
          <div className="qa-item">
            <h3>Are you hiring?</h3>
            <p>
              Yes! Check our <a href="/careers">careers page</a> for open positions in engineering, product, and more.
            </p>
          </div>
        </div>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
