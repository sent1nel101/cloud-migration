/**
 * Roadmap Cache
 *
 * Caches AI-generated roadmap content (RoadmapAIContent) per
 * (currentRole, targetRole) pair so repeat transitions cost zero API tokens.
 * Only role-level content is stored - personal details are stitched in by
 * lib/roadmap-builder.ts on every request.
 *
 * All cache failures are logged and swallowed: a broken cache must never
 * block roadmap generation.
 */

import { prisma } from "@/lib/prisma"
import {
  isCompleteAIContent,
  parseAIContent,
  type RoadmapAIContent,
} from "@/lib/roadmap-builder"

/** Entries older than this are treated as stale and regenerated. */
const DEFAULT_TTL_DAYS = 90

function getTtlMs(): number {
  const days = Number(process.env.ROADMAP_CACHE_TTL_DAYS)
  return (Number.isFinite(days) && days > 0 ? days : DEFAULT_TTL_DAYS) *
    24 * 60 * 60 * 1000
}

/** Set ROADMAP_CACHE_ENABLED=false to bypass the cache entirely. */
export function isCacheEnabled(): boolean {
  return process.env.ROADMAP_CACHE_ENABLED !== "false"
}

/**
 * Normalizes a role name into a cache key so trivial variations
 * ("IT Support", " it  support ", "IT Support.") share one entry.
 */
export function normalizeRoleKey(role: string): string {
  return role
    .toLowerCase()
    .replace(/["'`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:!?]+$/, "")
}

/**
 * Returns cached content for a role pair, or null on miss/stale/error.
 */
export async function getCachedRoadmapContent(
  currentRole: string,
  targetRole: string,
): Promise<RoadmapAIContent | null> {
  if (!isCacheEnabled()) return null

  const key = {
    currentRole: normalizeRoleKey(currentRole),
    targetRole: normalizeRoleKey(targetRole),
  }

  try {
    const entry = await prisma.roadmapCache.findUnique({
      where: { currentRole_targetRole: key },
    })
    if (!entry) return null

    if (Date.now() - entry.updatedAt.getTime() > getTtlMs()) {
      console.log("Roadmap cache stale:", key)
      return null
    }

    const content = parseAIContent(JSON.parse(entry.content))
    if (!isCompleteAIContent(content)) {
      console.warn("Roadmap cache entry invalid, ignoring:", key)
      return null
    }

    // Record the hit without delaying the response
    prisma.roadmapCache
      .update({
        where: { id: entry.id },
        data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
      })
      .catch((e: unknown) => console.error("Cache hit update failed:", e))

    return content
  } catch (error) {
    console.error("Roadmap cache read failed:", error)
    return null
  }
}

/**
 * Stores (or refreshes) content for a role pair.
 */
export async function saveRoadmapContentToCache(
  currentRole: string,
  targetRole: string,
  content: RoadmapAIContent,
  model: string,
): Promise<void> {
  if (!isCacheEnabled()) return

  const key = {
    currentRole: normalizeRoleKey(currentRole),
    targetRole: normalizeRoleKey(targetRole),
  }
  const serialized = JSON.stringify(content)

  try {
    await prisma.roadmapCache.upsert({
      where: { currentRole_targetRole: key },
      create: { ...key, content: serialized, model },
      update: { content: serialized, model },
    })
  } catch (error) {
    console.error("Roadmap cache write failed:", error)
  }
}
