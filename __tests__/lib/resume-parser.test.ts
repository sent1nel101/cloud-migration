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

describe("parseResume education level", () => {
  const cases: [string, string, string | undefined][] = [
    // Regressions: substrings, states, and job titles must not match
    [
      "no degree mentioned",
      "Sam Lee\nExperience\nMaintained systems in Boston, MA. Scrum master for 3 teams. Mastered MS Office. Worked with associates daily.",
      undefined,
    ],
    [
      "state code in education section",
      "Sam Lee\nEducation\nBoston Latin School, Boston, MA\nHigh School Diploma\n\nExperience\nCashier",
      "High School",
    ],
    // Positive detection
    ["dotted abbreviation", "Education\nB.S. Nursing, State University\n", "Bachelor's"],
    ["bare abbreviation with 'in'", "Education\nBS in Accounting\n", "Bachelor's"],
    ["full name", "Education\nMaster of Social Work\n", "Master's"],
    ["MBA", "Education\nMBA, Finance\n", "Master's"],
    ["associate degree", "Education\nAssociate of Applied Science, Welding\n", "Associate's"],
    ["GED", "Education\nGED, 2015\n", "High School"],
    ["doctorate", "Education\nPh.D. in Education\n", "PhD"],
    // Highest level wins regardless of order
    [
      "multiple levels",
      "Education\nHigh School Diploma, 2008\nBachelor of Arts, 2012\nMaster of Education, 2016\n",
      "Master's",
    ],
  ]

  it.each(cases)("%s", async (_name, text, expected) => {
    const result = await parse(text)
    expect(result.educationLevel).toBe(expected)
  })
})
