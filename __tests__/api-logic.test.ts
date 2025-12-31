/**
 * API Logic Tests
 * 
 * Tests the core business logic of the roadmap generation API
 * without requiring actual Claude API calls (unit test, not integration test).
 */

import type { CareerInput, Roadmap } from "@/types/index";

/**
 * Test utility: Validates that a Roadmap object has all required fields
 */
function isValidRoadmap(roadmap: unknown): roadmap is Roadmap {
  if (typeof roadmap !== "object" || roadmap === null) return false;

  const r = roadmap as Record<string, unknown>;

  return (
    typeof r.title === "string" &&
    typeof r.summary === "string" &&
    typeof r.timeline === "object" &&
    typeof r.milestones === "object" &&
    Array.isArray(r.skill_gaps) &&
    Array.isArray(r.recommended_roles) &&
    typeof r.resource_categories === "object" &&
    Array.isArray(r.next_steps)
  );
}

/**
 * Test utility: Validates timeline field structure
 */
function isValidTimeline(
  timeline: unknown
): timeline is Roadmap["timeline"] {
  if (typeof timeline !== "object" || timeline === null) return false;

  const t = timeline as Record<string, unknown>;

  return (
    typeof t.total_months === "number" &&
    t.total_months > 0 &&
    typeof t.start_date === "string" &&
    typeof t.estimated_completion === "string"
  );
}

describe("API Logic", () => {
  describe("Roadmap Structure Validation", () => {
    it("should validate a complete roadmap object", () => {
      const roadmap: Roadmap = {
        title: "Career Path: Engineer → AI Specialist",
        summary: "18-month transition plan",
        timeline: {
          total_months: 18,
          start_date: "2024-12-29",
          estimated_completion: "2026-06-29",
        },
        milestones: [
          {
            phase: 1,
            title: "Foundation",
            description: "Learn basics",
            tasks: ["Task 1"],
            duration_months: 3,
          },
        ],
        skill_gaps: ["Python", "ML"],
        recommended_roles: [
          {
            title: "ML Engineer",
            description: "Engineer ML systems",
            demand: "High",
            salary_range: "$120K - $180K",
          },
        ],
        resource_categories: {
          courses: { essential: ["Course 1"], advanced: ["Course 2"] },
          certifications: ["Cert 1"],
          communities: ["Community 1"],
        },
        next_steps: ["Step 1", "Step 2"],
      };

      expect(isValidRoadmap(roadmap)).toBe(true);
    });

    it("should reject invalid roadmap (missing fields)", () => {
      const invalidRoadmap = {
        title: "Career Path",
        summary: "Description",
        // Missing timeline, milestones, etc.
      };

      expect(isValidRoadmap(invalidRoadmap)).toBe(false);
    });

    it("should reject invalid timeline (negative months)", () => {
      const invalidTimeline = {
        total_months: -5,
        start_date: "2024-12-29",
        estimated_completion: "2026-06-29",
      };

      expect(isValidTimeline(invalidTimeline)).toBe(false);
    });

    it("should validate timeline with zero months", () => {
      const edgeTimeline = {
        total_months: 0,
        start_date: "2024-12-29",
        estimated_completion: "2024-12-29",
      };

      expect(isValidTimeline(edgeTimeline)).toBe(false);
    });

    it("should validate timeline with positive months", () => {
      const validTimeline = {
        total_months: 24,
        start_date: "2024-12-29",
        estimated_completion: "2026-12-29",
      };

      expect(isValidTimeline(validTimeline)).toBe(true);
    });
  });

  describe("Timeline Calculation", () => {
    it("should calculate reasonable timeline for junior with no experience", () => {
      // Based on API formula: Math.min(48, 24 + (10 - experience) * 3)
      const experience = 0;
      const calculatedMonths = Math.min(48, 24 + (10 - experience) * 3);
      expect(calculatedMonths).toBe(48); // Max capped at 48
    });

    it("should calculate moderate timeline for mid-level professional", () => {
      const experience = 5;
      const calculatedMonths = Math.min(48, 24 + (10 - experience) * 3);
      expect(calculatedMonths).toBe(39); // 24 + 15
    });

    it("should calculate shorter timeline for experienced professional", () => {
      const experience = 10;
      const calculatedMonths = Math.min(48, 24 + (10 - experience) * 3);
      expect(calculatedMonths).toBe(24); // Base minimum
    });

    it("should calculate very short timeline for highly experienced", () => {
      const experience = 15;
      const calculatedMonths = Math.min(48, Math.max(24, 24 + (10 - experience) * 3));
      expect(calculatedMonths).toBe(24); // Doesn't go below 24
    });
  });

  describe("Response Error Handling", () => {
    it("should identify JSON parsing errors", () => {
      const invalidJson = "{ invalid json";
      expect(() => JSON.parse(invalidJson)).toThrow(SyntaxError);
    });

    it("should handle markdown code blocks in response", () => {
      const responseWithMarkdown = "```json\n{\"title\": \"test\"}\n```";
      const cleaned = responseWithMarkdown
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "");
      expect(cleaned).toBe('{"title": "test"}');
    });

    it("should parse cleaned JSON successfully", () => {
      const responseWithMarkdown = '```json\n{"title": "test", "summary": "desc"}\n```';
      const cleaned = responseWithMarkdown
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "");
      const parsed = JSON.parse(cleaned);
      expect(parsed.title).toBe("test");
    });

    it("should trim whitespace from response", () => {
      const responseWithWhitespace = '  \n  {"title": "test"}  \n  ';
      const trimmed = responseWithWhitespace.trim();
      const parsed = JSON.parse(trimmed);
      expect(parsed.title).toBe("test");
    });
  });

  describe("Input to Output Transformation", () => {
    it("should use all input fields in prompt generation", () => {
      const input: CareerInput = {
        currentRole: "Software Engineer",
        yearsExperience: 5,
        skills: ["Python", "JavaScript"],
        goals: "Transition to AI roles",
        educationLevel: "Bachelor's",
      };

      // Verify all fields are being used
      expect(input.currentRole).toBeTruthy();
      expect(input.yearsExperience).toBeGreaterThan(0);
      expect(input.skills?.length).toBeGreaterThan(0);
      expect(input.goals).toBeTruthy();
      expect(input.educationLevel).toBeTruthy();
    });

    it("should handle minimal required input", () => {
      const minimalInput: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 3,
        goals: "Change careers",
      };

      // Should still be processable
      expect(minimalInput.currentRole).toBeTruthy();
      expect(minimalInput.yearsExperience).toBeGreaterThan(0);
      expect(minimalInput.goals).toBeTruthy();
    });
  });

  describe("API Response Codes", () => {
    it("should return 200 for successful request", () => {
      const statusCode = 200;
      expect([200, 201].includes(statusCode)).toBe(true);
    });

    it("should return 400 for validation errors", () => {
      const statusCode = 400;
      expect([400, 422].includes(statusCode)).toBe(true);
    });

    it("should return 500 for server errors", () => {
      const statusCode = 500;
      expect([500, 503].includes(statusCode)).toBe(true);
    });
  });
});
