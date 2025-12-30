/**
 * Form Validation Tests
 * 
 * Tests validation logic for CareerInput form data.
 * Ensures API will receive valid data.
 */

import type { CareerInput } from "@/types/index";

/**
 * Validation functions (would be moved to utils in production)
 */
function validateCareerInput(input: CareerInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!input.currentRole || input.currentRole.trim() === "") {
    errors.push("Current role is required");
  }

  if (input.yearsExperience === undefined) {
    errors.push("Years of experience is required");
  }

  // Range validation
  if (input.yearsExperience < 0 || input.yearsExperience > 70) {
    errors.push("Years of experience must be between 0 and 70");
  }

  // Goals validation
  if (!input.goals || input.goals.trim() === "") {
    errors.push("Career goals are required");
  }

  // Skills validation (optional but should be reasonable)
  if (input.skills && input.skills.length > 20) {
    errors.push("Too many skills (max 20)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

describe("Form Validation", () => {
  describe("Required Fields", () => {
    it("should reject missing current role", () => {
      const input: CareerInput = {
        currentRole: "",
        yearsExperience: 5,
        goals: "Transition to AI",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Current role is required");
    });

    it("should reject missing goals", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 5,
        goals: "",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Career goals are required");
    });

    it("should accept valid required fields", () => {
      const input: CareerInput = {
        currentRole: "Software Engineer",
        yearsExperience: 5,
        goals: "Transition to AI/ML",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });
  });

  describe("Experience Validation", () => {
    it("should reject negative experience", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: -1,
        goals: "Transition",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it("should reject unrealistic experience (>70 years)", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 100,
        goals: "Transition",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(false);
    });

    it("should accept valid experience range (0-70)", () => {
      [0, 1, 5, 10, 30, 50, 70].forEach((years) => {
        const input: CareerInput = {
          currentRole: "Engineer",
          yearsExperience: years,
          goals: "Transition",
        };

        const validation = validateCareerInput(input);
        expect(validation.errors).not.toContain(
          "Years of experience must be between 0 and 70"
        );
      });
    });
  });

  describe("Skills Validation", () => {
    it("should accept no skills", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 5,
        goals: "Transition",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(true);
    });

    it("should accept empty skills array", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 5,
        goals: "Transition",
        skills: [],
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(true);
    });

    it("should accept reasonable number of skills", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 5,
        goals: "Transition",
        skills: ["Python", "JavaScript", "SQL", "React"],
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(true);
    });

    it("should reject too many skills (>20)", () => {
      const input: CareerInput = {
        currentRole: "Engineer",
        yearsExperience: 5,
        goals: "Transition",
        skills: Array(25).fill("Skill"),
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Too many skills (max 20)");
    });
  });

  describe("Full Form Validation", () => {
    it("should validate complete valid input", () => {
      const input: CareerInput = {
        currentRole: "Product Manager",
        yearsExperience: 7,
        skills: ["Leadership", "Analytics", "Python"],
        goals: "Transition to AI Product Management",
        educationLevel: "Master's",
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it("should catch multiple validation errors", () => {
      const input: CareerInput = {
        currentRole: "",
        yearsExperience: 100,
        goals: "",
        skills: Array(25).fill("Skill"),
      };

      const validation = validateCareerInput(input);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(1);
    });
  });
});
