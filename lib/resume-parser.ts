/**
 * Resume Parser Service (Improved)
 * Extracts career data from PDF, DOCX, and TXT resume files
 * 
 * Improvements:
 * - Proper PDF parsing with pdf-parse library
 * - DOCX support with jszip library
 * - More robust regex patterns
 * - Fallback extraction strategies
 * - Better handling of various resume formats
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

  try {
    if (fileType === "pdf") {
      rawText = await extractPDF(buffer)
    } else if (fileType === "docx") {
      rawText = await extractDOCX(buffer)
    } else if (fileType === "txt") {
      rawText = buffer.toString("utf-8")
    } else {
      throw new Error(`Unsupported file type: ${fileType}`)
    }
  } catch (error) {
    console.error(`[RESUME PARSER] Error extracting text from ${fileType}:`, error)
    throw new Error(`Failed to parse ${fileType.toUpperCase()} file. Please ensure the file is a valid ${fileType.toUpperCase()} document.`)
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("Could not extract any text from the resume file")
  }

  const structured = structureData(rawText)
  structured.rawText = rawText

  return structured
}

/**
 * Extract text from PDF file using pdf-parse library
 */
async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to handle ESM module  
    const pdfParseModule: any = await import("pdf-parse")
    // pdf-parse exports the function directly as a named export
    const pdfParse = pdfParseModule.pdf || pdfParseModule[Object.keys(pdfParseModule)[0]]
    
    const pdfData = await pdfParse(buffer)
    let text = pdfData.text || ""
    
    // Clean up extracted text
    text = text.replace(/\s+/g, " ").trim()
    
    if (!text || text.length === 0) {
      throw new Error("PDF contains no extractable text")
    }
    
    return text
  } catch (error) {
    console.error("[RESUME PARSER] PDF parsing error:", error)
    throw new Error("Failed to parse PDF file. Please ensure it's a valid PDF with extractable text.")
  }
}

/**
 * Extract text from DOCX file
 * 
 * DOCX files are ZIP archives containing XML. We extract text from document.xml
 */
async function extractDOCX(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for jszip (ESM module)
    const JSZip = (await import("jszip")).default
    const zip = new JSZip()
    const loaded = await zip.loadAsync(buffer)
    
    // Get the main document XML
    const documentFile = loaded.file("word/document.xml")
    if (!documentFile) {
      throw new Error("Could not find document.xml in DOCX file")
    }
    
    const documentXml = await documentFile.async("string")
    
    // Extract text from XML
    // This regex captures text between XML tags
    const textMatches = documentXml.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)
    
    if (!textMatches || textMatches.length === 0) {
      // Fallback: try alternative extraction method
      const altMatches = documentXml.match(/>([^<]*[a-zA-Z0-9]+[^<]*)</g)
      if (!altMatches || altMatches.length === 0) {
        throw new Error("No text found in DOCX document")
      }
      
      let text = altMatches
        .map((match: string) => {
          return match.replace(/^>/, "").replace(/<$/, "").trim()
        })
        .filter((s) => s.length > 0)
        .join(" ")
      
      text = text.replace(/\s+/g, " ").trim()
      return text
    }
    
    let text = textMatches
      .map((match: string) => {
        // Extract content between tags
        const content = match.replace(/<w:t[^>]*>/, "").replace(/<\/w:t>/, "")
        return content
      })
      .join(" ")
    
    text = text.replace(/\s+/g, " ").trim()
    
    return text
  } catch (error) {
    console.error("[RESUME PARSER] DOCX parsing error:", error)
    throw new Error("Failed to parse DOCX file. Please ensure it's a valid Word document.")
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
 * Strategy: First meaningful line that isn't a section header or contact info
 */
function extractName(text: string): string | undefined {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.length < 100)

  for (const line of lines) {
    // Skip common non-name lines
    if (
      line.match(
        /email|phone|location|resume|curriculum|vitae|linkedin|github|website|portfolio|objective|summary|professional/i
      ) ||
      line.match(/@/) || // Email line
      line.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/) // Phone line
    ) {
      continue
    }

    // Likely a name if it has 2+ words and reasonable length
    const words = line.split(/\s+/)
    if (words.length >= 2 && line.length >= 5 && line.length < 80) {
      return line
    }

    // Single word but looks like name format (not all caps)
    if (
      words.length === 1 &&
      line.length >= 3 &&
      line.length < 50 &&
      !line.match(/^[A-Z\s]+$/)
    ) {
      continue
    }
  }

  return undefined
}

/**
 * Extract email from resume text
 */
function extractEmail(text: string): string | undefined {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  const matches = text.match(emailRegex)
  // Return the first valid-looking email
  if (matches) {
    return matches[0]
  }
  return undefined
}

/**
 * Extract phone number from resume text
 * Supports US and international formats
 */
