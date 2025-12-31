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

  // Debug logging
  console.log("[RESUME PARSER] Extracted data:", {
    name: data.name || "(not found)",
    email: data.email || "(not found)",
    phone: data.phone || "(not found)",
    location: data.location || "(not found)",
    currentRole: data.currentRole || "(not found)",
    yearsExperience: data.yearsExperience || "(not found)",
    skillsCount: data.skills?.length || 0,
    educationLevel: data.educationLevel || "(not found)",
    goalsLength: data.goals?.length || 0,
  })

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
  // Support multi-word city names (e.g., "San Francisco, CA")
  const locationRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/
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
  // Look for patterns like "5 years", "5+ years", "10-year", "with 3 years"
  const yearsRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|professional|industry)?/i
  const matches = text.match(yearsRegex)

  if (matches && matches[1]) {
    const years = parseInt(matches[1])
    // Validate years are reasonable (1-70)
    if (years >= 1 && years <= 70) {
      return years
    }
  }

  // Alternative: Extract from job dates (e.g., "2020-Present" means ~4 years)
  const jobDateRegex = /(\d{4})\s*[-–—]\s*(?:present|current|today|\d{4})/gi
  const jobMatches = text.match(jobDateRegex)
  if (jobMatches && jobMatches.length > 0) {
    // Calculate experience from dates
    const currentYear = new Date().getFullYear()
    let totalYears = 0
    
    for (const match of jobMatches) {
      const yearMatch = match.match(/(\d{4})/)
      if (yearMatch) {
        const startYear = parseInt(yearMatch[1])
        const isPresent = /present|current|today/i.test(match)
        const endYear = isPresent ? currentYear : parseInt(match.split(/-–—/)[1].trim()) || currentYear
        totalYears += (endYear - startYear)
      }
    }
    
    if (totalYears > 0) {
      return Math.max(totalYears, 1)
    }
  }

  return undefined
}

/**
 * Extract skills from resume text
 */
function extractSkills(text: string): string[] | undefined {
  // Try to find dedicated skills section
  const skillsRegex =
    /(?:skills?|competencies|technical\s*skills|technical\s*expertise|core\s*competencies)[\s:]*\n?([\s\S]*?)(?=\n(?:education|experience|certifications|projects|awards|references|professional|summary|\n\n|$))/i

  const matches = text.match(skillsRegex)
  if (!matches) {
    // If no skills section, try to extract from experience section (look for words in parentheses or after dashes)
    const experienceText = text.toLowerCase()
    const commonSkills = [
      'python', 'javascript', 'java', 'c++', 'c#', 'typescript', 'react', 'node', 'angular', 'vue',
      'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'git', 'linux', 'windows', 'html', 'css', 'bootstrap', 'tailwind',
      'machine learning', 'ai', 'data analysis', 'analytics', 'excel', 'tableau', 'power bi',
      'sales', 'marketing', 'project management', 'agile', 'scrum', 'leadership',
      'communication', 'problem solving', 'teamwork', 'collaboration'
    ]
    
    const foundSkills = commonSkills.filter(skill => experienceText.includes(skill.toLowerCase()))
    return foundSkills.length > 0 ? foundSkills : undefined
  }

  const skillsText = matches[1]
  // Split by common delimiters (comma, bullet, newline, pipe)
  const skills = skillsText
    .split(/[,•·|]|\n/)
    .map((s) => s.trim())
    .filter((s) => {
      // Filter out:
      // - Empty strings
      // - Section headers (all caps words)
      // - Numbers only
      // - Common section names
      // - Strings longer than 60 chars
      const isNumeric = s.match(/^\d+$/)
      const isAllCaps = s === s.toUpperCase() && s.length > 2
      const isSectionHeader = /^(WORK|EDUCATION|EXPERIENCE|PROFESSIONAL|SUMMARY|OBJECTIVE|CERTIFICATIONS|PROJECTS|AWARDS|REFERENCES)/.test(s)
      return s.length > 0 && s.length < 60 && !isNumeric && !isAllCaps && !isSectionHeader
    })
    .slice(0, 30) // Limit to 30 skills

  return skills.length > 0 ? skills : undefined
}

/**
 * Extract education level from resume text
 */
function extractEducationLevel(text: string): string | undefined {
  const educationMap: Record<string, string> = {
    "high school": "High School",
    "h.s.": "High School",
    "associate": "Associate's",
    "a.s.": "Associate's",
    "bachelor": "Bachelor's",
    "b.s.": "Bachelor's",
    "b.a.": "Bachelor's",
    "master": "Master's",
    "m.s.": "Master's",
    "m.a.": "Master's",
    "m.b.a.": "Master's",
    "phd": "PhD",
    "ph.d.": "PhD",
    "doctorate": "PhD",
    "d.phil": "PhD",
  }

  // Look in EDUCATION section specifically to avoid false matches
  const educationSectionRegex = /(?:education|academic)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|skills|certifications|projects|awards|references|\n\n|$))/i
  const educationSectionMatches = text.match(educationSectionRegex)
  const searchText = educationSectionMatches ? educationSectionMatches[1] : text

  for (const [key, level] of Object.entries(educationMap)) {
    if (searchText.toLowerCase().includes(key)) {
      return level
    }
  }

  return undefined
}

/**
 * Extract career goals from resume text
 * 
 * Only extracts from explicit "Goals", "Objective", or "Career Objective" sections.
 * Professional summaries describe current experience, not future goals,
 * so we leave this field empty for user input if no explicit goals section exists.
 */
function extractGoals(text: string): string | undefined {
  // Only look for explicit goals/objective sections (NOT professional summary)
  const goalsRegex =
    /(?:career\s*goals?|goals?|career\s*objective|objective)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|education|skills|work|projects|certifications|professional|summary|\n\n))/i

  const matches = text.match(goalsRegex)
  if (matches) {
    const goalsText = matches[1]
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 2)
      .join(" ")
      .substring(0, 250)

    // Only return if it sounds like a goal (contains future-oriented language)
    const futureIndicators = /\b(become|transition|grow|advance|move into|pursue|seeking|looking for|aspire|goal|aim|want to)\b/i
    if (goalsText.length > 0 && futureIndicators.test(goalsText)) {
      return goalsText
    }
  }

  // Don't prefill with professional summary - let user enter their own goals
  return undefined
}
