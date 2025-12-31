"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ParsedResumeData } from "@/lib/resume-parser"
import { CareerInput } from "@/types"

interface ResumeReviewPageProps {}

export default function ResumeReviewPage() {
  const { status } = useSession()
  const router = useRouter()
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null)
  const [formData, setFormData] = useState<Partial<CareerInput>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  // Required fields for roadmap generation
  const REQUIRED_FIELDS: (keyof CareerInput)[] = ["currentRole", "yearsExperience", "goals"]

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Load parsed resume data from session storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("parsedResumeData")
      console.log("[RESUME REVIEW] SessionStorage data:", stored ? "found" : "not found")
      
      if (stored) {
        const data: ParsedResumeData = JSON.parse(stored)
        console.log("[RESUME REVIEW] Parsed data:", data)
        setParsedData(data)
        // Initialize form with parsed data
        setFormData({
          currentRole: data.currentRole || "",
          yearsExperience: data.yearsExperience || 0,
          skills: data.skills || [],
          goals: data.goals || "",
          educationLevel: data.educationLevel || "",
        })
      } else {
        // No parsed data - redirect back to upload
        console.log("[RESUME REVIEW] No parsed data found, redirecting to /resume-upload")
        router.push("/resume-upload")
      }
    } catch (error) {
      console.error("[RESUME REVIEW] Error loading parsed data:", error)
      router.push("/resume-upload")
    }
  }, [router])

  if (status === "loading" || !parsedData) {
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

  // Validate required fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.currentRole || formData.currentRole.trim() === "") {
      newErrors.currentRole = "Current role is required"
    }

    if (!formData.yearsExperience || formData.yearsExperience <= 0) {
      newErrors.yearsExperience = "Years of experience must be greater than 0"
    }

    if (!formData.goals || formData.goals.trim() === "") {
      newErrors.goals = "Career goals are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Navigate to roadmap generator with prefilled data
      // Use param names that roadmap-generator expects: role, years, education
      const params = new URLSearchParams({
        role: formData.currentRole || "",
        years: String(formData.yearsExperience || 0),
        skills: (formData.skills || []).join(","),
        goals: formData.goals || "",
        education: formData.educationLevel || "",
      })

      router.push(`/roadmap-generator?${params.toString()}`)
    } catch (error) {
      console.error("Error navigating to roadmap generator:", error)
      setErrors({ form: "Failed to proceed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof CareerInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle skills array updates
  const handleSkillsChange = (skills: string[]) => {
    handleInputChange("skills", skills)
  }

  const isMissingRequired = (field: keyof CareerInput): boolean => {
    return REQUIRED_FIELDS.includes(field) && (
      formData[field] === undefined ||
      formData[field] === null ||
      formData[field] === "" ||
      (typeof formData[field] === "number" && formData[field] === 0) ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    )
  }

  return (
    <>
      <Header />
      <main className="main-content" style={{ padding: "2rem 1rem" }}>
        <div className="container-md" style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Hero Section */}
          <section style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1>Review Your Resume</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              We've extracted information from your resume. Review and update any fields below.
            </p>
          </section>

          {/* Error Message */}
          {errors.form && (
            <div style={{
              padding: "1rem",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "6px",
              color: "#ef4444",
              marginBottom: "2rem",
            }}>
              {errors.form}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Current Role */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: isMissingRequired("currentRole") ? "#ef4444" : "var(--text-primary)",
              }}>
                Current Job Title {isMissingRequired("currentRole") && <span style={{ color: "#ef4444" }}>*</span>}
              </label>
              <input
                type="text"
                value={formData.currentRole || ""}
                onChange={(e) => handleInputChange("currentRole", e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: errors.currentRole ? "2px solid #ef4444" : "1px solid var(--border-color)",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                }}
              />
              {isMissingRequired("currentRole") && !errors.currentRole && (
                <p style={{ fontSize: "0.85rem", color: "#fbbf24", marginTop: "0.25rem" }}>⚠️ Missing required field</p>
              )}
              {errors.currentRole && (
                <p style={{ fontSize: "0.85rem", color: "#ef4444", marginTop: "0.25rem" }}>{errors.currentRole}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: isMissingRequired("yearsExperience") ? "#ef4444" : "var(--text-primary)",
              }}>
                Years of Experience {isMissingRequired("yearsExperience") && <span style={{ color: "#ef4444" }}>*</span>}
              </label>
              <input
                type="number"
                min="0"
                max="70"
                value={formData.yearsExperience || ""}
                onChange={(e) => handleInputChange("yearsExperience", parseInt(e.target.value) || 0)}
                placeholder="e.g., 5"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: errors.yearsExperience ? "2px solid #ef4444" : "1px solid var(--border-color)",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                }}
              />
              {isMissingRequired("yearsExperience") && !errors.yearsExperience && (
                <p style={{ fontSize: "0.85rem", color: "#fbbf24", marginTop: "0.25rem" }}>⚠️ Missing required field</p>
              )}
              {errors.yearsExperience && (
                <p style={{ fontSize: "0.85rem", color: "#ef4444", marginTop: "0.25rem" }}>{errors.yearsExperience}</p>
              )}
            </div>

            {/* Career Goals */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: isMissingRequired("goals") ? "#ef4444" : "var(--text-primary)",
              }}>
                Career Goals {isMissingRequired("goals") && <span style={{ color: "#ef4444" }}>*</span>}
              </label>
              <textarea
                value={formData.goals || ""}
                onChange={(e) => handleInputChange("goals", e.target.value)}
                placeholder="e.g., Transition to data science, focus on machine learning applications"
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: errors.goals ? "2px solid #ef4444" : "1px solid var(--border-color)",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              />
              {isMissingRequired("goals") && !errors.goals && (
                <p style={{ fontSize: "0.85rem", color: "#fbbf24", marginTop: "0.25rem" }}>⚠️ Missing required field</p>
              )}
              {errors.goals && (
                <p style={{ fontSize: "0.85rem", color: "#ef4444", marginTop: "0.25rem" }}>{errors.goals}</p>
              )}
            </div>

            {/* Skills */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Key Skills (Optional)
              </label>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Enter skills separated by commas
              </p>
              <textarea
                value={(formData.skills || []).join(", ")}
                onChange={(e) => {
                  const skills = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                  handleSkillsChange(skills)
                }}
                placeholder="e.g., Python, Machine Learning, SQL, Data Analysis"
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              />
              {formData.skills && formData.skills.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  {formData.skills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        background: "var(--primary-color)",
                        color: "white",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "4px",
                        marginRight: "0.5rem",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillsChange(formData.skills!.filter((_, idx) => idx !== i))}
                        style={{
                          marginLeft: "0.4rem",
                          background: "none",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Education Level */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Education Level (Optional)
              </label>
              <select
                value={formData.educationLevel || ""}
                onChange={(e) => handleInputChange("educationLevel", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                <option value="">Select education level</option>
                <option value="High School">High School</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Self-taught">Self-taught</option>
              </select>
            </div>

            {/* Status Section */}
            <div style={{
              padding: "1.5rem",
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Status</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                <span style={{
                  color: isMissingRequired("currentRole") || isMissingRequired("yearsExperience") || isMissingRequired("goals")
                    ? "#ef4444"
                    : "#22c55e",
                }}>
                  {isMissingRequired("currentRole") || isMissingRequired("yearsExperience") || isMissingRequired("goals")
                    ? "⚠️ Please fill in all required fields"
                    : "✓ Ready to generate roadmap"}
                </span>
              </p>
            </div>

            {/* Button Group */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => router.push("/resume-upload")}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                Upload Different Resume
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading || isMissingRequired("currentRole") || isMissingRequired("yearsExperience") || isMissingRequired("goals")}
              >
                {loading ? "Processing..." : "Generate Roadmap"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