function extractPhone(text: string): string | undefined {
  // US formats
  const usFormats = [
    /(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    /(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
  ]

  // International formats
  const intlFormats = [
    /\+\d{1,3}[-.\s]?\d{1,14}/,
  ]

  const allFormats = [...usFormats, ...intlFormats]

  for (const regex of allFormats) {
    const matches = text.match(regex)
    if (matches) {
      return matches[0].trim()
    }
  }

  return undefined
}

/**
 * Extract location/city from resume text
 * Supports multi-word cities and various formats
 */
function extractLocation(text: string): string | undefined {
  // Pattern: City, State or City, Country
  // Handles: "San Francisco, CA", "New York, NY", "London, UK"
  const patterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}(?:\s+[A-Z]{2})?)\b/,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/,
  ]

  for (const pattern of patterns) {
    const matches = text.match(pattern)
    if (matches) {
      return `${matches[1]}, ${matches[2]}`
    }
  }

  return undefined
}

/**
 * Extract current job title from resume text
 * Searches throughout document, not just first 30 lines
 */
function extractCurrentRole(text: string): string | undefined {
  const jobKeywords = [
    "senior",
    "junior",
    "lead",
    "manager",
    "engineer",
    "developer",
    "designer",
    "analyst",
    "architect",
    "specialist",
    "director",
    "coordinator",
    "administrator",
    "consultant",
    "officer",
    "associate",
    "intern",
    "executive",
    "scientist",
    "technician",
  ]

  const lines = text.split("\n")

  // First pass: Look in experience/employment section (more reliable)
  const experienceMatch = text.match(
    /(?:experience|employment|work history)[\s:]*\n([\s\S]*?)(?=\n(?:education|skills|certifications|projects|awards|\n\n|$))/i
  )
  const searchText = experienceMatch ? experienceMatch[1] : text
  const searchLines = searchText.split("\n")

  for (let i = 0; i < Math.min(searchLines.length, 50); i++) {
    const line = searchLines[i].trim()

    if (line.length === 0 || line.length > 100) continue

    // Check if line contains job keywords
    if (
      jobKeywords.some((keyword) =>
        line.toLowerCase().includes(keyword)
      )
    ) {
      return line
    }
  }

  // Second pass: Search entire document if no experience section found
  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    const line = lines[i].trim()

    if (line.length === 0 || line.length > 100) continue

    if (
      jobKeywords.some((keyword) =>
        line.toLowerCase().includes(keyword)
      ) &&
      !line.match(/education|skills|certifications|projects/i)
    ) {
      return line
    }
  }

  return undefined
}

/**
 * Extract years of experience from resume text
 * Multiple strategies for reliability
 */
function extractYearsExperience(text: string): number | undefined {
  // Strategy 1: Look for explicit "X years" mentions
  const yearsRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|professional|industry)?/i
  const yearsMatches = text.match(yearsRegex)

  if (yearsMatches && yearsMatches[1]) {
    const years = parseInt(yearsMatches[1])
    if (years >= 1 && years <= 70) {
      return years
    }
  }

  // Strategy 2: Extract from job dates
  const jobDateRegex = /(\d{4})\s*[-–—]\s*(?:present|current|today|now|\d{4})/gi
  const jobMatches = text.match(jobDateRegex)

  if (jobMatches && jobMatches.length > 0) {
    const currentYear = new Date().getFullYear()
    let totalYears = 0

    for (const match of jobMatches) {
      const parts = match.split(/[-–—]/)
      const startYear = parseInt(parts[0].trim())

      if (isNaN(startYear)) continue

      const endPart = parts[1].trim().toLowerCase()
      const isPresent =
        endPart.includes("present") ||
        endPart.includes("current") ||
        endPart.includes("today") ||
        endPart.includes("now")

      const endYear = isPresent ? currentYear : parseInt(endPart)

      if (!isNaN(endYear)) {
        totalYears += endYear - startYear
      }
    }

    if (totalYears > 0) {
      return Math.max(totalYears, 1)
    }
  }

  // Strategy 3: Fallback - count job entries as rough estimate
  const jobEntries = text.match(/(\d{4})\s*[-–—]/g)
  if (jobEntries && jobEntries.length > 0) {
    // Rough estimate: 2-4 years per job
    return Math.min(jobEntries.length * 3, 40)
  }

  return undefined
}

/**
 * Extract skills from resume text
 * Multiple strategies for different resume formats
 */
