/**
 * Revision Service - Business logic for Premium tier revision requests
 * 
 * Handles:
 * - Creating revision requests for PREMIUM users only
 * - Enforcing the 1 revision per purchase (3 month expiration)
 * - Checking if user is eligible for revisions
 * - Admin operations (approve, reject, complete)
 * - Expiration checking
 */

import { prisma } from "@/lib/prisma"

/**
 * Check if a user is eligible to request a revision
 * - User must have PREMIUM tier
 * - User cannot have more than 1 active (non-expired) revision request
 * @returns Object with eligible status and reason if not eligible
 */
export async function checkRevisionEligibility(userId: string): Promise<{
  eligible: boolean
  reason?: string
}> {
  try {
    // Check user tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    })

    if (!user) {
      return { eligible: false, reason: "User not found" }
    }

    if (user.tier !== "PREMIUM") {
      return { eligible: false, reason: "Only Premium tier users can request revisions" }
    }

    // Check for active revisions (not expired, not rejected, not completed)
    const activeRevisions = await prisma.revisionRequest.findMany({
      where: {
        userId,
        status: { in: ["PENDING", "APPROVED"] },
        expiresAt: { gt: new Date() },
      },
    })

    if (activeRevisions.length > 0) {
      return { eligible: false, reason: "You already have an active revision request" }
    }

    return { eligible: true }
  } catch (error) {
    console.error("Error checking revision eligibility:", error)
    return { eligible: false, reason: "Error checking eligibility" }
  }
}

/**
 * Create a new revision request
 * Validates eligibility first
 */
export async function createRevisionRequest(
  userId: string,
  roadmapId: string | null,
  originalInput: Record<string, any>,
  reason: string
): Promise<{ success: boolean; revisionId?: string; error?: string }> {
  try {
    // Check eligibility
    const eligibility = await checkRevisionEligibility(userId)
    if (!eligibility.eligible) {
      return { success: false, error: eligibility.reason }
    }

    // Create revision request with 3-month expiration
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 3)

    const revision = await prisma.revisionRequest.create({
      data: {
        userId,
        roadmapId,
        originalInput: JSON.stringify(originalInput),
        reason,
        status: "PENDING",
        expiresAt,
      },
    })

    return { success: true, revisionId: revision.id }
  } catch (error) {
    console.error("Error creating revision request:", error)
    return { success: false, error: "Failed to create revision request" }
  }
}

/**
 * Get user's revision requests (paginated)
 */
export async function getUserRevisions(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<any[]> {
  try {
    const revisions = await prisma.revisionRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    // Add isExpired flag based on current time
    const now = new Date()
    return revisions.map((r: any) => ({
      ...r,
      isExpired: r.expiresAt < now && r.status !== "COMPLETED",
    }))
  } catch (error) {
    console.error("Error getting user revisions:", error)
    return []
  }
}

/**
 * Get all pending revisions for admin
 */
export async function getPendingRevisions(
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  try {
    const revisions = await prisma.revisionRequest.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { requestedAt: "asc" },
      take: limit,
      skip: offset,
    })

    const now = new Date()
    return revisions.map((r: any) => ({
      ...r,
      userName: r.user.name || "Unknown",
      userEmail: r.user.email,
      isExpired: r.expiresAt < now,
    }))
  } catch (error) {
    console.error("Error getting pending revisions:", error)
    return []
  }
}

/**
 * Approve a revision request (admin only)
 */
export async function approveRevision(
  revisionId: string,
  adminResponse: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const revision = await prisma.revisionRequest.update({
      where: { id: revisionId },
      data: {
        status: "APPROVED",
        respondedAt: new Date(),
        adminResponse,
      },
    })

    // Log the approval
    console.log(`Revision ${revisionId} approved for user ${revision.userId}`)

    return { success: true }
  } catch (error) {
    console.error("Error approving revision:", error)
    return { success: false, error: "Failed to approve revision" }
  }
}

/**
 * Reject a revision request (admin only)
 */
export async function rejectRevision(
  revisionId: string,
  adminResponse: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const revision = await prisma.revisionRequest.update({
      where: { id: revisionId },
      data: {
        status: "REJECTED",
        respondedAt: new Date(),
        adminResponse,
      },
    })

    // Log the rejection
    console.log(`Revision ${revisionId} rejected for user ${revision.userId}`)

    return { success: true }
  } catch (error) {
    console.error("Error rejecting revision:", error)
    return { success: false, error: "Failed to reject revision" }
  }
}

/**
 * Mark revision as completed (after work is done)
 */
export async function completeRevision(
  revisionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.revisionRequest.update({
      where: { id: revisionId },
      data: {
        status: "COMPLETED",
      },
    })

    console.log(`Revision ${revisionId} marked as completed`)
    return { success: true }
  } catch (error) {
    console.error("Error completing revision:", error)
    return { success: false, error: "Failed to complete revision" }
  }
}

/**
 * Mark expired revisions (runs periodically or on-demand)
 */
export async function markExpiredRevisions(): Promise<{
  success: boolean
  expiredCount?: number
  error?: string
}> {
  try {
    const now = new Date()
    const result = await prisma.revisionRequest.updateMany({
      where: {
        expiresAt: { lt: now },
        status: { in: ["PENDING", "APPROVED"] },
      },
      data: {
        status: "EXPIRED",
      },
    })

    console.log(`Marked ${result.count} revisions as expired`)
    return { success: true, expiredCount: result.count }
  } catch (error) {
    console.error("Error marking expired revisions:", error)
    return { success: false, error: "Failed to mark expired revisions" }
  }
}

/**
 * Get revision by ID
 */
export async function getRevision(revisionId: string): Promise<any | null> {
  try {
    return await prisma.revisionRequest.findUnique({
      where: { id: revisionId },
    })
  } catch (error) {
    console.error("Error getting revision:", error)
    return null
  }
}

/**
 * Verify user owns the revision (for security)
 */
export async function userOwnsRevision(
  userId: string,
  revisionId: string
): Promise<boolean> {
  try {
    const revision = await prisma.revisionRequest.findUnique({
      where: { id: revisionId },
      select: { userId: true },
    })

    return revision?.userId === userId
  } catch (error) {
    console.error("Error verifying revision ownership:", error)
    return false
  }
}
