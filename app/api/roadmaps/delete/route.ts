/**
 * DELETE /api/roadmaps/delete
 * Delete a specific roadmap by ID
 * 
 * Request body:
 * - roadmapId: string - The ID of the roadmap to delete
 * 
 * Returns:
 * - success: boolean
 * - message: string
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { roadmapId } = await req.json()

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      )
    }

    // Verify ownership - user can only delete their own roadmaps
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      select: { userId: true },
    })

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      )
    }

    if (roadmap.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - you can only delete your own roadmaps" },
        { status: 403 }
      )
    }

    // Delete the roadmap
    await prisma.roadmap.delete({
      where: { id: roadmapId },
    })

    console.log(`✅ Roadmap ${roadmapId} deleted by user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      message: "Roadmap deleted successfully",
    })
  } catch (error) {
    console.error("Delete roadmap error:", error)
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    )
  }
}
