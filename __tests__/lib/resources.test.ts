/**
 * Resources Tests
 * Curated tech entries for exact matches; search links for every other career.
 */

import {
  buildSearchResources,
  getResourcesForRole,
  ROLE_RESOURCES,
} from "@/lib/resources"
import { buildRoadmap, PHASE_COUNT } from "@/lib/roadmap-builder"

describe("getResourcesForRole", () => {
  it("returns curated resources for an exact curated role", () => {
    expect(getResourcesForRole("Cloud Engineer")).toBe(
      ROLE_RESOURCES["cloud engineer"],
    )
  })

  it("returns curated resources when the role contains a curated key", () => {
    expect(getResourcesForRole("Senior DevOps Engineer")).toBe(
      ROLE_RESOURCES["devops engineer"],
    )
  })

  it("does not map unrelated careers to cloud resources", () => {
    for (const role of ["Registered Nurse", "Electrician", "Architect", "Engineer"]) {
      const resources = getResourcesForRole(role)
      const allUrls = [
        ...resources.courses,
        ...resources.certifications,
        ...resources.communities,
      ].map((r) => r.url)
      expect(allUrls.some((url) => /aws|azure|cloud/i.test(url))).toBe(false)
    }
  })

  it("links provided certification names for non-curated roles", () => {
    const resources = getResourcesForRole("Registered Nurse", ["NCLEX-RN"])
    expect(resources.certifications).toHaveLength(1)
    expect(resources.certifications[0].name).toBe("NCLEX-RN")
    expect(resources.certifications[0].url).toContain("NCLEX-RN")
  })
})

describe("buildSearchResources", () => {
  it("builds encoded search links for the role", () => {
    const resources = buildSearchResources("HVAC Technician & Installer")
    expect(resources.courses.length).toBeGreaterThan(0)
    expect(resources.communities.length).toBeGreaterThan(0)
    for (const link of [...resources.courses, ...resources.communities]) {
      expect(link.url).toMatch(/^https:\/\//)
      expect(link.url).toContain(encodeURIComponent("HVAC Technician & Installer"))
    }
  })

  it("falls back to certification finder links when no names are given", () => {
    const resources = buildSearchResources("Paralegal")
    expect(resources.certifications.length).toBeGreaterThan(0)
    expect(resources.certifications[0].url).toContain("careeronestop.org")
  })
})

describe("buildRoadmap paid-tier resources", () => {
  const input = {
    currentRole: "Retail Manager",
    yearsExperience: 6,
    skills: ["Scheduling"],
    goals: "become a nurse",
  }

  it("links Claude's certification names for non-curated roles", () => {
    const roadmap = buildRoadmap(
      input,
      "Registered Nurse",
      {
        milestones: Array.from({ length: PHASE_COUNT }, () => ({
          description: "d",
          tasks: ["t"],
        })),
        certifications: [
          { cert: "NCLEX-RN", roi: 90, cost: 200, salary_impact: "+$20K", time_months: 3 },
        ],
      },
      "PROFESSIONAL",
    )
    const certs = roadmap.professional_tier_content?.certifications ?? []
    expect(certs.map((c) => c.name)).toEqual(["NCLEX-RN"])
  })

  it("uses the certification finder when Claude content is unavailable", () => {
    const roadmap = buildRoadmap(input, "Registered Nurse", {}, "PROFESSIONAL")
    const certs = roadmap.professional_tier_content?.certifications ?? []
    expect(certs[0].url).toContain("careeronestop.org")
  })
})
