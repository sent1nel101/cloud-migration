/**
 * API Route: POST /api/roadmap
 *
 * Handles career roadmap generation using Claude Haiku AI.
 * Validates user input, calls the AI model, and returns a structured roadmap.
 *
 * Request: CareerInput object
 * Response: Roadmap object or error message
 * Status codes: 200 (success), 400 (validation error), 500 (server error)
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import Anthropic from "@anthropic-ai/sdk"
import { saveRoadmap } from "@/lib/roadmap-service"
import { authOptions } from "@/lib/auth"
import type { CareerInput, Roadmap } from "@/types/index"

// Initialize Anthropic client with API key from environment
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Generates a personalized career roadmap using Claude Haiku AI.
 *
 * The function constructs a detailed prompt with the user's profile,
 * calls Claude API, and parses the JSON response into a typed Roadmap.
 * Includes error handling for JSON parsing and API failures.
 *
 * @param input - User's career information (role, experience, skills, goals)
 * @returns Promise<Roadmap> - AI-generated career roadmap
 * @throws Error if API call fails or response cannot be parsed
 */
async function generateRoadmapWithAI(
  input: CareerInput,
  userTier: string = "FREE"
): Promise<Roadmap> {
  // Customize prompt based on user tier
  const tierGuidance = {
    FREE: "Focus on essential, free resources and general guidance. Limit course recommendations to 3 free options.",
    PROFESSIONAL:
      "Include curated courses and paid resources. Add resume suggestions and portfolio project ideas.",
    PREMIUM:
      "Provide comprehensive guidance including AI resume rewrite examples, LinkedIn optimization tips, and detailed career coaching insights.",
  }

  const guidance =
    tierGuidance[userTier as keyof typeof tierGuidance] || tierGuidance.FREE

  // Calculate timeline based on experience
  const baseMonths = 24
  const experienceFactor = Math.max(0, (10 - input.yearsExperience) * 3)
  const totalMonths = Math.min(48, baseMonths + experienceFactor)

  // Build personalization context with all variables resolved
  const currentRoleRef = input.currentRole
  const goalsRef = input.goals
  const skillsRef = input.skills?.join(", ") || "your existing skills"
  const yearsRef = input.yearsExperience
  const completionDate = new Date(
    Date.now() + totalMonths * 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0]

  // Create the roadmap template with all variables interpolated
  const roadmapTemplate = {
    title: `Career Migration Path: From ${currentRoleRef} to ${goalsRef}, emphasizing ${skillsRef}`,
    summary: `With ${yearsRef} years in ${currentRoleRef}, you have a strong foundation for transitioning to ${goalsRef}. This roadmap leverages your ${skillsRef} while developing new capabilities needed for ${goalsRef} roles. Your background gives you a unique advantage in understanding how to bridge these two career paths.`,
    timeline: {
      total_months: totalMonths,
      start_date: "2024-12-29",
      estimated_completion: completionDate,
    },
    milestones: [
      {
        phase: 1,
        title: `Foundation: Leverage Your ${currentRoleRef} Strengths (Months 1-${Math.ceil(
          totalMonths * 0.2
        )})`,
        description: `Identify which aspects of your ${currentRoleRef} background transfer to ${goalsRef}. Focus on your ${skillsRef} as a foundation.`,
        tasks: [
          `Identify 3-5 specific aspects of ${currentRoleRef} work applicable to ${goalsRef}`,
          `List which of your skills (${skillsRef}) are already valuable for ${goalsRef}`,
          `Research ${goalsRef} roles that specifically value ${currentRoleRef} background`,
          `Join communities focused on ${goalsRef} where ${currentRoleRef} professionals discuss careers`,
          `Find case studies of people transitioning from ${currentRoleRef} to ${goalsRef}`,
        ],
        duration_months: Math.ceil(totalMonths * 0.2),
      },
      {
        phase: 2,
        title: `Build Skills Gaps: ${
          skillsRef.split(",")[0]
        } Skills for ${goalsRef} (Months ${
          Math.ceil(totalMonths * 0.2) + 1
        }-${Math.ceil(totalMonths * 0.5)})`,
        description: `Develop technical and soft skills needed for ${goalsRef} that aren't yet in your toolkit`,
        tasks: [
          `Take 2-3 courses specifically recommended for ${currentRoleRef} → ${goalsRef} transitions`,
          `Apply your ${
            skillsRef.split(",")[0]
          } skills to ${goalsRef}-related projects`,
          `Build your first ${goalsRef}-relevant portfolio project that demonstrates your ${currentRoleRef} advantage`,
          `Connect with mentors in ${goalsRef} who have similar ${currentRoleRef} backgrounds`,
          `Document and share your learning journey in your industry`,
        ],
        duration_months: Math.ceil(totalMonths * 0.3),
      },
      {
        phase: 3,
        title: `Specialize & Differentiate: Advanced ${goalsRef} with Your ${currentRoleRef} Edge (Months ${
          Math.ceil(totalMonths * 0.5) + 1
        }-${Math.ceil(totalMonths * 0.75)})`,
        description: `Build specialized expertise that combines ${goalsRef} knowledge with your unique ${currentRoleRef} perspective`,
        tasks: [
          `Complete advanced certifications in ${goalsRef}`,
          `Build 2-3 portfolio projects showcasing how your ${currentRoleRef} expertise enhances ${goalsRef} outcomes`,
          `Write articles/posts about your unique perspective on ${goalsRef} from a ${currentRoleRef} angle`,
          `Contribute to open-source projects in ${goalsRef}`,
          `Network intensively with ${goalsRef} professionals, highlighting your unique background`,
        ],
        duration_months: Math.ceil(totalMonths * 0.25),
      },
      {
        phase: 4,
        title: `Job Search & Transition: Landing Your ${goalsRef} Role (Months ${
          Math.ceil(totalMonths * 0.75) + 1
        }+)`,
        description: `Position yourself for ${goalsRef} roles that value your ${currentRoleRef} background`,
        tasks: [
          `Tailor your LinkedIn profile to highlight ${goalsRef} while showcasing your ${currentRoleRef} experience as an advantage`,
          `Reframe your resume to show progression toward ${goalsRef} with your ${currentRoleRef} skills as foundation`,
          `Target companies that need ${currentRoleRef} professionals transitioning to ${goalsRef}`,
          `Practice interviews emphasizing how ${currentRoleRef} experience prepared you for ${goalsRef}`,
          `Negotiate roles that value your dual expertise in ${currentRoleRef} and ${goalsRef}`,
        ],
        duration_months: Math.ceil(totalMonths * 0.25),
      },
    ],
    skill_gaps: [
      `Advanced proficiency in ${goalsRef}-specific tools and platforms`,
      `Deep industry knowledge specific to ${goalsRef}`,
      `Soft skills highly valued in ${goalsRef} industry`,
      `Certifications or credentials specific to ${goalsRef}`,
      `${yearsRef}+ years of practical experience in ${goalsRef} (your ${currentRoleRef} background helps offset this)`,
      `Understanding of how ${goalsRef} applies to your current ${currentRoleRef} domain`,
    ],
    recommended_roles: [
      {
        title: `${currentRoleRef} + ${goalsRef} Hybrid Role`,
        description: `Leverage your ${currentRoleRef} expertise while integrating ${goalsRef} skills - unique value proposition`,
        demand: "Very High",
        salary_range: "$85K - $130K+",
      },
      {
        title: `${goalsRef} Specialist (Entry to Mid-Level)`,
        description: `Transition into dedicated ${goalsRef} roles - companies value your ${currentRoleRef} background`,
        demand: "High",
        salary_range: "$90K - $140K",
      },
      {
        title: `${currentRoleRef} → ${goalsRef} Bridge Role`,
        description: `Rare hybrid roles combining ${currentRoleRef} expertise with ${goalsRef} focus - highest salary potential`,
        demand: "Very High (but rare)",
        salary_range: "$110K - $160K+",
      },
      {
        title: `${goalsRef} in Your ${currentRoleRef} Industry`,
        description: `Apply ${goalsRef} expertise to your current industry where ${currentRoleRef} background is highly valuable`,
        demand: "High",
        salary_range: "$95K - $145K",
      },
    ],
    resource_categories: {
      courses: {
        essential: [
          `Foundational ${goalsRef} course for ${currentRoleRef} professionals`,
          `How to apply your ${skillsRef.split(",")[0]} to ${goalsRef}`,
          `${goalsRef}-specific training relevant to your ${currentRoleRef} domain`,
          `Advanced ${goalsRef} course leveraging your ${yearsRef} years of ${currentRoleRef} experience`,
          `Project-based ${goalsRef} course combining ${currentRoleRef} and ${goalsRef}`,
        ],
        advanced: [
          `Advanced ${goalsRef} certification for ${currentRoleRef} professionals`,
          `${goalsRef} strategy and architecture course`,
          `Leadership in ${goalsRef} for experienced professionals`,
        ],
      },
      certifications: [
        `Certification bridging ${currentRoleRef} and ${goalsRef}`,
        `Industry-standard ${goalsRef} certification`,
        `Leadership certification in ${goalsRef}`,
      ],
      communities: [
        `Communities for ${currentRoleRef} professionals transitioning to ${goalsRef}`,
        `${goalsRef} communities where ${currentRoleRef} professionals gather`,
        `Industry-specific ${goalsRef} groups`,
        `Networking groups for ${currentRoleRef} → ${goalsRef} transitions`,
        `Local meetups for ${goalsRef} professionals with diverse ${currentRoleRef} backgrounds`,
      ],
    },
    professional_tier_content: {
      curated_courses: [
        `Advanced ${goalsRef} courses specifically for ${currentRoleRef} professionals`,
        `Leveraging ${yearsRef} years of ${currentRoleRef} experience in ${goalsRef} roles`,
        `${goalsRef} courses building on your ${skillsRef}`,
        `Industry certifications recognizing your ${currentRoleRef} background`,
        `Specialized ${goalsRef} training for career switchers with your profile`,
      ],
      resume_suggestions: [
        `Frame your ${yearsRef} years in ${currentRoleRef} as preparation for ${goalsRef} (progression, not pivot)`,
        `Highlight ${currentRoleRef} projects demonstrating ${goalsRef}-relevant skills`,
        `Use metrics from ${currentRoleRef} that matter in ${goalsRef} industry`,
        `Show moments where you applied ${goalsRef} thinking to ${currentRoleRef} problems`,
        `Include ${goalsRef} side projects and certifications alongside ${currentRoleRef} achievements`,
      ],
      portfolio_ideas: [
        `Create a ${goalsRef} project solving a real problem in your ${currentRoleRef} domain`,
        `Build 2-3 case studies showing how ${goalsRef} improves ${currentRoleRef} workflows`,
        `Document your ${currentRoleRef} → ${goalsRef} transition journey`,
        `Contribute to open-source ${goalsRef} projects with your ${currentRoleRef} perspective`,
        `Create thought leadership at the intersection of ${currentRoleRef} and ${goalsRef}`,
      ],
    },
    premium_tier_content: {
      ai_resume_rewrite: `Transform your resume to position your ${yearsRef} years in ${currentRoleRef} as a competitive advantage for ${goalsRef} roles. Highlight ${skillsRef} through metrics-driven achievement statements. Show clear progression toward ${goalsRef} with ${currentRoleRef} as your foundation, not a obstacle. Position you as the bridge companies need between ${currentRoleRef} and ${goalsRef} domains.`,
      linkedin_optimization: [
        `Headline: "${currentRoleRef} Expert Transitioning to ${goalsRef}" - expert integrating new skills, not a career changer`,
        `About: Tell why ${goalsRef} is the natural next step from ${currentRoleRef}, emphasizing your unique perspective`,
        `Experience: Reframe ${currentRoleRef} achievements through ${goalsRef} lens, showing foresight`,
        `Skills: Prioritize both ${currentRoleRef} AND ${goalsRef} to show integrated expertise`,
        `Featured: Showcase ${goalsRef} projects alongside ${currentRoleRef} achievements`,
      ],
      career_coaching_insights: [
        `Timing: You're ready to transition to ${goalsRef} after ${yearsRef} years in ${currentRoleRef} - you have credibility AND differentiation`,
        `Salary: Position your ${currentRoleRef} background as adding $10-20K premium in ${goalsRef} roles`,
        `Job search: Focus on companies in your current ${currentRoleRef} industry embracing ${goalsRef}`,
        `Interviews: Lead with ${currentRoleRef} achievements, pivot to ${goalsRef} passion, emphasize fresh perspective`,
        `Networking: Connect ${currentRoleRef} peers with ${goalsRef} professionals - become the bridge`,
      ],
    },
    next_steps: [
      `This week: Identify 3-5 specific aspects of ${currentRoleRef} work that transfer to ${goalsRef}`,
      `This week: Research case studies of ${currentRoleRef} professionals who transitioned to ${goalsRef}`,
      `Next 2 weeks: Enroll in foundational ${goalsRef} course for professionals like you`,
      `Next 2 weeks: Connect with 3-5 people in ${goalsRef} who have ${currentRoleRef} backgrounds`,
      `Next month: Start your first ${goalsRef} project using your ${skillsRef}`,
      `Next month: Update LinkedIn to highlight your ${currentRoleRef} → ${goalsRef} journey`,
      `Ongoing: Document your journey publicly (blog, social media, portfolio)`,
    ],
  }

  // Convert template to JSON string for the prompt
  const roadmapJSON = JSON.stringify(roadmapTemplate, null, 2)

  const prompt = `Output ONLY valid JSON. No explanation. No summary. Only JSON.

Personalize this JSON for:
- Role: ${currentRoleRef}
- Experience: ${yearsRef} years
- Skills: ${skillsRef}
- Goal: ${goalsRef}

${guidance}

Make EVERY field specific to this person. Return the JSON below, modified to match their situation exactly:

${roadmapJSON}`

  try {
    console.log("=== ROADMAP GENERATION DEBUG ===")
    console.log("Input Data:", {
      currentRole: input.currentRole,
      yearsExperience: input.yearsExperience,
      skills: input.skills,
      goals: input.goals,
      educationLevel: input.educationLevel,
    })
    console.log("User Tier:", userTier)
    console.log("Tier Guidance:", guidance)
    console.log("Prompt Length:", prompt.length, "characters")
    console.log("Prompt Preview (first 500 chars):", prompt.substring(0, 500))
    console.log("================================")
    console.log("Calling Claude API...")

    // Call Claude Haiku API with career roadmap prompt
    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    console.log("Claude response received")

    // Extract text content from API response
    // Claude returns content as array; we take the first text block
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : ""

    console.log("Response length:", responseText.length)
    console.log("Response preview:", responseText.substring(0, 200))

    // Clean up response - Claude may wrap JSON in markdown code blocks
    // This removes ```json or ``` wrappers if present
    let cleanedText = responseText.trim()

    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\n/, "").replace(/\n```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\n/, "").replace(/\n```$/, "")
    }

    cleanedText = cleanedText.trim()

    console.log("Cleaned text preview:", cleanedText.substring(0, 200))
    console.log("Full cleaned response (first 500 chars):", cleanedText.substring(0, 500))

    // Try to extract JSON if it's wrapped in other text
    let jsonText = cleanedText
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
      console.log("Extracted JSON from wrapped response")
    }

    // Parse cleaned JSON string
    const parsed = JSON.parse(jsonText)

    console.log("JSON parsed successfully")
    console.log("Parsed keys:", Object.keys(parsed))

    // Ensure all required fields exist with defaults
    const roadmap: Roadmap = {
      title: parsed.title || "Career Roadmap",
      summary: parsed.summary || "Your personalized career path",
      timeline: parsed.timeline || {
        total_months: 24,
        start_date: "2024-12-29",
        estimated_completion: new Date(
          Date.now() + 24 * 30 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
      },
      milestones: parsed.milestones || [],
      skill_gaps: parsed.skill_gaps || [],
      recommended_roles: parsed.recommended_roles || [],
      resource_categories: parsed.resource_categories || {
        courses: { essential: [], advanced: [] },
        certifications: [],
        communities: [],
      },
      next_steps: parsed.next_steps || [],
      professional_tier_content: parsed.professional_tier_content,
      premium_tier_content: parsed.premium_tier_content,
    }

    console.log("Roadmap structure ensured")
    console.log("Has skill_gaps?", roadmap.skill_gaps.length > 0)
    console.log("Has milestones?", roadmap.milestones.length > 0)
    console.log("Has resource_categories?", !!roadmap.resource_categories)
    return roadmap
  } catch (error) {
    console.error("Error in generateRoadmapWithAI:", error)
    if (error instanceof SyntaxError) {
      console.error("JSON parsing error - response may not be valid JSON")
    }
    throw error
  }
}

