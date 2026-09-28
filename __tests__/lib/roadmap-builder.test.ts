/**
 * Roadmap Builder Tests
 * Verifies AI content validation and stitching into the code-built template.
 */

import {
  buildRoadmap,
  isCompleteAIContent,
  parseAIContent,
  PHASE_COUNT,
  ROADMAP_CONTENT_TOOL,
  type RoadmapAIContent,
} from "@/lib/roadmap-builder"
import type { CareerInput } from "@/types/index"

const input: CareerInput = {
  currentRole: "IT Support",
  yearsExperience: 5,
  skills: ["Networking", "Windows Server"],
  goals: "work on cloud infrastructure",
}

const aiContent: RoadmapAIContent = {
  milestones: Array.from({ length: PHASE_COUNT }, (_, i) => ({
    description: `AI phase ${i + 1}`,
    tasks: [`AI task ${i + 1}a`, `AI task ${i + 1}b`],
  })),
  skill_gaps: ["Terraform", "Kubernetes"],
  recommended_roles: [
    {
      title: "Cloud Support Engineer",
      description: "Support cloud workloads",
      demand: "High",
      salary_range: "$80K - $110K",
    },
  ],
  courses: { essential: ["AWS Cloud Practitioner"], advanced: ["CKA prep"] },
  certifications: [
    {
      cert: "AWS SAA",
      roi: 90,
      cost: 150,
      salary_impact: "+$10K",
      time_months: 3,
    },
  ],
  communities: ["r/aws"],
}

const now = new Date("2026-01-01T00:00:00Z")

describe("parseAIContent", () => {
  it("accepts complete valid content", () => {
    const parsed = parseAIContent(aiContent)
    expect(isCompleteAIContent(parsed)).toBe(true)
    expect(parsed).toEqual(aiContent)
  })

  it("drops invalid sections but keeps valid ones", () => {
    const parsed = parseAIContent({
      ...aiContent,
      skill_gaps: "not an array",
      milestones: aiContent.milestones.slice(0, 2),
    })
    expect(parsed.skill_gaps).toBeUndefined()
    expect(parsed.milestones).toBeUndefined()
    expect(parsed.communities).toEqual(["r/aws"])
    expect(isCompleteAIContent(parsed)).toBe(false)
  })

  it("trims extra milestones to PHASE_COUNT", () => {
    const extra = [...aiContent.milestones, aiContent.milestones[0]]
    expect(parseAIContent({ ...aiContent, milestones: extra }).milestones)
      .toHaveLength(PHASE_COUNT)
  })

  it("returns empty object for non-objects", () => {
    expect(parseAIContent(undefined)).toEqual({})
    expect(parseAIContent("x")).toEqual({})
  })
})

describe("buildRoadmap", () => {
  it("stitches AI content into code-built structure", () => {
    const roadmap = buildRoadmap(input, "Cloud Engineer", aiContent, "FREE", now)

    expect(roadmap.title).toContain("IT Support")
    expect(roadmap.title).toContain("Cloud Engineer")
    expect(roadmap.summary).toContain("5 years")
    expect(roadmap.timeline.start_date).toBe("2026-01-01")
    expect(roadmap.milestones).toHaveLength(PHASE_COUNT)
    expect(roadmap.milestones[1].description).toBe("AI phase 2")
    expect(roadmap.milestones[1].title).toMatch(/^Build Skills Gaps/)
    expect(roadmap.skill_gaps).toEqual(["Terraform", "Kubernetes"])
    expect(roadmap.resource_categories.communities).toEqual(["r/aws"])
    expect(roadmap.next_steps.length).toBeGreaterThan(0)
  })

  it("adds a personalized skills task to phase 1", () => {
    const roadmap = buildRoadmap(input, "Cloud Engineer", aiContent, "FREE", now)
    expect(roadmap.milestones[0].tasks[0]).toContain("Networking, Windows Server")
    expect(roadmap.milestones[0].tasks).toHaveLength(3)
  })

  it("falls back to template when AI content is empty", () => {
    const roadmap = buildRoadmap(input, "Cloud Engineer", {}, "FREE", now)
    expect(roadmap.milestones).toHaveLength(PHASE_COUNT)
    expect(roadmap.skill_gaps.length).toBeGreaterThan(0)
    expect(roadmap.recommended_roles.length).toBeGreaterThan(0)
  })

  it("includes tier content only for eligible tiers", () => {
    const free = buildRoadmap(input, "Cloud Engineer", aiContent, "FREE", now)
    const pro = buildRoadmap(input, "Cloud Engineer", aiContent, "PROFESSIONAL", now)
    const premium = buildRoadmap(input, "Cloud Engineer", aiContent, "PREMIUM", now)

    expect(free.professional_tier_content).toBeUndefined()
    expect(free.premium_tier_content).toBeUndefined()
    expect(pro.professional_tier_content?.resume_suggestions.length).toBeGreaterThan(0)
    expect(pro.premium_tier_content).toBeUndefined()
    expect(premium.professional_tier_content).toBeDefined()
    expect(premium.premium_tier_content?.resumes).toHaveLength(4)
  })

  it("handles missing skills and goals", () => {
    const roadmap = buildRoadmap(
      { currentRole: "Teacher", yearsExperience: 12, goals: "" },
      "Instructional Designer",
      {},
      "FREE",
      now,
    )
    expect(roadmap.title).toContain("your existing skills")
    expect(roadmap.timeline.total_months).toBe(24)
  })
})

describe("ROADMAP_CONTENT_TOOL", () => {
  it("requires every AI content section", () => {
    expect(ROADMAP_CONTENT_TOOL.input_schema.required).toEqual(
      Object.keys(aiContent),
    )
  })
})
