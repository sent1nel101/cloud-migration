/**
 * API Route: POST /api/roadmap
 *
 * Handles career roadmap generation. Validates user input, serves cached
 * role-pair content when available, otherwise asks Claude for a slim
 * role-specific payload, then stitches it into a code-built roadmap.
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
import { prisma } from "@/lib/prisma"
import {
  checkRateLimit,
  ROADMAP_RATE_LIMITS,
  getRateLimitIdentifier,
  getClientIp,
} from "@/lib/rate-limiter"
import {
  buildContentPrompt,
  buildRoadmap,
  isCompleteAIContent,
  parseAIContent,
  ROADMAP_CONTENT_TOOL,
  type RoadmapAIContent,
} from "@/lib/roadmap-builder"
import {
  getCachedRoadmapContent,
  saveRoadmapContentToCache,
} from "@/lib/roadmap-cache"
import type { CareerInput, Roadmap } from "@/types/index"

// Initialize Anthropic client with API key from environment
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Single place to change the model. claude-3-haiku-20240307 was retired on
// 2026-04-19, so the default is the current Haiku.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5"

const FALLBACK_TARGET_ROLE = "Career Transition Specialist"

/**
 * Extracts a target role from the user's goal statement.
 * Uses Claude to infer a specific job title that matches the goals.
 *
 * @param goals - User's career goals statement
 * @param currentRole - User's current role (for context)
 * @returns Promise<string> - Inferred target role name
 */
async function extractTargetRoleFromGoals(
  goals: string,
  currentRole: string,
): Promise<string> {
  if (!goals?.trim()) return FALLBACK_TARGET_ROLE

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 20,
      messages: [
        {
          role: "user",
          content: `Given a user's career goals, extract ONE specific job title they are likely aiming for.

Current Role: ${currentRole}
Career Goals: ${goals}

Respond with ONLY a specific job title (2-4 words max), nothing else.
Examples: "Data Scientist", "Product Manager", "Machine Learning Engineer", "UX Designer"`,
        },
      ],
    })

    const targetRole = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .replace(/["'`]/g, "")
      .trim()

    return targetRole || FALLBACK_TARGET_ROLE
  } catch (error) {
    console.error("Error extracting target role:", error)
    return FALLBACK_TARGET_ROLE
  }
}

/**
 * Asks Claude for the role-specific roadmap content only (RoadmapAIContent).
 * Forced tool use returns a parsed object, so no JSON cleanup is needed.
 * Returns only the sections that passed validation (possibly none).
 */
async function fetchRoadmapContent(
  currentRole: string,
  targetRole: string,
): Promise<Partial<RoadmapAIContent>> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    tools: [ROADMAP_CONTENT_TOOL],
    tool_choice: { type: "tool", name: ROADMAP_CONTENT_TOOL.name },
    messages: [
      { role: "user", content: buildContentPrompt(currentRole, targetRole) },
    ],
  })

  console.log("Roadmap content usage:", {
    model: message.model,
    input_tokens: message.usage.input_tokens,
    output_tokens: message.usage.output_tokens,
    stop_reason: message.stop_reason,
  })

  if (message.stop_reason === "max_tokens") {
    console.warn("Roadmap content truncated at max_tokens; using template")
    return {}
  }

  const toolUse = message.content.find((block) => block.type === "tool_use")
  return parseAIContent(toolUse?.input)
}

/**
 * Generates a personalized career roadmap.
 *
 * Flow: extract target role -> cache lookup (currentRole + targetRole) ->
 * on miss, fetch slim AI content and cache it -> stitch into the code-built
 * template with the user's personal details.
 *
 * @param input - User's career information (role, experience, skills, goals)
 * @param userTier - FREE | PROFESSIONAL | PREMIUM
 * @returns The roadmap, the resolved target role, and whether the cache hit
 */
