/**
 * Single Roadmap API
 * GET /api/roadmap/[id]
 * Retrieves a specific roadmap by ID with access control
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getRoadmapById } from "@/lib/roadmap-service"
import { authOptions } from "@/lib/auth"
import type { Roadmap } from "@/types/index"

/**
 * GET /api/roadmap/[id]
 * Returns a specific roadmap with parsed content
 *
 * @param req - Next.js request object
 * @param context - Contains params with roadmap id
 * @returns JSON roadmap object or error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in" },
        { status: 401 }
      )
    }

    // Await params - it's a Promise in Next.js 16
    const resolvedParams = await params
    const roadmapId = resolvedParams.id

    console.log("API: Fetching roadmap with ID:", roadmapId)

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      )
    }

    // Fetch roadmap (includes access check - user can only see own)
    const rawRoadmap = await getRoadmapById(roadmapId, session.user.id)

    if (!rawRoadmap) {
      return NextResponse.json(
        { error: "Roadmap not found or access denied" },
        { status: 404 }
      )
    }

    // Parse the content JSON string
    let parsedContent: Roadmap
    try {
      const content = JSON.parse(rawRoadmap.content)
      parsedContent = content as Roadmap
    } catch (parseError) {
      console.error(`Failed to parse roadmap content for ${roadmapId}:`, parseError)
      return NextResponse.json(
        { error: "Invalid roadmap data format" },
        { status: 500 }
      )
    }

    // Return roadmap with parsed content
    return NextResponse.json(
      {
        success: true,
        roadmap: parsedContent,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching roadmap:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch roadmap",
      },
      { status: 500 }
    )
  }
}
