"use client";

import { useState, useEffect } from "react";

interface BugReportData {
  browser: string;
  errorMessage: string;
  datetime: string;
  userComments: string;
}

interface BugReportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BugReportForm({ isOpen, onClose }: BugReportFormProps) {
  const [formData, setFormData] = useState<BugReportData>({
    browser: "",
    errorMessage: "",
    datetime: "",
    userComments: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-detect browser info on mount
  useEffect(() => {
    if (isOpen) {
      const browserInfo = getBrowserInfo();
      const currentTime = new Date().toISOString();
      setFormData((prev) => ({
        ...prev,
        browser: browserInfo,
        datetime: currentTime,
      }));
      setError("");
      setSubmitted(false);
    }
  }, [isOpen]);

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome") && !ua.includes("Chromium")) {
      return "Chrome";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      return "Safari";
    } else if (ua.includes("Firefox")) {
      return "Firefox";
    } else if (ua.includes("Edg")) {
      return "Edge";
    } else if (ua.includes("OPR")) {
      return "Opera";
    } else {
      return "Other";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch("/api/bug-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit bug report");
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setFormData({
          browser: getBrowserInfo(),
          errorMessage: "",
          datetime: new Date().toISOString(),
          userComments: "",
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report a Bug</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="modal-body">
            <div className="success-message">
              ✓ Thank you! Bug report submitted. We'll investigate this shortly.
            </div>
          </div>
        ) : (
          <div className="modal-body">
            {error && (
              <div className="error-message">
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bug-report-form">
              <div className="form-group">
                <label htmlFor="browser">Browser Type</label>
                <input
                  type="text"
                  id="browser"
                  name="browser"
                  value={formData.browser}
                  onChange={handleChange}
                  placeholder="Auto-detected"
                />
                <small>We auto-detected your browser. You can modify if needed.</small>
              </div>

              <div className="form-group">
                <label htmlFor="errorMessage">Error Message</label>
                <textarea
                  id="errorMessage"
                  name="errorMessage"
                  value={formData.errorMessage}
                  onChange={handleChange}
                  placeholder="Copy and paste any error message you see (optional)"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="datetime">Date & Time</label>
                <input
                  type="text"
                  id="datetime"
                  name="datetime"
                  value={new Date(formData.datetime).toLocaleString()}
                  readOnly
                  disabled
                />
                <small>Time when the bug was reported</small>
              </div>

              <div className="form-group">
                <label htmlFor="userComments">What were you doing?</label>
                <textarea
                  id="userComments"
                  name="userComments"
                  value={formData.userComments}
                  onChange={handleChange}
                  placeholder="Describe what you were doing when you encountered the bug (optional)"
                  rows={4}
                />
                <small>Any details help us fix it faster!</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="cta-button" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Bug Report"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
