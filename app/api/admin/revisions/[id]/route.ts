/**
 * API Route: PATCH /api/admin/revisions/[id]
 * 
 * Admin endpoint to approve or reject a revision request
 * Only accessible by admin (darec@darecmcdaniel.info)
 * 
 * Request body:
 * - action: "approve" or "reject"
 * - response: Admin's response message
 * 
 * Response:
 * - 200: Successfully updated revision
 * - 400: Validation error
 * - 401: Unauthorized (not logged in)
 * - 403: Forbidden (not an admin)
 * - 404: Revision not found
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { approveRevision, rejectRevision, getRevision } from "@/lib/revision-service"

// Simple admin check
async function isAdmin(userId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return session?.user?.email === "darec@darecmcdaniel.info"
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get revision ID
    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { action, response } = body

    // Validate input
    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        { error: "response is required" },
        { status: 400 }
      )
    }

    // Check if revision exists
    const revision = await getRevision(id)
    if (!revision) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      )
    }

    // Update revision based on action
    let result
    if (action === "approve") {
      result = await approveRevision(id, response)
    } else {
      result = await rejectRevision(id, response)
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update revision" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `Revision ${action}d successfully`,
        action,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating revision:", error)
    return NextResponse.json(
      { error: "Failed to update revision" },
      { status: 500 }
    )
  }
}
