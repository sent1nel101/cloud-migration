"use client"

import { useState, useEffect, Suspense } from "react"
import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Header from "@/components/Header"
import InputForm from "@/components/InputForm"
import RoadmapDisplay from "@/components/RoadmapDisplay"
import PricingSection from "@/components/PricingSection"
import Footer from "@/components/Footer"
import type { CareerInput, Roadmap } from "@/types/index"

function RoadmapGeneratorContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [prefillValues, setPrefillValues] = useState<Partial<CareerInput> | undefined>()
  const [saveLoading, setSaveLoading] = useState(false)
  const formSectionRef = React.useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  // Redirect unauthenticated users to signin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Extract prefill values from URL params
  useEffect(() => {
    const role = searchParams.get("role")
    const years = searchParams.get("years")
    const goals = searchParams.get("goals")
    const skills = searchParams.get("skills")
    const education = searchParams.get("education")

    if (role || years || goals || skills || education) {
      setPrefillValues({
        currentRole: role || undefined,
        yearsExperience: years ? parseInt(years) : undefined,
        goals: goals || undefined,
        skills: skills ? skills.split(",").map(s => s.trim()) : undefined,
        educationLevel: education || undefined,
      })
      // Scroll to form if prefilling
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [searchParams])

  const handleSubmit = async (formData: CareerInput) => {
    setLoading(true)
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate roadmap")
      }

      const data = await response.json()
      setRoadmap(data)
      setFormSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      alert(`Failed to generate roadmap.\n\nError: ${errorMsg}\n\nCheck console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRoadmap = async () => {
    if (!roadmap) return

    setSaveLoading(true)
    try {
      // Note: The roadmap is already saved when generated
      // Just navigate back to dashboard to see it
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving roadmap:", error)
      alert("Failed to save roadmap. Please try again.")
    } finally {
      setSaveLoading(false)
    }
  }

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
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="app-container">
      <Header />
      
      {!formSubmitted ? (
        <main className="main-content">
          <section className="hero">
            <div className="hero-content">
              <h1>Generate a New Roadmap</h1>
              <p>Create another personalized career roadmap to explore different opportunities.</p>
            </div>
          </section>

          <section className="form-section" ref={formSectionRef}>
            <div className="container-md">
              <InputForm onSubmit={handleSubmit} loading={loading} initialValues={prefillValues} />
            </div>
          </section>
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
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", margin: "2rem 0" }}>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="btn btn-secondary"
                >
                  Generate Another Roadmap
                </button>
                <button
                  onClick={handleSaveRoadmap}
                  disabled={saveLoading}
                  className="btn btn-primary"
                  style={{ opacity: saveLoading ? 0.6 : 1, cursor: saveLoading ? "not-allowed" : "pointer" }}
                >
                  {saveLoading ? "Saving..." : "Save This Roadmap"}
                </button>
              </div>
            </>
          ) : null}
        </main>
      )}

      <Footer />
    </div>
  )
}

export default function RoadmapGenerator() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoadmapGeneratorContent />
    </Suspense>
  )
}
