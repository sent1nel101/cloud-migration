/**
 * Roadmap Cache Tests
 * Prisma is mocked; verifies key normalization, TTL, and failure handling.
 */

const mockFindUnique = jest.fn()
const mockUpdate = jest.fn()
const mockUpsert = jest.fn()

// Lazy wrappers: jest.mock is hoisted above the const declarations
jest.mock("@/lib/prisma", () => ({
  prisma: {
    roadmapCache: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
      upsert: (...args: unknown[]) => mockUpsert(...args),
    },
  },
}))

const findUnique = mockFindUnique
const update = mockUpdate
const upsert = mockUpsert

import {
  getCachedRoadmapContent,
  normalizeRoleKey,
  saveRoadmapContentToCache,
} from "@/lib/roadmap-cache"
import { PHASE_COUNT, type RoadmapAIContent } from "@/lib/roadmap-builder"

const content: RoadmapAIContent = {
  milestones: Array.from({ length: PHASE_COUNT }, () => ({
    description: "d",
    tasks: ["t"],
  })),
  skill_gaps: ["s"],
  recommended_roles: [
    { title: "r", description: "d", demand: "High", salary_range: "$1" },
  ],
  courses: { essential: ["e"], advanced: ["a"] },
  certifications: [
    { cert: "c", roi: 1, cost: 1, salary_impact: "+$1", time_months: 1 },
  ],
  communities: ["c"],
}

beforeEach(() => {
  jest.clearAllMocks()
  update.mockResolvedValue({})
  delete process.env.ROADMAP_CACHE_ENABLED
  delete process.env.ROADMAP_CACHE_TTL_DAYS
})

describe("normalizeRoleKey", () => {
  it("normalizes case, whitespace, quotes, and trailing punctuation", () => {
    expect(normalizeRoleKey("  IT   Support. ")).toBe("it support")
    expect(normalizeRoleKey('"Cloud Engineer"')).toBe("cloud engineer")
    expect(normalizeRoleKey("Cloud Engineer")).toBe(
      normalizeRoleKey("cloud engineer"),
    )
  })
})

describe("getCachedRoadmapContent", () => {
  it("returns content on a fresh hit and records the hit", async () => {
    findUnique.mockResolvedValue({
      id: "1",
      content: JSON.stringify(content),
      updatedAt: new Date(),
    })

    await expect(
      getCachedRoadmapContent("IT Support", "Cloud Engineer"),
    ).resolves.toEqual(content)
    expect(findUnique).toHaveBeenCalledWith({
      where: {
        currentRole_targetRole: {
          currentRole: "it support",
          targetRole: "cloud engineer",
        },
      },
    })
    expect(update).toHaveBeenCalled()
  })

  it("returns null on miss", async () => {
    findUnique.mockResolvedValue(null)
    await expect(getCachedRoadmapContent("a", "b")).resolves.toBeNull()
  })

  it("returns null for stale entries", async () => {
    process.env.ROADMAP_CACHE_TTL_DAYS = "1"
    findUnique.mockResolvedValue({
      id: "1",
      content: JSON.stringify(content),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    })
    await expect(getCachedRoadmapContent("a", "b")).resolves.toBeNull()
  })

  it("returns null for incomplete or corrupt entries", async () => {
    findUnique.mockResolvedValue({
      id: "1",
      content: JSON.stringify({ skill_gaps: ["x"] }),
      updatedAt: new Date(),
    })
    await expect(getCachedRoadmapContent("a", "b")).resolves.toBeNull()

    findUnique.mockResolvedValue({ id: "1", content: "{bad", updatedAt: new Date() })
    await expect(getCachedRoadmapContent("a", "b")).resolves.toBeNull()
  })

  it("returns null when the database errors", async () => {
    findUnique.mockRejectedValue(new Error("db down"))
    await expect(getCachedRoadmapContent("a", "b")).resolves.toBeNull()
  })

  it("skips the database when disabled", async () => {
    process.env.ROADMAP_CACHE_ENABLED = "false"
    await expect(getCachedRoadmapContent("a", "b")).resolves.toBeNull()
    expect(findUnique).not.toHaveBeenCalled()
  })
})

describe("saveRoadmapContentToCache", () => {
  it("upserts by normalized key", async () => {
    upsert.mockResolvedValue({})
    await saveRoadmapContentToCache(" IT Support", "Cloud Engineer", content, "m")
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          currentRole_targetRole: {
            currentRole: "it support",
            targetRole: "cloud engineer",
          },
        },
      }),
    )
  })

  it("swallows write errors", async () => {
    upsert.mockRejectedValue(new Error("db down"))
    await expect(
      saveRoadmapContentToCache("a", "b", content, "m"),
    ).resolves.toBeUndefined()
  })
})
