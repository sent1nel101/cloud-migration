/**
 * Header Component
 *
 * Displays responsive navigation bar with logo, main navigation links, and theme toggle.
 * Persists theme preference to localStorage for consistent experience across sessions.
 *
 * Features:
 * - Responsive navigation (hamburger menu on mobile, full nav on desktop)
 * - Light/dark mode toggle with localStorage persistence
 * - Links to all main pages and legal documents
 * - Mobile-optimized with collapsible navigation
 */

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Header() {
  // Theme state - persists to localStorage
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  // Track component mount status (prevents hydration mismatches)
  const [mounted, setMounted] = useState(false)
  // Track mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Get session for auth state
  const { data: session } = useSession()

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") || "dark") as
      | "light"
      | "dark"
    setTheme(savedTheme)
    setMounted(true)
  }, [])

  /**
   * Toggles between light and dark theme.
   * Updates DOM attribute and localStorage for persistence.
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  /**
   * Closes mobile menu when a link is clicked
   */
  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <a href="/">Chart Your Path</a>
        </div>

        {/* Main navigation - hidden on mobile unless menu is open */}
        <nav className={`header-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <a href="/" onClick={handleNavClick}>
            Home
          </a>
          <a href="/features-pricing" onClick={handleNavClick}>
            Features & Pricing
          </a>
          <a href="/about" onClick={handleNavClick}>
            About
          </a>
          <a href="/blog" onClick={handleNavClick}>
            Blog
          </a>
          <a href="/faq" onClick={handleNavClick}>
            FAQ
          </a>
          <a href="/contact" onClick={handleNavClick}>
            Contact
          </a>

          {/* Auth links */}
          {!session ? (
            <>
              <Link
                href="/auth/signin"
                className="nav-auth-link"
                onClick={handleNavClick}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="nav-auth-signup"
                onClick={handleNavClick}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/resume-upload"
                className="nav-upload-link"
                onClick={handleNavClick}
              >
                Upload Resume
              </Link>
              <Link
                href="/dashboard"
                className="nav-dashboard-link"
                onClick={handleNavClick}
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* Theme toggle button - always visible, outside hamburger menu */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Hamburger menu button - visible on mobile */}
        <button
          className="header-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
