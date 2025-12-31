/**
 * Roadmap Service
 * Handles roadmap database operations and access control
 */

import { prisma } from "@/lib/prisma"

/**
 * Save a generated roadmap to the database
 * @param userId - User ID who created the roadmap
 * @param data - Roadmap data (currentRole, targetRole, experience, skills, goals, education)
 * @param content - Generated roadmap content (JSON string)
 * @param title - Optional title for the roadmap
 * @returns Saved roadmap object
 */
export async function saveRoadmap(
  userId: string,
  data: {
    currentRole: string
    targetRole: string
    experience: number
    skills: string[] // Array of skills
    goals?: string // Original career goals from user input
    education?: string // Education level/background
  },
  content: string,
  title?: string
) {
  // Verify user exists before saving roadmap
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  })

  if (!user) {
    console.error(
      `Roadmap save failed: User ${userId} does not exist in database`
    )
    throw new Error(`User ${userId} not found in database`)
  }

  console.log(`Saving roadmap for user ${user.email} (ID: ${userId})`)

  // Use Prisma for standard fields, raw SQL for goals/education
  const result = await prisma.roadmap.create({
    data: {
      userId,
      currentRole: data.currentRole,
      targetRole: data.targetRole,
      experience: data.experience,
      skills: JSON.stringify(data.skills),
      content,
      title: title || `${data.currentRole} → ${data.targetRole}`,
    },
  })

  // Save goals and education with raw SQL if provided
  if (data.goals || data.education) {
    await prisma.$executeRaw`
      UPDATE "Roadmap" 
      SET goals = ${data.goals || null}, education = ${data.education || null}
      WHERE id = ${result.id}
    `
  }

  return result
}

/**
 * Get all roadmaps for a user
 * @param userId - User ID
 * @param limit - Maximum number of roadmaps to return (default: 10)
 * @returns Array of user's roadmaps
 */
export async function getUserRoadmaps(userId: string, limit: number = 10) {
  // Use raw SQL to fetch goals and education columns that Prisma doesn't know about
  const roadmaps = await prisma.$queryRaw<
    Array<{
      id: string
      userId: string
      currentRole: string
      targetRole: string
      experience: number
      skills: string
      content: string
      title: string | null
      description: string | null
      isPublic: boolean
      goals: string | null
      education: string | null
      createdAt: Date
      updatedAt: Date
    }>
  >`
    SELECT * FROM "Roadmap"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `

  return roadmaps
}

/**
 * Get a specific roadmap by ID with access check
 * @param roadmapId - Roadmap ID
 * @param userId - User ID (for access verification)
 * @returns Full roadmap object or null if not found or unauthorized
 */
export async function getRoadmapById(roadmapId: string, userId: string) {
  // Use raw SQL to fetch goals and education columns
  const roadmap = await prisma.$queryRaw<
    Array<{
      id: string
      userId: string
      currentRole: string
      targetRole: string
      experience: number
      skills: string
      content: string
      title: string | null
      description: string | null
      isPublic: boolean
      goals: string | null
      education: string | null
      createdAt: Date
      updatedAt: Date
    }>
  >`
    SELECT * FROM "Roadmap"
    WHERE id = ${roadmapId} AND "userId" = ${userId}
    LIMIT 1
  `

  return roadmap && roadmap.length > 0 ? roadmap[0] : null
}

/**
 * Update roadmap title or make it public
 * @param roadmapId - Roadmap ID
 * @param userId - User ID (for access verification)
 * @param updates - Fields to update
 * @returns Updated roadmap object
 */
export async function updateRoadmap(
  roadmapId: string,
  userId: string,
  updates: {
    title?: string
    isPublic?: boolean
  }
) {
  // Verify ownership
  const roadmap = await prisma.roadmap.findFirst({
    where: { id: roadmapId, userId },
  })

  if (!roadmap) {
    throw new Error("Roadmap not found or access denied")
  }

  return prisma.roadmap.update({
    where: { id: roadmapId },
    data: updates,
  })
}

/**
 * Delete a roadmap
 * @param roadmapId - Roadmap ID
 * @param userId - User ID (for access verification)
 */
export async function deleteRoadmap(roadmapId: string, userId: string) {
  const roadmap = await prisma.roadmap.findFirst({
    where: { id: roadmapId, userId },
  })

  if (!roadmap) {
    throw new Error("Roadmap not found or access denied")
  }

  return prisma.roadmap.delete({
    where: { id: roadmapId },
  })
}

/**
 * Get roadmap count for a user
 * @param userId - User ID
 * @returns Number of roadmaps
 */
export async function getRoadmapCount(userId: string) {
  return prisma.roadmap.count({
    where: { userId },
  })
}
