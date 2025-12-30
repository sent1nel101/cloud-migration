/**
 * Type Definition Tests
 * 
 * Validates that TypeScript interfaces match expected structure
 * and that sample data conforms to type definitions.
 */

import type {
  CareerInput,
  Milestone,
  RecommendedRole,
  Roadmap,
  ResourceCategories,
} from "@/types/index";

describe("Type Definitions", () => {
  describe("CareerInput", () => {
    it("should accept valid career input", () => {
      const input: CareerInput = {
        currentRole: "Software Engineer",
        yearsExperience: 5,
        skills: ["JavaScript", "Python", "React"],
        goals: "Transition to AI/ML roles",
        educationLevel: "Bachelor's",
      };

      expect(input.currentRole).toBe("Software Engineer");
      expect(input.yearsExperience).toBe(5);
      expect(input.skills?.length).toBe(3);
      expect(input.goals).toBeTruthy();
    });

    it("should allow optional skills and education", () => {
      const input: CareerInput = {
        currentRole: "Product Manager",
        yearsExperience: 3,
        goals: "Become AI Product Lead",
      };

      expect(input.skills).toBeUndefined();
      expect(input.educationLevel).toBeUndefined();
    });
  });

  describe("Milestone", () => {
    it("should structure career phases correctly", () => {
      const milestone: Milestone = {
        phase: 1,
        title: "Foundation: AI Literacy",
        description: "Build foundational understanding",
        tasks: ["Complete course", "Read articles"],
        duration_months: 3,
      };

      expect(milestone.phase).toBe(1);
      expect(milestone.tasks.length).toBe(2);
      expect(milestone.duration_months).toBe(3);
    });
  });

  describe("RecommendedRole", () => {
    it("should include salary and demand information", () => {
      const role: RecommendedRole = {
        title: "Prompt Engineer",
        description: "Design AI prompts",
        demand: "Very High",
        salary_range: "$100K - $160K",
      };

      expect(role.salary_range).toContain("$");
      expect(role.demand).toBe("Very High");
    });
  });

  describe("ResourceCategories", () => {
    it("should organize learning resources by type", () => {
      const resources: ResourceCategories = {
        courses: {
          essential: ["AI for Everyone"],
          advanced: ["Deep Learning Specialization"],
        },
        certifications: ["Google Cloud AI Engineer"],
        communities: ["r/MachineLearning"],
      };

      expect(resources.courses.essential.length).toBeGreaterThan(0);
      expect(resources.certifications.length).toBeGreaterThan(0);
      expect(resources.communities.length).toBeGreaterThan(0);
    });
  });

  describe("Roadmap", () => {
    it("should include all required roadmap sections", () => {
      const roadmap: Roadmap = {
        title: "Career Path: Engineer → AI Specialist",
        summary: "18-month transition plan",
        timeline: {
          total_months: 18,
          start_date: "2024-12-29",
          estimated_completion: "2026-06-29",
        },
        milestones: [],
        skill_gaps: ["Python", "Machine Learning"],
        recommended_roles: [],
        resource_categories: {
          courses: { essential: [], advanced: [] },
          certifications: [],
          communities: [],
        },
        next_steps: ["Enroll in course", "Build portfolio"],
      };

      expect(roadmap.title).toBeTruthy();
      expect(roadmap.timeline.total_months).toBeGreaterThan(0);
      expect(roadmap.skill_gaps).toBeInstanceOf(Array);
      expect(roadmap.next_steps.length).toBeGreaterThan(0);
    });
  });
});
