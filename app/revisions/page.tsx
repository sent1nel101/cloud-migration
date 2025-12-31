/**
 * User Revisions Page - /app/revisions/page.tsx
 * 
 * Premium tier users can view and request roadmap revisions here
 * Features:
 * - View existing revision requests
 * - Create new revision request (1 active at a time)
 * - Track revision status (PENDING, APPROVED, REJECTED, COMPLETED, EXPIRED)
 * - See expiration dates
 */

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface RevisionRequest {
  id: string
  status: string
  requestedAt: string
  expiresAt: string
  reason: string
  adminResponse?: string
  isExpired: boolean
}

export default function RevisionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [revisions, setRevisions] = useState<RevisionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    roadmapId: "",
    reason: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Redirect non-premium users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.tier !== "PREMIUM") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  // Load revisions
  useEffect(() => {
    if (status === "authenticated") {
      loadRevisions()
    }
  }, [status])

  async function loadRevisions() {
    try {
      setLoading(true)
      setError("")
      const response = await fetch("/api/revisions/my-revisions")
      const data = await response.json()

      if (response.ok) {
        setRevisions(data.revisions || [])
      } else {
        setError(data.error || "Failed to load revisions")
      }
    } catch (err) {
      console.error("Error loading revisions:", err)
      setError("Failed to load revisions")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.reason.trim()) {
      setError("Please provide a reason for your revision")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const response = await fetch("/api/revisions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: formData.roadmapId || null,
          originalInput: {}, // Could be pre-filled from last roadmap
          reason: formData.reason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Reset form and reload revisions
        setFormData({ roadmapId: "", reason: "" })
        setShowForm(false)
        await loadRevisions()
      } else {
        setError(data.error || "Failed to submit revision request")
      }
    } catch (err) {
      console.error("Error submitting revision:", err)
      setError("Failed to submit revision request")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.tier !== "PREMIUM") {
    return null
  }

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    APPROVED: "#10b981",
    REJECTED: "#ef4444",
    COMPLETED: "#06b6d4",
    EXPIRED: "#6b7280",
  }

  const hasActiveRevision = revisions.some(
    (r) => ["PENDING", "APPROVED"].includes(r.status) && !r.isExpired
  )

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        My Revision Requests
      </h1>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "0.5rem",
            color: "#991b1b",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {/* New Revision Form */}
      {!hasActiveRevision && (
        <div style={{ marginBottom: "2rem" }}>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              Request a New Revision
            </button>
          ) : (
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "0.5rem",
                border: "2px solid var(--primary-color)",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
                Request a Revision
              </h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                As a Premium member, you get one free revision within 3 months of purchase. This is a great way to
                update your roadmap based on new goals or changes in your situation.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    What would you like to revise?
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="e.g., I'd like to update my goals based on recent changes..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.375rem",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "1rem",
                      minHeight: "150px",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "var(--primary-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: submitting ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      opacity: submitting ? 0.6 : 1,
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Revision Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Revisions List */}
      {revisions.length > 0 ? (
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
            Your Revisions ({revisions.length})
          </h2>
          {revisions.map((revision) => (
            <div
              key={revision.id}
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "0.5rem",
                border: `2px solid ${statusColors[revision.status]}`,
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Status:{" "}
                    <span style={{ color: statusColors[revision.status], fontWeight: "bold" }}>
                      {revision.status}
                    </span>
                  </h3>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                    Requested: {new Date(revision.requestedAt).toLocaleDateString()}
                    {!revision.isExpired && (
                      <>
                        {" "}
                        • Expires: {new Date(revision.expiresAt).toLocaleDateString()}
                      </>
                    )}
                    {revision.isExpired && <span style={{ color: "#ef4444" }}> • EXPIRED</span>}
                  </p>
                  <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    <strong>Your Request:</strong> {revision.reason}
                  </p>
                  {revision.adminResponse && (
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.75rem", fontStyle: "italic" }}>
                      <strong>Admin Response:</strong> {revision.adminResponse}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "2rem",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "0.5rem",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          <p>You haven't requested any revisions yet.</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            As a Premium member, you get one free revision within 3 months of your purchase.
          </p>
        </div>
      )}

      {hasActiveRevision && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#dbeafe",
            border: "1px solid #93c5fd",
            borderRadius: "0.5rem",
            color: "#1e40af",
            marginTop: "1.5rem",
          }}
        >
          <strong>Note:</strong> You already have an active revision request. You can request another revision once
          this one is completed or expires.
        </div>
      )}
    </div>
  )
}
