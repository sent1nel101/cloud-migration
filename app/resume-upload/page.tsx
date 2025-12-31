"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ResumeUploadForm from "@/components/ResumeUploadForm"

export default function ResumeUploadPage() {
  const { status } = useSession()
  const router = useRouter()

  // Redirect unauthenticated users to signin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <>
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
        <Footer />
      </>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <>
      <Header />
      <main className="main-content" style={{ padding: "2rem 1rem" }}>
        <div className="container-md" style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Hero Section */}
          <section style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1>Upload Your Resume</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Upload your resume and we'll automatically extract your career information
              to generate your personalized roadmap.
            </p>
          </section>

          {/* Upload Form */}
          <ResumeUploadForm />

          {/* Info Section */}
          <section style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h3 style={{ marginTop: 0 }}>What we extract:</h3>
            <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
              <li>Current job title</li>
              <li>Years of experience</li>
              <li>Key skills</li>
              <li>Education level</li>
              <li>Contact information</li>
              <li>Professional summary</li>
            </ul>
          </section>

          {/* Tips Section */}
          <section style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h3 style={{ marginTop: 0 }}>Tips for best results:</h3>
            <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
              <li>Use a well-formatted resume</li>
              <li>Include clear section headers (Experience, Education, Skills)</li>
              <li>List your most recent job first</li>
              <li>Include specific job titles and dates</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
