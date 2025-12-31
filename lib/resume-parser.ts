/**
 * Resume Parser Service
 * Extracts career data from PDF, DOCX, and TXT resume files
 * 
 * Note: PDF parsing requires dynamic server resources.
 * For initial MVP, we extract text from TXT and DOCX as plain text,
 * and handle PDF files when needed.
 */

export interface ParsedResumeData {
  name?: string
  email?: string
  phone?: string
  location?: string
  currentRole?: string
  yearsExperience?: number
  skills?: string[]
  educationLevel?: string
  goals?: string
  rawText: string
}

/**
 * Main entry point - parses resume file and returns structured data
 */
export async function parseResume(
  buffer: Buffer,
  fileType: "pdf" | "docx" | "txt"
): Promise<ParsedResumeData> {
  let rawText = ""

  if (fileType === "pdf") {
    rawText = await extractPDF(buffer)
  } else if (fileType === "docx" || fileType === "txt") {
    // For now, treat DOCX as text (extract as-is)
    // A proper DOCX parser would require unzipping and XML parsing
    rawText = buffer.toString("utf-8")
  } else {
    throw new Error(`Unsupported file type: ${fileType}`)
  }

  const structured = structureData(rawText)
  structured.rawText = rawText

  return structured
}

/**
 * Extract text from PDF file
 * 
 * For MVP: Convert PDF buffer to text by attempting UTF-8 decode
 * In production, use external service like AWS Textract or dedicated PDF library
 */
async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    // Attempt to extract text from PDF as UTF-8
    // This is a basic approach that works for text-based PDFs
    let text = buffer.toString("utf-8")
    
    // Remove binary PDF markers and clean up
    text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, " ")
    
    return text
  } catch (error) {
    console.error("PDF parsing error:", error)
    throw new Error("Failed to parse PDF file. Please use TXT format for best results.")
  }
}



/**
 * Structure extracted text into career data
 */
function structureData(text: string): ParsedResumeData {
  const data: ParsedResumeData = {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    currentRole: extractCurrentRole(text),
    yearsExperience: extractYearsExperience(text),
    skills: extractSkills(text),
    educationLevel: extractEducationLevel(text),
    goals: extractGoals(text),
    rawText: "",
  }

  return data
}

/**
 * Extract name from resume text
 */
function extractName(text: string): string | undefined {
  // Look for common name patterns at the beginning
  const lines = text.split("\n").filter((l) => l.trim().length > 0)
  if (lines.length > 0) {
    const firstLine = lines[0].trim()
    // Remove common header words
    if (
      !firstLine.match(
        /email|phone|location|resume|curriculum|vitae|linkedin|github/i
      )
    ) {
      return firstLine
    }
  }
  return undefined
}

/**
 * Extract email from resume text
 */
function extractEmail(text: string): string | undefined {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex)
  return matches ? matches[0] : undefined
}

/**
 * Extract phone number from resume text
 */
function extractPhone(text: string): string | undefined {
  // US phone format: (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex =
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/
  const matches = text.match(phoneRegex)
  return matches ? matches[0] : undefined
}

/**
 * Extract location/city from resume text
 */
function extractLocation(text: string): string | undefined {
  // Look for patterns like "City, State" or "City, Country"
  const locationRegex = /\b([A-Z][a-z]+),\s*([A-Z]{2})\b/
  const matches = text.match(locationRegex)
  return matches ? `${matches[1]}, ${matches[2]}` : undefined
}

/**
 * Extract current job title from resume text
 */
function extractCurrentRole(text: string): string | undefined {
  // Look for common job title patterns near the top of resume
  const jobTitles = [
    "senior",
    "junior",
    "lead",
    "manager",
    "engineer",
    "developer",
    "designer",
    "analyst",
    "coordinator",
    "specialist",
    "director",
    "executive",
    "consultant",
    "architect",
    "administrator",
    "scientist",
    "officer",
  ]

  const lines = text.split("\n")
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim()
    // Check if line contains job title keywords
    if (
      jobTitles.some((title) => line.toLowerCase().includes(title)) &&
      line.length < 100
    ) {
      return line
    }
  }

  return undefined
}

/**
 * Extract years of experience from resume text
 */
function extractYearsExperience(text: string): number | undefined {
  // Look for patterns like "5 years", "5+ years", "10-year"
  const yearsRegex = /(\d+)\+?\s*(?:years|year)\s*(?:of\s*)?(?:experience|exp)/i
  const matches = text.match(yearsRegex)

  if (matches) {
    return parseInt(matches[1])
  }

  // Alternative: Count job entries (each ~1-2 years on average)
  const jobDateRegex = /\d{4}\s*[-–]\s*(?:present|current|\d{4})/gi
  const jobMatches = text.match(jobDateRegex)
  if (jobMatches && jobMatches.length > 0) {
    return Math.max(jobMatches.length, 1)
  }

  return undefined
}

/**
 * Extract skills from resume text
 */
function extractSkills(text: string): string[] | undefined {
  const skillsRegex =
    /(?:skills?|competencies|technical\s*skills)[\s:]*\n?([\s\S]*?)(?=\n(?:education|experience|certifications|projects|awards|references|\n\n))/i

  const matches = text.match(skillsRegex)
  if (!matches) return undefined

  const skillsText = matches[1]
  // Split by common delimiters
  const skills = skillsText
    .split(/[,•·|]|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 50)
    .slice(0, 20) // Limit to 20 skills

  return skills.length > 0 ? skills : undefined
}

/**
 * Extract education level from resume text
 */
function extractEducationLevel(text: string): string | undefined {
  const educationMap: Record<string, string> = {
    "high school": "High School",
    "associate": "Associate's",
    "bachelor": "Bachelor's",
    "master": "Master's",
    "phd": "PhD",
    "doctorate": "PhD",
  }

  for (const [key, level] of Object.entries(educationMap)) {
    if (text.toLowerCase().includes(key)) {
      return level
    }
  }

  return undefined
}

/**
 * Extract career goals/summary from resume text
 */
function extractGoals(text: string): string | undefined {
  // Look for professional summary section
  const summaryRegex =
    /(?:professional\s*summary|summary|objective|profile)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|education|skills))/i

  const matches = text.match(summaryRegex)
  if (!matches) return undefined

  const summary = matches[1]
    .split("\n")[0]
    .trim()
    .substring(0, 200) // First line, max 200 chars

  return summary.length > 0 ? summary : undefined
}
