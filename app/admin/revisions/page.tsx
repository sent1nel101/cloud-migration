/**
 * Admin Revisions Dashboard - /app/admin/revisions/page.tsx
 * 
 * Admin-only page to manage revision requests
 * Features:
 * - View all pending revisions
 * - Approve/reject revisions
 * - Track revision status
 * - Admin notes
 * 
 * Note: Currently restricted to darec@darecmcdaniel.info
 */

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface RevisionRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  status: string
  requestedAt: string
  reason: string
  isExpired: boolean
  adminResponse?: string
}

export default function AdminRevisionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [revisions, setRevisions] = useState<RevisionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRevision, setSelectedRevision] = useState<string | null>(null)
  const [adminResponse, setAdminResponse] = useState("")
  const [processing, setProcessing] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.email !== "darec@darecmcdaniel.info") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  // Load pending revisions
  useEffect(() => {
    if (session?.user?.email === "darec@darecmcdaniel.info") {
      loadRevisions()
    }
  }, [session])

  async function loadRevisions() {
    try {
      setLoading(true)
      setError("")
      const response = await fetch("/api/admin/revisions")
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

  async function handleApprove() {
    if (!selectedRevision || !adminResponse.trim()) {
      alert("Please provide a response message")
      return
    }

    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/revisions/${selectedRevision}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          response: adminResponse,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAdminResponse("")
        setSelectedRevision(null)
        await loadRevisions()
      } else {
        alert(data.error || "Failed to approve revision")
      }
    } catch (err) {
      console.error("Error approving revision:", err)
      alert("Failed to approve revision")
    } finally {
      setProcessing(false)
    }
  }

  async function handleReject() {
    if (!selectedRevision || !adminResponse.trim()) {
      alert("Please provide a response message")
      return
    }

    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/revisions/${selectedRevision}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          response: adminResponse,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAdminResponse("")
        setSelectedRevision(null)
        await loadRevisions()
      } else {
        alert(data.error || "Failed to reject revision")
      }
    } catch (err) {
      console.error("Error rejecting revision:", err)
      alert("Failed to reject revision")
    } finally {
      setProcessing(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.email !== "darec@darecmcdaniel.info") {
    return null
  }

  const selectedData = revisions.find((r) => r.id === selectedRevision)

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Admin: Revision Requests
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Revisions List */}
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
            Pending Revisions ({revisions.length})
          </h2>

          {revisions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {revisions.map((revision) => (
                <div
                  key={revision.id}
                  onClick={() => setSelectedRevision(revision.id)}
                  style={{
                    padding: "1rem",
                    backgroundColor:
                      selectedRevision === revision.id
                        ? "var(--primary-color)"
                        : "var(--bg-secondary)",
                    color:
                      selectedRevision === revision.id
                        ? "white"
                        : "var(--text-primary)",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    border:
                      selectedRevision === revision.id
                        ? `2px solid var(--primary-color)`
                        : "1px solid var(--border-color)",
                  }}
                >
                  <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                    {revision.userName}
                  </h3>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.5rem" }}>
                    {revision.userEmail}
                  </p>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                    {revision.reason.substring(0, 100)}
                    {revision.reason.length > 100 ? "..." : ""}
                  </p>
                  <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.5rem" }}>
                    {new Date(revision.requestedAt).toLocaleDateString()}
                  </p>
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
              <p>No pending revisions</p>
            </div>
          )}
        </div>

        {/* Response Form */}
        <div>
          {selectedData ? (
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "0.5rem",
                border: "2px solid var(--primary-color)",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
                Review Request
              </h2>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  User
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  {selectedData.userName} ({selectedData.userEmail})
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Request Date
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  {new Date(selectedData.requestedAt).toLocaleString()}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Their Request
                </h3>
                <p
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--bg-primary)",
                    borderRadius: "0.375rem",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedData.reason}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Your Response
                </label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Provide feedback or next steps..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.375rem",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "1rem",
                    minHeight: "100px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: processing ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    opacity: processing ? 0.6 : 1,
                  }}
                >
                  {processing ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: processing ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    opacity: processing ? 0.6 : 1,
                  }}
                >
                  {processing ? "Processing..." : "Reject"}
                </button>
              </div>
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
              <p>Select a revision to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
