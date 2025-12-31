"use client"

import React, { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Roadmap {
  id: string
  title: string
  createdAt: string
  currentRole?: string
  targetRole?: string
  experience?: number
  skills?: string
  goals?: string
  education?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchRoadmaps()
    }
  }, [status, router])

  const fetchRoadmaps = async () => {
    try {
      console.log("Fetching roadmaps from /api/roadmaps")
      const res = await fetch("/api/roadmaps")
      console.log("Fetch response status:", res.status)

      if (!res.ok) {
        const errorData = await res.json()
        console.error("API error:", errorData)
        throw new Error(errorData.error || "Failed to fetch roadmaps")
      }

      const data = await res.json()
      console.log("Roadmaps data received:", data)
      console.log("Number of roadmaps:", Array.isArray(data) ? data.length : data.roadmaps?.length || 0)
      
      const roadmapList = Array.isArray(data) ? data : data.roadmaps || []
      console.log("Roadmaps to display:", roadmapList)
      setRoadmaps(roadmapList)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load roadmaps"
      setError(message)
      console.error("Dashboard error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  const buildPrefillUrl = (roadmap: Roadmap): string => {
    const params = new URLSearchParams()
    
    if (roadmap.currentRole) params.append("role", roadmap.currentRole)
    if (roadmap.experience) params.append("years", roadmap.experience.toString())
    // Include original goals from saved roadmap
    if (roadmap.goals) params.append("goals", roadmap.goals)
    // Include education level if saved
    if (roadmap.education) params.append("education", roadmap.education)
    if (roadmap.skills) {
      try {
        const parsedSkills = JSON.parse(roadmap.skills)
        if (Array.isArray(parsedSkills)) {
          params.append("skills", parsedSkills.join(","))
        }
      } catch (e) {
        // If skills is already a string, use it as-is
        params.append("skills", roadmap.skills)
      }
    }
    
    return `/roadmap-generator?${params.toString()}`
  }

  const handleDelete = async (roadmapId: string, roadmapTitle: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${roadmapTitle}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      const res = await fetch("/api/roadmaps/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete roadmap")
      }

      // Remove from local state
      setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId))
      console.log(`✅ Roadmap deleted: ${roadmapId}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete"
      setError(message)
      console.error("Delete error:", err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (status === "loading") {
    return (
      <>
        <Header />
        <main className="dashboard-page">
          <div className="dashboard-loading">Loading...</div>
        </main>
        <Footer />
      </>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <div className="dashboard-container">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="user-profile">
              <div className="user-avatar">
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3>{session.user?.name || "User"}</h3>
              <p className="user-email">{session.user?.email}</p>
              <div className="user-tier">
                <span
                  className={`tier-badge ${(
                    (session.user as any)?.tier || "FREE"
                  ).toLowerCase()}`}
                >
                  {(session.user as any)?.tier || "FREE"}
                </span>
              </div>
            </div>

            <nav className="dashboard-nav">
              <a href="#roadmaps" className="nav-link active">
                📋 My Roadmaps
              </a>
              {(session.user as any)?.tier === "PREMIUM" && (
                <Link href="/revisions" className="nav-link">
                  ✏️ My Revisions
                </Link>
              )}
              <Link href="/features-pricing" className="nav-link">
                🚀 Upgrade Plan
              </Link>
              <Link href="/roadmap-generator" className="nav-link">
                ➕ New Roadmap
              </Link>
            </nav>

            <button onClick={handleLogout} className="dashboard-logout">
              Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <section className="dashboard-content">
            <h1>My Roadmaps</h1>

            {error && <div className="dashboard-error">{error}</div>}

            {loading ? (
              <div className="dashboard-loading">Loading roadmaps...</div>
            ) : roadmaps.length === 0 ? (
              <div className="dashboard-empty">
                <h2>No roadmaps yet</h2>
                <p>Create your first AI career roadmap to get started</p>
                <Link href="/roadmap-generator" className="empty-button">
                  Generate My First Roadmap
                </Link>
              </div>
            ) : (
              <div className="roadmaps-grid">
                {roadmaps.map((roadmap) => (
                  <div key={roadmap.id} className="roadmap-card">
                    <h3>{roadmap.title || "Untitled Roadmap"}</h3>
                    <div className="roadmap-meta">
                      {roadmap.currentRole && (
                        <div className="meta-item">
                          <span className="meta-label">Current Role:</span>
                          <span className="meta-value">
                            {roadmap.currentRole}
                          </span>
                        </div>
                      )}
                      {roadmap.targetRole && (
                        <div className="meta-item">
                          <span className="meta-label">Target Role:</span>
                          <span className="meta-value">
                            {roadmap.targetRole}
                          </span>
                        </div>
                      )}
                      <div className="meta-item">
                        <span className="meta-label">Created:</span>
                        <span className="meta-value">
                          {formatDate(roadmap.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="roadmap-actions">
                      <Link
                        href={`/roadmap/${roadmap.id}`}
                        className="action-button"
                      >
                        View
                      </Link>
                      <Link
                        href={buildPrefillUrl(roadmap)}
                        className="action-button"
                      >
                        Edit Inputs
                      </Link>
                      <button
                        onClick={() => handleDelete(roadmap.id, roadmap.title || "Roadmap")}
                        className="action-button action-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
