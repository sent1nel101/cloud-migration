"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import RoadmapDisplay from "@/components/RoadmapDisplay"
import type { Roadmap } from "@/types/index"

export default function RoadmapDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  
  // Handle the fact that params might be a Promise in some Next.js versions
  const [roadmapId, setRoadmapId] = useState<string | null>(null)

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resolve params asynchronously
  useEffect(() => {
    if (params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      setRoadmapId(id)
    }
  }, [params])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated" && roadmapId) {
      fetchRoadmap()
    }
  }, [status, roadmapId, router])

  const fetchRoadmap = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching roadmap with ID:", roadmapId)

      if (!roadmapId) {
        throw new Error("Roadmap ID is required")
      }

      const res = await fetch(`/api/roadmap/${roadmapId}`)
      console.log("API response status:", res.status)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(
          errorData.error || `Failed to load roadmap (${res.status})`
        )
      }

      const data = await res.json()
      console.log("Roadmap data received:", data)
      setRoadmap(data.roadmap || data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load roadmap"
      setError(message)
      console.error("Error fetching roadmap:", err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || !roadmapId) {
    return (
      <>
        <Header />
        <main className="roadmap-detail-page">
          <div className="roadmap-detail-loading">Loading...</div>
        </main>
        <Footer />
      </>
    )
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="roadmap-detail-page">
          <div className="roadmap-detail-loading">Loading roadmap...</div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="roadmap-detail-page">
          <div className="roadmap-detail-error">
            <h2>Error</h2>
            <p>{error}</p>
            <Link href="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!roadmap) {
    return (
      <>
        <Header />
        <main className="roadmap-detail-page">
          <div className="roadmap-detail-empty">
            <h2>Roadmap not found</h2>
            <p>The roadmap you're looking for doesn't exist or has been deleted.</p>
            <Link href="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="roadmap-detail-page">
        <div className="roadmap-detail-container">
          {/* Navigation Bar */}
          <div className="roadmap-detail-nav">
            <Link href="/dashboard" className="nav-back">
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => window.print()}
              className="nav-print btn btn-secondary"
            >
              Print / Save as PDF
            </button>
          </div>

          {/* Roadmap Content */}
          <RoadmapDisplay roadmap={roadmap} />
        </div>
      </main>
      <Footer />
    </>
  )
}
