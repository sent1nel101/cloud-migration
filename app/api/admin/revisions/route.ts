/**
 * API Route: GET /api/admin/revisions
 * 
 * Gets all pending revisions for admin review
 * Only accessible by PREMIUM tier users (admin check can be enhanced)
 * 
 * Query params:
 * - limit: Number of results per page (default: 50, max: 200)
 * - offset: Number of results to skip (default: 0)
 * 
 * Response:
 * - 200: Array of pending revision requests
 * - 401: Unauthorized (not logged in)
 * - 403: Forbidden (not an admin)
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPendingRevisions } from "@/lib/revision-service"

// Simple admin check - can be enhanced with a proper admin role
async function isAdmin(userId: string): Promise<boolean> {
  // For now: only the account owner (darec@darecmcdaniel.info) can be admin
  // In production, use a proper admin role in the database
  const session = await getServerSession(authOptions)
  return session?.user?.email === "darec@darecmcdaniel.info"
}

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

    // Check if user is admin
    const admin = await isAdmin(session.user.id)
    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden - admin access required" },
        { status: 403 }
      )
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "50"),
      200
    )
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get pending revisions
    const revisions = await getPendingRevisions(limit, offset)

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
    console.error("Error fetching admin revisions:", error)
    return NextResponse.json(
      { error: "Failed to fetch revisions" },
      { status: 500 }
    )
  }
}
