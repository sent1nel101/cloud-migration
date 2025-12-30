'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to process request');
        return;
      }

      setSubmitted(true);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Reset Password</h1>
            <p className="auth-subtitle">Enter your email to receive reset instructions</p>

            {submitted ? (
              <>
                <div className="auth-success">
                  <p>{message}</p>
                  <p>If no email is received within a few minutes, check your spam folder.</p>
                </div>
                <div className="auth-footer">
                  <p>
                    Ready to sign in?{' '}
                    <Link href="/auth/signin" className="auth-link">
                      Back to login
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="auth-button"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <div className="auth-footer">
                  <p>
                    Remember your password?{' '}
                    <Link href="/auth/signin" className="auth-link">
                      Back to login
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="auth-info">
            <h3>Cloud Designs</h3>
            <p>Your AI-powered career migration roadmap</p>
            <ul>
              <li>✓ Personalized career roadmap</li>
              <li>✓ Skill gap analysis</li>
              <li>✓ Resource recommendations</li>
              <li>✓ PDF export</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
