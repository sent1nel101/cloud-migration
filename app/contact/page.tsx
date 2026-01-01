"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BugReportForm from "@/components/BugReportForm";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bugReportOpen, setBugReportOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", subject: "", message: "", type: "general" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
      <div className="page-container">
      <h1>Get in Touch</h1>

      <section className="contact-intro">
        <p>
          Have questions? Want to discuss Enterprise? Found a bug? We'd love to hear from you. Response time: typically within 2-3 business days.
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

          {error && (
            <div className="error-message">
              ✗ {error}
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

            <button type="submit" className="cta-button" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        <section className="contact-info-section">
          <h2>Other Ways to Reach Us</h2>

          <div className="contact-method">
            <h3>📧 Email</h3>
            <p>
              <strong>Contact:</strong>{" "}
              <a href="mailto:contact@darecmcdaniel.info">contact@darecmcdaniel.info</a>
            </p>
          </div>

          <div className="contact-method">
            <h3>🐛 Report a Bug</h3>
            <p>
              Found an issue? Help us improve by reporting it. We'll automatically detect your browser and the time of the report.
            </p>
            <button 
              className="link-button"
              onClick={() => setBugReportOpen(true)}
              aria-label="Report a bug"
            >
              Report Bug
            </button>
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
              Email is the best way to reach us at contact@darecmcdaniel.info.
            </p>
          </div>
          <div className="qa-item">
            <h3>Where are you located?</h3>
            <p>Cloud Designs is run by Darec McDaniel.</p>
          </div>
          <div className="qa-item">
            <h3>Do you offer live chat support?</h3>
            <p>
              For efficiency and faster responses, we handle all inquiries via email. Email us anytime at contact@darecmcdaniel.info.
            </p>
          </div>
        </div>
      </section>
      </div>
      </main>
      <BugReportForm isOpen={bugReportOpen} onClose={() => setBugReportOpen(false)} />
      <Footer />
    </div>
  );
}
