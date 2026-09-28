/**
 * @jest-environment node
 *
 * Resume Parser Tests
 * Keyword skill detection for non-tech resumes (no dedicated skills section).
 */

import { parseResume } from "@/lib/resume-parser"

const parse = (text: string) => parseResume(Buffer.from(text, "utf-8"), "txt")

describe("parseResume keyword skills", () => {
  it("detects healthcare skills", async () => {
    const result = await parse(
      "Jane Doe\nExperience\nProvided patient care and triage in a busy ER. Maintained electronic health records and followed infection control protocols. Certified in CPR and BLS.",
    )
    expect(result.skills).toEqual(
      expect.arrayContaining(["patient care", "triage", "cpr", "bls"]),
    )
  })

  it("detects trades skills", async () => {
    const result = await parse(
      "John Doe\nExperience\nPerformed welding and preventive maintenance on HVAC systems. OSHA 30 trained, forklift certified, strong blueprint reading.",
    )
    expect(result.skills).toEqual(
      expect.arrayContaining(["welding", "hvac", "osha", "forklift", "blueprint reading"]),
    )
  })

  it("does not match common words as skills", async () => {
    const result = await parse(
      "Alex Doe\nExperience\nAn epic year. Wrote a word or two about my career outlook while writing and editing notes.",
    )
    expect(result.skills ?? []).not.toEqual(
      expect.arrayContaining(["epic systems"]),
    )
    for (const skill of result.skills ?? []) {
      expect(["word", "writing", "editing", "outlook", "epic"]).not.toContain(skill)
    }
  })
})
