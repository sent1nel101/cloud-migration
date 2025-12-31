/**
 * API Route: GET /api/revisions/my-revisions
 * 
 * Gets the current user's revision requests with pagination
 * 
 * Query params:
 * - limit: Number of results per page (default: 10, max: 100)
 * - offset: Number of results to skip (default: 0)
 * 
 * Response:
 * - 200: Array of revision requests with pagination info
 * - 401: Unauthorized (not logged in)
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserRevisions } from "@/lib/revision-service"

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "10"),
      100
    )
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get user revisions
    const revisions = await getUserRevisions(session.user.id, limit, offset)

    return NextResponse.json(
      {
        success: true,
        revisions,
        count: revisions.length,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching user revisions:", error)
    return NextResponse.json(
      { error: "Failed to fetch revisions" },
      { status: 500 }
    )
  }
}
