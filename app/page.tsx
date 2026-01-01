/**
 * Home Page (/)
 * 
 * Main landing page for Cloud Designs. Handles the career roadmap generation flow:
 * 1. Show hero + form for first-time visitors
 * 2. Show loading state while generating roadmap
 * 3. Display results + pricing after generation
 * 
 * State Management:
 * - formSubmitted: Whether user has submitted the form
 * - roadmap: The generated AI roadmap data
 * - loading: Whether API call is in progress
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import RoadmapDisplay from "@/components/RoadmapDisplay";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import type { CareerInput, Roadmap } from "@/types/index";

function HomeContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Track whether user has submitted the initial form
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Stores the AI-generated roadmap object
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  // Track API call loading state
  const [loading, setLoading] = useState(false);
  // Store prefill values from URL params
  const [prefillValues, setPrefillValues] = useState<Partial<CareerInput> | undefined>();
  // Ref to form section for scroll-to functionality
  const formSectionRef = React.useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // Extract prefill values from URL params on mount
  useEffect(() => {
    const role = searchParams.get("role");
    const years = searchParams.get("years");
    const goals = searchParams.get("goals");
    const skills = searchParams.get("skills");
    const education = searchParams.get("education");

    if (role || years || goals || skills || education) {
      setPrefillValues({
        currentRole: role || undefined,
        yearsExperience: years ? parseInt(years) : undefined,
        goals: goals || undefined,
        skills: skills ? skills.split(",").map(s => s.trim()) : undefined,
        educationLevel: education || undefined,
      });
    }
  }, [searchParams]);

  /**
   * Scrolls the page to the form section with smooth animation.
   */
  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Submits career input form to /api/roadmap endpoint.
   * Generates AI roadmap and displays results on success.
   * Shows error alert on failure.
   * 
   * @param formData - User's career information
   */
  const handleSubmit = async (formData: CareerInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      // Parse and store the roadmap
      const data = await response.json();
      console.log("=== ROADMAP RESPONSE ===");
      console.log("Full response:", data);
      console.log("Has skill_gaps?", !!data.skill_gaps);
      console.log("Has resource_categories?", !!data.resource_categories);
      console.log("Keys in response:", Object.keys(data));
      setRoadmap(data);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Error details:", errorMsg);
      alert(`Failed to generate roadmap.\n\nError: ${errorMsg}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth status
  if (status === "loading") {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-block",
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              borderBottom: "2px solid var(--primary-color)"
            }}></div>
            <p style={{ marginTop: "1rem" }}>Loading...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      
      {!formSubmitted ? (
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>Migrate Your Career Into AI-Proof Roles</h1>
              <p>
                AI is transforming the job market. Get a personalized roadmap to
                transition into roles that thrive in the age of AI.
              </p>
              <button
                onClick={scrollToForm}
                className="hero-badge"
                style={{
                  cursor: "pointer",
                  border: "2px solid var(--primary-color)",
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary-color)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                  e.currentTarget.style.color = "white";
                }}
              >
                ✓ Free Career Roadmap
              </button>
            </div>
          </section>

          {/* Input Form Section */}
          <section className="form-section" ref={formSectionRef}>
            <div className="container-md">
              <InputForm onSubmit={handleSubmit} loading={loading} initialValues={prefillValues} />
            </div>
          </section>

          {/* Info Section */}
          <section className="info-section">
            <div className="container-md">
              <h2>How It Works</h2>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-card-number">1</div>
                  <h3>Share Your Profile</h3>
                  <p>
                    Tell us about your current role, skills, and career goals.
                    Or upload your resume and let us extract the details automatically.
                  </p>
                </div>
                <div className="info-card">
                  <div className="info-card-number">2</div>
                  <h3>AI Analysis</h3>
                  <p>
                    Our AI analyzes your profile and creates a personalized path.
                  </p>
                </div>
                <div className="info-card">
                  <div className="info-card-number">3</div>
                  <h3>Your Roadmap</h3>
                  <p>
                    Get actionable steps, timelines, and skill recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Resume Upload CTA Section - HIDDEN FOR NOW */}
          {false && <section className="info-section" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(79, 172, 254, 0.05) 100%)" }}>
            <div className="container-md">
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <h2>Fast Track Your Roadmap</h2>
                <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                  Upload your resume to auto-fill your profile details. Skip manual data entry and get your personalized career roadmap in seconds.
                </p>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  Resume upload is available to registered users. Create a free account to get started.
                </p>
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="hero-badge"
                  style={{
                    cursor: "pointer",
                    border: "2px solid var(--primary-color)",
                    background: "var(--primary-color)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </section>}
        </main>
      ) : (
        <main className="main-content" style={{ padding: "1.5rem" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                  borderRadius: "50%",
                  width: "3rem",
                  height: "3rem",
                  borderBottom: "2px solid var(--primary-color)"
                }}></div>
                <p style={{ marginTop: "1rem", fontSize: "1rem" }}>
                  Generating your personalized career roadmap...
                </p>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : roadmap ? (
            <>
              <RoadmapDisplay roadmap={roadmap} />
              <PricingSection />
              <button
                onClick={() => setFormSubmitted(false)}
                className="btn btn-secondary"
                style={{ margin: "2rem auto", display: "block" }}
              >
                Generate Another Roadmap
              </button>
            </>
          ) : null}
        </main>
      )}

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
