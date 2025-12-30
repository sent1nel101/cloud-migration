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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { saveRoadmap } from "@/lib/roadmap-service";
import { authOptions } from "@/lib/auth";
import type { CareerInput, Roadmap } from "@/types/index";

// Initialize Anthropic client with API key from environment
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
async function generateRoadmapWithAI(input: CareerInput): Promise<Roadmap> {
  const prompt = `You are an expert career coach specializing in helping professionals transition into AI-resilient careers.

STRICT REQUIREMENT: You MUST respond with ONLY a valid JSON object. No markdown, no code blocks, no explanations. Start with { and end with }

User Profile:
- Current Role: ${input.currentRole}
- Years of Experience: ${input.yearsExperience}
- Top Skills: ${input.skills?.join(", ") || "Not specified"}
- Career Goals: ${input.goals}
- Education Level: ${input.educationLevel || "Not specified"}

Generate a JSON roadmap with EXACTLY this structure:

{
  "title": "Career Migration Path: [Current Role] → [Target Role]",
  "summary": "2-3 sentence overview of the transition path",
  "timeline": {
    "total_months": ${Math.min(48, 24 + (10 - input.yearsExperience) * 3)},
    "start_date": "2024-12-29",
    "estimated_completion": "2027-12-29"
  },
  "milestones": [
    {
      "phase": 1,
      "title": "Foundation: AI Literacy & Assessment (Months 1-3)",
      "description": "Build foundational understanding of AI and identify transferable skills",
      "tasks": [
        "Complete 'AI for Everyone' course on Coursera (free)",
        "Research 3-5 AI roles that match your background",
        "Identify which current skills transfer to AI roles",
        "Set up GitHub account for portfolio projects",
        "Join AI communities: r/learnprogramming, r/MachineLearning on Reddit"
      ],
      "duration_months": 3
    },
    {
      "phase": 2,
      "title": "Technical Skill Building (Months 4-9)",
      "description": "Develop practical technical skills for AI roles",
      "tasks": [
        "Complete Python for Data Science course (Coursera or Udacity)",
        "Learn SQL basics for data querying",
        "Complete ChatGPT/Prompt Engineering fundamentals course",
        "Build first portfolio project using AI",
        "Learn Excel advanced functions",
        "Start open-source contributions"
      ],
      "duration_months": 6
    },
    {
      "phase": 3,
      "title": "Specialization & Portfolio (Months 10-18)",
      "description": "Deepen expertise and build professional portfolio",
      "tasks": [
        "Complete certification (Google Cloud AI, AWS ML, or IBM AI)",
        "Build 2-3 advanced portfolio projects",
        "Write technical blog posts about your learning",
        "Practice technical interviews",
        "Network on LinkedIn with AI professionals",
        "Gain freelance experience with AI projects"
      ],
      "duration_months": 9
    },
    {
      "phase": 4,
      "title": "Job Search & Transition (Months 19+)",
      "description": "Position yourself and secure a role in target career",
      "tasks": [
        "Optimize LinkedIn profile for AI roles",
        "Tailor resume with AI projects and skills",
        "Apply to entry-level AI/ML positions",
        "Prepare for technical interviews",
        "Negotiate compensation package",
        "Plan transition strategy"
      ],
      "duration_months": 6
    }
  ],
  "skill_gaps": [
    "Python programming",
    "Data analysis and SQL",
    "Machine learning fundamentals",
    "Statistics and mathematics",
    "Cloud platforms (AWS/GCP/Azure)",
    "AI tool proficiency (ChatGPT, Claude, etc.)"
  ],
  "recommended_roles": [
    {
      "title": "AI-Enhanced [Your Current Role]",
      "description": "Leverage current expertise while integrating AI tools",
      "demand": "Very High",
      "salary_range": "$85K - $130K"
    },
    {
      "title": "Prompt Engineer / AI Specialist",
      "description": "Design and optimize AI model usage for organizations",
      "demand": "Very High",
      "salary_range": "$100K - $160K"
    },
    {
      "title": "Data Analyst (AI-Focused)",
      "description": "Analyze data and work with AI-generated insights",
      "demand": "High",
      "salary_range": "$90K - $140K"
    },
    {
      "title": "AI Training Specialist",
      "description": "Help train and evaluate AI models",
      "demand": "High",
      "salary_range": "$70K - $110K"
    }
  ],
  "resource_categories": {
    "courses": {
      "essential": [
        "AI for Everyone by Andrew Ng (Coursera) - FREE",
        "Prompt Engineering by OpenAI/Anthropic - FREE",
        "Python for Everybody - FREE",
        "Google Cloud Skills Boost",
        "AWS Machine Learning"
      ],
      "advanced": [
        "Deep Learning Specialization by Andrew Ng",
        "ML Engineering for Production",
        "Advanced Python for Data Science"
      ]
    },
    "certifications": [
      "Google Cloud Associate Cloud Engineer",
      "AWS Certified ML - Specialty",
      "IBM AI Engineering Professional Certificate",
      "Microsoft Azure AI Engineer Associate"
    ],
    "communities": [
      "r/learnprogramming and r/MachineLearning (Reddit)",
      "AI Discord servers (OpenAI, Anthropic communities)",
      "LinkedIn AI/ML groups and professionals",
      "Kaggle community for competitions",
      "Local AI/ML meetups"
    ]
  },
  "next_steps": [
    "Enroll in 'AI for Everyone' course this week",
    "Set up GitHub account and make first commit",
    "Join at least 2 online communities",
    "Plan your learning schedule (5-10 hours per week)",
    "Identify 3 AI roles that excite you",
    "Research companies hiring for those roles",
    "Document your learning journey"
  ]
}`;

  try {
    console.log("Calling Claude API...");
    
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
    });

    console.log("Claude response received");

    // Extract text content from API response
    // Claude returns content as array; we take the first text block
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    console.log("Response length:", responseText.length);
    console.log("Response preview:", responseText.substring(0, 200));

    // Clean up response - Claude may wrap JSON in markdown code blocks
    // This removes ```json or ``` wrappers if present
    let cleanedText = responseText.trim();
    
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    cleanedText = cleanedText.trim();

    console.log("Cleaned text preview:", cleanedText.substring(0, 200));

    // Parse cleaned JSON string into typed Roadmap object
    const roadmap: Roadmap = JSON.parse(cleanedText);
    
    console.log("Roadmap parsed successfully");
    return roadmap;
  } catch (error) {
    console.error("Error in generateRoadmapWithAI:", error);
    if (error instanceof SyntaxError) {
      console.error("JSON parsing error - response may not be valid JSON");
    }
    throw error;
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
    const body = (await request.json()) as CareerInput;

    console.log("Received request for:", body.currentRole);

    // Validate required fields
    if (!body.currentRole || body.yearsExperience === undefined) {
      console.log("Validation failed: missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: currentRole, yearsExperience" },
        { status: 400 }
      );
    }

    // Validate experience range (0-70 years is realistic)
    if (body.yearsExperience < 0 || body.yearsExperience > 70) {
      console.log("Validation failed: invalid experience");
      return NextResponse.json(
        { error: "Years of experience must be between 0 and 70" },
        { status: 400 }
      );
    }

    // Get user session (optional - if not logged in, roadmap is generated but not saved)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    console.log("Session user:", session?.user);
    console.log("UserId from session:", userId);

    // Generate personalized roadmap using Claude AI
    const roadmap = await generateRoadmapWithAI(body);

    // Save roadmap to database if user is authenticated
    let savedRoadmap = null;
    if (userId) {
      try {
        const roadmapContent = JSON.stringify(roadmap);
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
        );
        console.log("Roadmap saved to database:", savedRoadmap.id);
      } catch (dbError) {
        console.error("Error saving roadmap to database:", dbError);
        // Continue with response even if save fails
      }
    }

    console.log("Sending response with roadmap");
    return NextResponse.json(
      {
        ...roadmap,
        roadmapId: savedRoadmap?.id, // Include ID if saved
      },
      { status: 200 }
    );
  } catch (error) {
    // Comprehensive error handling with specific messages
    console.error("Error in roadmap generation:", error);

    let errorMessage = "Failed to generate roadmap. Please try again.";

    // Distinguish between parsing errors and API errors
    if (error instanceof SyntaxError) {
      errorMessage = "Failed to parse AI response. Please try again.";
    } else if (error instanceof Error) {
      // Check for API-specific errors (invalid key, quota exceeded, etc.)
      if (error.message.includes("API")) {
        errorMessage =
          "API error. Check your key and quotas at console.anthropic.com";
      }
      console.error("Error message:", error.message);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