async function generateRoadmapWithAI(
  input: CareerInput,
  userTier: string = "FREE",
): Promise<{ roadmap: Roadmap; targetRole: string; cacheHit: boolean }> {
  const targetRole = await extractTargetRoleFromGoals(
    input.goals,
    input.currentRole,
  )

  console.log("=== ROADMAP GENERATION ===")
  console.log("Current role:", input.currentRole, "| Target role:", targetRole)
  console.log("User Tier:", userTier)

  const cached = await getCachedRoadmapContent(input.currentRole, targetRole)
  if (cached) {
    console.log("Roadmap cache HIT - no AI call needed")
    return {
      roadmap: buildRoadmap(input, targetRole, cached, userTier),
      targetRole,
      cacheHit: true,
    }
  }

  console.log("Roadmap cache MISS - calling Claude")
  let aiContent: Partial<RoadmapAIContent> = {}
  try {
    aiContent = await fetchRoadmapContent(input.currentRole, targetRole)
  } catch (error) {
    // Degrade to the template rather than failing the request
    console.error("Error fetching roadmap content from Claude:", error)
  }

  // Only cache complete content; partial results get regenerated next time
  if (isCompleteAIContent(aiContent)) {
    await saveRoadmapContentToCache(
      input.currentRole,
      targetRole,
      aiContent,
      MODEL,
    )
  }

  return {
    roadmap: buildRoadmap(input, targetRole, aiContent, userTier),
    targetRole,
    cacheHit: false,
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
    // Get session for authentication
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const ipAddress = getClientIp(request)

    // Apply rate limiting
    const identifier = getRateLimitIdentifier(userId, ipAddress)
    const config = userId
      ? ROADMAP_RATE_LIMITS.authenticated
      : ROADMAP_RATE_LIMITS.unauthenticated
    const rateLimitResult = checkRateLimit(identifier, config)

    // Return 429 if rate limited
    if (!rateLimitResult.allowed) {
      console.log(
        `Rate limit exceeded for ${identifier}: ${rateLimitResult.resetIn}ms remaining`,
      )
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil(rateLimitResult.resetIn / 1000),
        },
        {
          status: 429,
          headers: { "Retry-After": rateLimitResult.resetIn.toString() },
        },
      )
    }

    console.log(
      `Rate limit check passed for ${identifier}: ${rateLimitResult.remaining} requests remaining`,
    )

    // Parse request body as CareerInput type
    const body = (await request.json()) as CareerInput

    console.log("Received request for:", body.currentRole)

    // Validate required fields
    if (!body.currentRole || body.yearsExperience === undefined) {
      console.log("Validation failed: missing required fields")
      return NextResponse.json(
        { error: "Missing required fields: currentRole, yearsExperience" },
        { status: 400 },
      )
    }

    // Validate experience range (0-70 years is realistic)
    if (body.yearsExperience < 0 || body.yearsExperience > 70) {
      console.log("Validation failed: invalid experience")
      return NextResponse.json(
        { error: "Years of experience must be between 0 and 70" },
        { status: 400 },
      )
    }

    // Get user tier from session, but verify from database for authenticated users
    let userTier = (session?.user as any)?.tier || "FREE"

    console.log("=== ROADMAP GENERATION - USER TIER ===")
    console.log("Session user:", session?.user?.email)
    console.log("UserId from session:", userId)
    console.log("User tier from session:", userTier)

    // Always fetch fresh tier from database for authenticated users
    if (userId) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { tier: true },
        })
        if (dbUser) {
          if (dbUser.tier !== userTier) {
            console.log(
              `⚠️ Session tier was stale! Updated from ${userTier} to ${dbUser.tier}`,
            )
          }
          userTier = dbUser.tier
        }
      } catch (e) {
        console.error("Could not fetch fresh tier from database:", e)
      }
    }

    console.log("Final user tier for roadmap:", userTier)
    console.log("=====================================")

    // Generate personalized roadmap (cache first, then Claude)
    const { roadmap, targetRole, cacheHit } = await generateRoadmapWithAI(
      body,
      userTier,
    )

    // Save roadmap to database if user is authenticated
    let savedRoadmap = null
    if (userId) {
      try {
        console.log("Attempting to save roadmap for user:", userId)
        const roadmapContent = JSON.stringify(roadmap)
        savedRoadmap = await saveRoadmap(
          userId,
          {
            currentRole: body.currentRole,
            targetRole,
            experience: body.yearsExperience,
            skills: body.skills || [],
            goals: body.goals || "", // Save original goals for later editing
            education: body.educationLevel || undefined, // Save education for later editing
          },
          roadmapContent,
          `${body.currentRole} → ${targetRole}`,
        )
        console.log("✅ Roadmap saved successfully:", savedRoadmap.id)
      } catch (dbError) {
        console.error("❌ Error saving roadmap to database:", dbError)
        // Log detailed error info
        if (dbError instanceof Error) {
          console.error("Error details:", dbError.message)
        }
        // Continue with response even if save fails
      }
    } else {
      console.log(
        "User not authenticated, roadmap not saved to database (guest generation)",
      )
    }

    console.log("Sending response with roadmap")
    return NextResponse.json(
      {
        ...roadmap,
        roadmapId: savedRoadmap?.id, // Include ID if saved
      },
      { status: 200, headers: { "X-Roadmap-Cache": cacheHit ? "HIT" : "MISS" } },
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
