/**
 * API Route: POST /api/revisions/request
 * 
 * Creates a new revision request for Premium tier users
 * Validates that user is Premium tier and doesn't already have an active revision
 * 
 * Request body:
 * - roadmapId (optional): ID of roadmap to revise
 * - originalInput: Original career input object
 * - reason: Reason for revision request
 * 
 * Response:
 * - 201: Successfully created revision request
 * - 400: Validation error or user not eligible
 * - 401: Unauthorized (not logged in)
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createRevisionRequest } from "@/lib/revision-service"

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { roadmapId, originalInput, reason } = body

    // Validate input
    if (!originalInput) {
      return NextResponse.json(
        { error: "originalInput is required" },
        { status: 400 }
      )
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "reason is required" },
        { status: 400 }
      )
    }

    if (reason.length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed reason (at least 10 characters)" },
        { status: 400 }
      )
    }

    // Create revision request
    const result = await createRevisionRequest(
      session.user.id,
      roadmapId || null,
      originalInput,
      reason
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create revision request" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        revisionId: result.revisionId,
        message: "Revision request submitted successfully. You'll receive an email within 2-3 business days.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating revision request:", error)
    return NextResponse.json(
      { error: "Failed to create revision request" },
      { status: 500 }
    )
  }
}