/**
 * POST /api/roadmap
 *
 * Main API endpoint handler. Processes incoming CareerInput,
 * validates data, and returns AI-generated Roadmap.
 *
 * @param request - NextRequest containing CareerInput JSON body
 * @returns NextResponse with Roadmap (200) or error message (400/500)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body as CareerInput type
    const body = (await request.json()) as CareerInput

    console.log("Received request for:", body.currentRole)

    // Validate required fields
    if (!body.currentRole || body.yearsExperience === undefined) {
      console.log("Validation failed: missing required fields")
      return NextResponse.json(
        { error: "Missing required fields: currentRole, yearsExperience" },
        { status: 400 }
      )
    }

    // Validate experience range (0-70 years is realistic)
    if (body.yearsExperience < 0 || body.yearsExperience > 70) {
      console.log("Validation failed: invalid experience")
      return NextResponse.json(
        { error: "Years of experience must be between 0 and 70" },
        { status: 400 }
      )
    }

    // Get user session (optional - if not logged in, roadmap is generated but not saved)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const userTier = (session?.user as any)?.tier || "FREE"

    console.log("Session user:", session?.user)
    console.log("UserId from session:", userId)
    console.log("User tier:", userTier)

    // Generate personalized roadmap using Claude AI with tier-specific content
    const roadmap = await generateRoadmapWithAI(body, userTier)

    // Save roadmap to database if user is authenticated
    let savedRoadmap = null
    if (userId) {
      try {
        const roadmapContent = JSON.stringify(roadmap)
        savedRoadmap = await saveRoadmap(
          userId,
          {
            currentRole: body.currentRole,
            targetRole: roadmap.title, // Use title as target role reference
            experience: body.yearsExperience,
            skills: body.skills || [],
          },
          roadmapContent,
          `${body.currentRole} → AI Role`
        )
        console.log("Roadmap saved to database:", savedRoadmap.id)
      } catch (dbError) {
        console.error("Error saving roadmap to database:", dbError)
        // Continue with response even if save fails
      }
    }

    console.log("Sending response with roadmap")
    return NextResponse.json(
      {
        ...roadmap,
        roadmapId: savedRoadmap?.id, // Include ID if saved
      },
      { status: 200 }
    )
  } catch (error) {
    // Comprehensive error handling with specific messages
    console.error("Error in roadmap generation:", error)

    let errorMessage = "Failed to generate roadmap. Please try again."

    // Distinguish between parsing errors and API errors
    if (error instanceof SyntaxError) {
      errorMessage = "Failed to parse AI response. Please try again."
    } else if (error instanceof Error) {
      // Check for API-specific errors (invalid key, quota exceeded, etc.)
      if (error.message.includes("API")) {
        errorMessage =
          "API error. Check your key and quotas at console.anthropic.com"
      }
      console.error("Error message:", error.message)
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