function extractSkills(text: string): string[] | undefined {
  // Strategy 1: Look for dedicated skills section
  const skillsSectionRegex =
    /(?:skills?|competencies|technical\s*skills?|technical\s*expertise|core\s*competencies|tools?|technologies?)[\s:]*\n?([\s\S]*?)(?=\n(?:education|experience|certifications|projects|awards|references|professional|summary|work|employment|\n\n|$))/i

  const skillsMatches = text.match(skillsSectionRegex)

  if (skillsMatches && skillsMatches[1]) {
    const skillsText = skillsMatches[1]

    // Split by common delimiters
    const skills = skillsText
      .split(/[,•·|]|\n/)
      .map((s) => s.trim())
      .filter((s) => {
        if (s.length === 0 || s.length > 100) return false

        // Skip section headers
        if (/^[A-Z\s]+$/.test(s) && s.length > 2) return false
        if (
          /^(WORK|EDUCATION|EXPERIENCE|PROFESSIONAL|SUMMARY|OBJECTIVE|CERTIFICATIONS|PROJECTS|AWARDS|REFERENCES)/.test(
            s
          )
        )
          return false

        // Skip bullets/numbers
        if (/^\d+$/.test(s)) return false

        // Skip years
        if (/^\d{4}/.test(s)) return false

        return true
      })
      .slice(0, 40) // Limit to 40 skills

    if (skills.length > 0) {
      return skills
    }
  }

  // Strategy 2: Look for keywords in experience section
  const commonSkills = [
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "c#",
    "golang",
    "rust",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "django",
    "flask",
    "fastapi",
    "spring",
    "dot net",
    ".net",
    "sql",
    "mongodb",
    "postgresql",
    "mysql",
    "cassandra",
    "redis",
    "elasticsearch",
    "aws",
    "azure",
    "gcp",
    "google cloud",
    "heroku",
    "docker",
    "kubernetes",
    "terraform",
    "ansible",
    "jenkins",
    "github",
    "gitlab",
    "bitbucket",
    "git",
    "linux",
    "windows",
    "macos",
    "html",
    "css",
    "sass",
    "less",
    "bootstrap",
    "tailwind",
    "webpack",
    "babel",
    "npm",
    "yarn",
    "machine learning",
    "deep learning",
    "ai",
    "nlp",
    "computer vision",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "pandas",
    "numpy",
    "data analysis",
    "data science",
    "analytics",
    "tableau",
    "power bi",
    "looker",
    "excel",
    "sap",
    "salesforce",
    "crm",
    "erp",
    "agile",
    "scrum",
    "kanban",
    "jira",
    "asana",
    "trello",
    "confluence",
    "slack",
    "project management",
    "leadership",
    "communication",
    "teamwork",
    "problem solving",
    "critical thinking",
    "sales",
    "marketing",
    "seo",
    "sem",
    "social media",
    "content marketing",
    "email marketing",
    "public speaking",
    "negotiation",
    "client management",
  ]

  const lowerText = text.toLowerCase()
  const foundSkills = commonSkills
    .filter((skill) => {
      // Better matching: word boundary
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      return regex.test(lowerText)
    })
    .slice(0, 30) // Limit to 30

  if (foundSkills.length > 0) {
    return foundSkills
  }

  return undefined
}

/**
 * Extract education level from resume text
 */
function extractEducationLevel(text: string): string | undefined {
  const educationMap: Record<string, string> = {
    "high school": "High School",
    "h.s.": "High School",
    "hs": "High School",
    "secondary": "High School",
    "associate": "Associate's",
    "a.s.": "Associate's",
    "associate's": "Associate's",
    "bachelor": "Bachelor's",
    "b.s.": "Bachelor's",
    "bs": "Bachelor's",
    "b.a.": "Bachelor's",
    "ba": "Bachelor's",
    "bachelor's": "Bachelor's",
    "undergraduate": "Bachelor's",
    "master": "Master's",
    "m.s.": "Master's",
    "ms": "Master's",
    "m.a.": "Master's",
    "ma": "Master's",
    "m.b.a.": "Master's",
    "mba": "Master's",
    "master's": "Master's",
    "phd": "PhD",
    "ph.d.": "PhD",
    "ph.d": "PhD",
    "doctorate": "PhD",
    "d.phil": "PhD",
    "dphil": "PhD",
    "graduate degree": "Master's",
    "postgraduate": "Master's",
  }

  // Search in EDUCATION section first (more reliable)
  const educationSectionRegex =
    /(?:education|academic|schooling)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|skills|certifications|projects|awards|references|work|employment|\n\n|$))/i
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
 * Only extracts from explicit "Goals" or "Objective" sections
 */
function extractGoals(text: string): string | undefined {
  const goalsRegex =
    /(?:career\s*goals?|goals?|career\s*objective|objective)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|education|skills|work|projects|certifications|professional|summary|employment|\n\n|$))/i

  const matches = text.match(goalsRegex)
  if (matches && matches[1]) {
    const goalsText = matches[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.match(/^[\d•\-*]+$/))
      .slice(0, 3)
      .join(" ")
      .substring(0, 300)

    if (goalsText.length > 10) {
      // Check for future-oriented language
      const futureIndicators =
        /\b(become|transition|grow|advance|move into|pursue|seeking|looking for|aspire|goal|aim|want to|develop|improve|enhance)\b/i
      if (futureIndicators.test(goalsText)) {
        return goalsText
      }
    }
  }

  return undefined
}
