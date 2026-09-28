/**
 * Roadmap Builder
 *
 * Builds the full Roadmap object in code. Claude only supplies the small set of
 * role-specific values (RoadmapAIContent); every static label, title, timeline,
 * and tier section is constructed here. Keeping the AI output small cuts output
 * tokens (the expensive side of the bill) and response latency.
 *
 * RoadmapAIContent depends only on (currentRole, targetRole), so it is safe to
 * cache and reuse across users - see lib/roadmap-cache.ts. Personal details
 * (years, skills, goals) are stitched in here and never cached.
 */

import { z } from "zod"
import type Anthropic from "@anthropic-ai/sdk"
import { getResourcesForRole } from "@/lib/resources"
import type {
  CareerInput,
  CertificationWithROI,
  Milestone,
  RecommendedRole,
  Roadmap,
} from "@/types/index"

/** Number of roadmap phases. Phase titles/durations are built in code. */
export const PHASE_COUNT = 4

// ---------------------------------------------------------------------------
// AI content schema (the only part Claude generates)
// ---------------------------------------------------------------------------

const milestoneContentSchema = z.object({
  description: z.string().min(1),
  tasks: z.array(z.string().min(1)).min(1),
})

const recommendedRoleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  demand: z.string().min(1),
  salary_range: z.string().min(1),
})

const certificationSchema = z.object({
  cert: z.string().min(1),
  roi: z.number(),
  cost: z.number(),
  salary_impact: z.string().min(1),
  time_months: z.number(),
})

/** Per-section validators. Each section is validated independently so one bad
 * section falls back to the template without discarding the rest. */
const sectionSchemas = {
  milestones: z.array(milestoneContentSchema).min(PHASE_COUNT),
  skill_gaps: z.array(z.string().min(1)).min(1),
  recommended_roles: z.array(recommendedRoleSchema).min(1),
  courses: z.object({
    essential: z.array(z.string().min(1)).min(1),
    advanced: z.array(z.string().min(1)).min(1),
  }),
  certifications: z.array(certificationSchema).min(1),
  communities: z.array(z.string().min(1)).min(1),
}

export interface RoadmapAIContent {
  milestones: { description: string; tasks: string[] }[]
  skill_gaps: string[]
  recommended_roles: RecommendedRole[]
  courses: { essential: string[]; advanced: string[] }
  certifications: CertificationWithROI[]
  communities: string[]
}

type Section = keyof RoadmapAIContent
const SECTIONS = Object.keys(sectionSchemas) as Section[]

const stringArray = { type: "array", items: { type: "string" } } as const

/**
 * Tool definition used to force Claude to return RoadmapAIContent as a
 * structured object (no markdown fences, no free-text JSON parsing).
 */
export const ROADMAP_CONTENT_TOOL: Anthropic.Tool = {
  name: "submit_roadmap_content",
  description:
    "Submit the role-specific content for a career transition roadmap.",
  input_schema: {
    type: "object",
    properties: {
      milestones: {
        type: "array",
        description: `Exactly ${PHASE_COUNT} phases in order: 1) foundation / transferable strengths, 2) build skill gaps, 3) specialize & differentiate, 4) job search & transition.`,
        items: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "Phase objective, max 20 words.",
            },
            tasks: {
              ...stringArray,
              description: "4 concrete actions, max 12 words each.",
            },
          },
          required: ["description", "tasks"],
        },
      },
      skill_gaps: {
        ...stringArray,
        description: "5 specific skills, tools, or credentials to gain, max 8 words each.",
      },
      recommended_roles: {
        type: "array",
        description: "4 realistic job titles for this transition.",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string", description: "Max 15 words." },
            demand: {
              type: "string",
              enum: ["Very High", "High", "Medium", "Low"],
            },
            salary_range: {
              type: "string",
              description: 'US range, e.g. "$90K - $130K".',
            },
          },
          required: ["title", "description", "demand", "salary_range"],
        },
      },
      courses: {
        type: "object",
        properties: {
          essential: {
            ...stringArray,
            description: "4 real courses or training programs (online, college, apprenticeship, or employer-based) with provider.",
          },
          advanced: {
            ...stringArray,
            description: "2 real advanced courses or programs with provider.",
          },
        },
        required: ["essential", "advanced"],
      },
      certifications: {
        type: "array",
        description: "3 real certifications, licenses, or credentials used in this field (e.g. professional designations, state licenses, trade certificates).",
        items: {
          type: "object",
          properties: {
            cert: { type: "string" },
            roi: { type: "number", description: "ROI score 0-100." },
            cost: { type: "number", description: "Typical cost in USD." },
            salary_impact: {
              type: "string",
              description: 'e.g. "+$10K".',
            },
            time_months: { type: "number" },
          },
          required: ["cert", "roi", "cost", "salary_impact", "time_months"],
        },
      },
      communities: {
        ...stringArray,
        description: "4 real professional associations, communities, or groups by name.",
      },
    },
    required: SECTIONS,
  },
}

/**
 * Builds the short user prompt for the content call. Only the two roles are
 * sent, so the result is reusable for anyone with the same role pair.
 */
export function buildContentPrompt(
  currentRole: string,
  targetRole: string,
): string {
  return `Career transition: "${currentRole}" -> "${targetRole}".
This can be any industry (healthcare, trades, education, business, creative, public service, tech, etc.); do not assume a tech career.
Call submit_roadmap_content with content specific to this transition. Be concise and concrete; respect the word limits.`
}

/**
 * Validates raw tool input from Claude section by section.
 * Returns only the sections that passed validation.
 */
export function parseAIContent(raw: unknown): Partial<RoadmapAIContent> {
  if (typeof raw !== "object" || raw === null) return {}
  const input = raw as Record<string, unknown>
  const result: Partial<RoadmapAIContent> = {}

  for (const section of SECTIONS) {
    const parsed = sectionSchemas[section].safeParse(input[section])
    if (parsed.success) {
      ;(result as Record<Section, unknown>)[section] = parsed.data
    } else {
      console.warn(`AI content section "${section}" invalid, using template`)
    }
  }

  if (result.milestones) {
    result.milestones = result.milestones.slice(0, PHASE_COUNT)
  }
  return result
}

/** True when every section is present (safe to cache). */
export function isCompleteAIContent(
  content: Partial<RoadmapAIContent>,
): content is RoadmapAIContent {
  return SECTIONS.every((section) => content[section] !== undefined)
}

// ---------------------------------------------------------------------------
// Template (code-built content and per-section fallbacks)
// ---------------------------------------------------------------------------

interface BuildContext {
  currentRole: string
  targetRole: string
  skills: string
  primarySkill: string
  years: number
  goals: string
  totalMonths: number
}

function createContext(input: CareerInput, targetRole: string): BuildContext {
  const skills = input.skills?.length
    ? input.skills.join(", ")
    : "your existing skills"
  const baseMonths = 24
  const experienceFactor = Math.max(0, (10 - input.yearsExperience) * 3)

  return {
    currentRole: input.currentRole,
    targetRole,
    skills,
    primarySkill: skills.split(",")[0].trim(),
    years: input.yearsExperience,
    goals: input.goals || `move into ${targetRole}`,
    totalMonths: Math.min(48, baseMonths + experienceFactor),
  }
}

/** Template fallback for every AI section, used when Claude is unavailable or
 * a section fails validation. */
function templateAIContent(ctx: BuildContext): RoadmapAIContent {
  const { currentRole, targetRole, skills, primarySkill, years } = ctx

  return {
    milestones: [
      {
        description: `Identify which aspects of your ${currentRole} background transfer to ${targetRole}. Focus on your ${skills} as a foundation.`,
        tasks: [
          `Identify 3-5 specific aspects of ${currentRole} work applicable to ${targetRole}`,
          `Research ${targetRole} roles that specifically value ${currentRole} background`,
          `Join communities focused on ${targetRole} where ${currentRole} professionals discuss careers`,
          `Find case studies of people transitioning from ${currentRole} to ${targetRole}`,
        ],
      },
      {
        description: `Develop the skills and knowledge needed for ${targetRole} that aren't yet in your toolkit`,
        tasks: [
          `Take 2-3 courses specifically recommended for ${currentRole} → ${targetRole} transitions`,
          `Apply your ${primarySkill} skills to ${targetRole}-related projects`,
          `Gain first hands-on ${targetRole} experience (project, volunteering, or shadowing) that shows your ${currentRole} advantage`,
          `Connect with mentors in ${targetRole} who have similar ${currentRole} backgrounds`,
          `Document and share your learning journey in your industry`,
        ],
      },
      {
        description: `Build specialized expertise that combines ${targetRole} knowledge with your unique ${currentRole} perspective`,
        tasks: [
          `Complete the certifications or licenses expected for ${targetRole}`,
          `Build 2-3 examples of work showing how your ${currentRole} expertise enhances ${targetRole} outcomes`,
          `Share your perspective on ${targetRole} from a ${currentRole} angle with peers and mentors`,
          `Take on volunteer, part-time, or side work in ${targetRole}`,
          `Network intensively with ${targetRole} professionals, highlighting your unique background`,
        ],
      },
      {
        description: `Position yourself for ${targetRole} roles that value your ${currentRole} background`,
        tasks: [
          `Tailor your LinkedIn profile to highlight ${targetRole} while showcasing your ${currentRole} experience as an advantage`,
          `Reframe your resume to show progression toward ${targetRole} with your ${currentRole} skills as foundation`,
          `Target employers that value ${currentRole} professionals transitioning to ${targetRole}`,
          `Practice interviews emphasizing how ${currentRole} experience prepared you for ${targetRole}`,
          `Negotiate roles that value your dual expertise in ${currentRole} and ${targetRole}`,
        ],
      },
    ],
    skill_gaps: [
      `Proficiency with ${targetRole}-specific tools, methods, and practices`,
      `Deep industry knowledge specific to ${targetRole}`,
      `Interpersonal skills highly valued in ${targetRole} work`,
      `Certifications, licenses, or credentials required for ${targetRole}`,
      `${years}+ years of practical experience in ${targetRole} (your ${currentRole} background helps offset this)`,
      `Understanding of how ${targetRole} applies to your current ${currentRole} domain`,
    ],
    recommended_roles: [
      {
        title: `${currentRole} + ${targetRole} Hybrid Role`,
        description: `Leverage your ${currentRole} expertise while integrating ${targetRole} skills - unique value proposition`,
        demand: "Very High",
        salary_range: "Varies by region - check local salary data",
      },
      {
        title: `${targetRole} Specialist (Entry to Mid-Level)`,
        description: `Transition into dedicated ${targetRole} roles - companies value your ${currentRole} background`,
        demand: "High",
        salary_range: "Varies by region - check local salary data",
      },
      {
        title: `${currentRole} → ${targetRole} Bridge Role`,
        description: `Rare hybrid roles combining ${currentRole} expertise with ${targetRole} focus - highest salary potential`,
        demand: "Varies",
        salary_range: "Varies by region - check local salary data",
      },
      {
        title: `${targetRole} in Your ${currentRole} Industry`,
        description: `Apply ${targetRole} expertise to your current industry where ${currentRole} background is highly valuable`,
        demand: "High",
        salary_range: "Varies by region - check local salary data",
      },
    ],
    courses: {
      essential: [
        `Foundational ${targetRole} course for ${currentRole} professionals`,
        `How to apply your ${primarySkill} to ${targetRole}`,
        `${targetRole}-specific training relevant to your ${currentRole} domain`,
        `Advanced ${targetRole} course leveraging your ${years} years of ${currentRole} experience`,
        `Hands-on ${targetRole} program combining ${currentRole} and ${targetRole}`,
      ],
      advanced: [
        `Advanced ${targetRole} certification for ${currentRole} professionals`,
        `${targetRole} strategy and management course`,
        `Leadership in ${targetRole} for experienced professionals`,
      ],
    },
    certifications: [
      {
        cert: `Entry-level ${targetRole} certification or license`,
        roi: 95,
        cost: 300,
        salary_impact: "Varies",
        time_months: 6,
      },
      {
        cert: `Industry-standard ${targetRole} certification`,
        roi: 88,
        cost: 250,
        salary_impact: "Varies",
        time_months: 4,
      },
      {
        cert: `Advanced ${targetRole} Leadership certification`,
        roi: 92,
        cost: 400,
        salary_impact: "Varies",
        time_months: 8,
      },
    ],
    communities: [
      `Communities for ${currentRole} professionals transitioning to ${targetRole}`,
      `${targetRole} communities where ${currentRole} professionals gather`,
      `Industry-specific ${targetRole} groups`,
      `Networking groups for ${currentRole} → ${targetRole} transitions`,
      `Local meetups for ${targetRole} professionals with diverse ${currentRole} backgrounds`,
    ],
  }
}

function buildMilestones(
  ctx: BuildContext,
  content: RoadmapAIContent["milestones"],
): Milestone[] {
  const { currentRole, targetRole, primarySkill, skills, totalMonths } = ctx
  const end1 = Math.ceil(totalMonths * 0.2)
  const end2 = Math.ceil(totalMonths * 0.5)
  const end3 = Math.ceil(totalMonths * 0.75)

  const phases = [
    {
      title: `Foundation: Leverage Your ${currentRole} Strengths (Months 1-${end1})`,
      duration_months: end1,
      // Personal task stitched in so cached content still reflects the user
      personalTask: `List which of your skills (${skills}) are already valuable for ${targetRole}`,
    },
    {
      title: `Build Skills Gaps: ${primarySkill} Skills for ${targetRole} (Months ${end1 + 1}-${end2})`,
      duration_months: Math.ceil(totalMonths * 0.3),
    },
    {
      title: `Specialize & Differentiate: Advanced ${targetRole} with Your ${currentRole} Edge (Months ${end2 + 1}-${end3})`,
      duration_months: Math.ceil(totalMonths * 0.25),
    },
    {
      title: `Job Search & Transition: Landing Your ${targetRole} Role (Months ${end3 + 1}+)`,
      duration_months: Math.ceil(totalMonths * 0.25),
    },
  ]

  return phases.map((phase, i) => ({
    phase: i + 1,
    title: phase.title,
    description: content[i].description,
    tasks: phase.personalTask
      ? [phase.personalTask, ...content[i].tasks]
      : content[i].tasks,
    duration_months: phase.duration_months,
  }))
}

function buildNextSteps(ctx: BuildContext): string[] {
  const { currentRole, targetRole, skills } = ctx
  return [
    `This week: Identify 3-5 specific aspects of ${currentRole} work that transfer to ${targetRole}`,
    `This week: Research case studies of ${currentRole} professionals who transitioned to ${targetRole}`,
    `Next 2 weeks: Enroll in foundational ${targetRole} course for professionals like you`,
    `Next 2 weeks: Connect with 3-5 people in ${targetRole} who have ${currentRole} backgrounds`,
    `Next month: Start your first ${targetRole} project using your ${skills}`,
    `Next month: Update LinkedIn to highlight your ${currentRole} → ${targetRole} journey`,
    `Ongoing: Keep a record of your progress, new skills, and accomplishments`,
  ]
}

function buildProfessionalContent(ctx: BuildContext) {
  const { currentRole, targetRole, skills, years } = ctx
  return {
    curated_courses: [
      `Advanced ${targetRole} courses specifically for ${currentRole} professionals`,
      `Leveraging ${years} years of ${currentRole} experience in ${targetRole} roles`,
      `${targetRole} courses building on your ${skills}`,
      `Industry certifications recognizing your ${currentRole} background`,
      `Specialized ${targetRole} training for career switchers with your profile`,
    ],
    resume_suggestions: [
      `Frame your ${years} years in ${currentRole} as preparation for ${targetRole} (progression, not pivot)`,
      `Highlight ${currentRole} projects demonstrating ${targetRole}-relevant skills`,
      `Use metrics from ${currentRole} that matter in ${targetRole} industry`,
      `Show moments where you applied ${targetRole} thinking to ${currentRole} problems`,
      `Include ${targetRole} side projects and certifications alongside ${currentRole} achievements`,
    ],
    portfolio_ideas: [
      `Take on a ${targetRole} project or volunteer role that solves a real problem in your ${currentRole} domain`,
      `Build 2-3 case studies showing how ${targetRole} improves ${currentRole} workflows`,
      `Document your ${currentRole} → ${targetRole} transition journey`,
      `Keep work samples, logs, or references from ${targetRole} experience that show your ${currentRole} perspective`,
      `Share what you learn at the intersection of ${currentRole} and ${targetRole}`,
    ],
  }
}

function buildPremiumContent(ctx: BuildContext) {
  const { currentRole, targetRole, skills, years } = ctx
  return {
    resumes: [
      {
        type: "Skills-Focused",
        description:
          "Leads with hands-on skills, credentials, and measurable results",
        content: `• Lead with the skills most relevant to ${targetRole}: ${skills}\n• Put certifications, licenses, and training near the top\n• Quantify results from ${years} years in ${currentRole} (time saved, people served, quality, revenue)\n• Show how ${currentRole} work built foundations for ${targetRole}\n• Use concrete examples: "Reduced errors by X%", "Trained Y new team members"\n• Position yourself as a ${targetRole} candidate ready to contribute immediately`,
      },
      {
        type: "General/Versatile",
        description: "Broad appeal works for various industries and roles",
        content: `• Position ${years} years in ${currentRole} as preparation for ${targetRole}\n• Show how ${skills} transfer across domains\n• Narrative: "My ${currentRole} background gives unique perspective on ${targetRole} challenges"\n• Include both technical achievements and soft skills\n• Demonstrate intentional growth and learning\n• Appeal to companies seeking ${targetRole} talent with your background`,
      },
      {
        type: "Small Organization-Focused",
        description:
          "Highlights adaptability for small businesses, nonprofits, and fast-moving teams",
        content: `• Highlight adaptability as a ${currentRole} transitioning to ${targetRole}\n• Emphasize: learning quickly, wearing multiple hats, taking initiative\n• Use action language: "Set up", "Improved", "Took ownership of"\n• Show energy and willingness to grow with the organization\n• Demonstrate: continuous learning, new skills picked up, flexibility\n• Appeal to small employers that value versatile, experienced people`,
      },
      {
        type: "Large Organization-Focused",
        description:
          "Emphasizes leadership and structured process improvement for large employers",
        content: `• Position ${years} years in ${currentRole} as leadership experience\n• Highlight: cross-functional collaboration, budget management, team leadership\n• Demonstrate: stakeholder communication, process improvement, change management\n• Use professional language: "Optimized workflows", "Managed initiatives", "Drove adoption"\n• Show how you led change in ${currentRole}\n• Appeal to large employers seeking ${targetRole} leaders with management credibility`,
      },
    ],
    linkedin_optimization: [
      `• Headline: "${currentRole} Expert Transitioning to ${targetRole}" (expert integrating new skills)`,
      `• About: Explain why ${targetRole} is natural next step from ${currentRole}, your unique perspective`,
      `• Experience: Reframe ${currentRole} achievements through ${targetRole} lens`,
      `• Skills: Prioritize both ${currentRole} AND ${targetRole} to show integrated expertise`,
      `• Featured: Showcase ${targetRole} work, credentials, or volunteering alongside ${currentRole} achievements`,
    ],
    career_coaching_insights: [
      `• Timing: You're ready after ${years} years in ${currentRole} - you have credibility AND differentiation`,
      `• Salary: Use your ${currentRole} experience to negotiate above entry-level ${targetRole} pay`,
      `• Job search: Target employers in your current ${currentRole} industry that hire for ${targetRole}`,
      `• Interviews: Lead with ${currentRole} achievements, pivot to ${targetRole} passion, emphasize fresh perspective`,
      `• Networking: Connect ${currentRole} peers with ${targetRole} professionals - become the bridge`,
    ],
  }
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0]
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

/**
 * Stitches AI-generated content into the code-built roadmap template.
 *
 * @param input - User's career input (personal details stitched in here)
 * @param targetRole - Target job title extracted from the user's goals
 * @param aiContent - Role-specific content from Claude or the cache; any
 *   missing section falls back to the template
 * @param userTier - FREE | PROFESSIONAL | PREMIUM
 * @param now - Injected for deterministic tests
 */
export function buildRoadmap(
  input: CareerInput,
  targetRole: string,
  aiContent: Partial<RoadmapAIContent>,
  userTier: string = "FREE",
  now: Date = new Date(),
): Roadmap {
  const ctx = createContext(input, targetRole)
  const content: RoadmapAIContent = { ...templateAIContent(ctx), ...aiContent }
  const { currentRole, skills, years, goals, totalMonths } = ctx

  const completion = new Date(
    now.getTime() + totalMonths * 30 * 24 * 60 * 60 * 1000,
  )

  const includeProfessional =
    userTier === "PROFESSIONAL" || userTier === "PREMIUM"
  const includePremium = userTier === "PREMIUM"
  const resources = includeProfessional
    ? getResourcesForRole(
        targetRole,
        aiContent.certifications?.map((c) => c.cert),
      )
    : null

  return {
    title: `Career Migration Path: From ${currentRole} to ${targetRole}, emphasizing ${skills}`,
    summary: `With ${years} years in ${currentRole}, you have a strong foundation for transitioning to ${targetRole}. Your goal is to ${goals}. This roadmap leverages your ${skills} while developing new capabilities needed for ${targetRole} roles. Your background gives you a unique advantage in understanding how to bridge these two career paths.`,
    timeline: {
      total_months: totalMonths,
      start_date: toISODate(now),
      estimated_completion: toISODate(completion),
    },
    milestones: buildMilestones(ctx, content.milestones),
    skill_gaps: content.skill_gaps,
    recommended_roles: content.recommended_roles,
    resource_categories: {
      courses: content.courses,
      certifications: content.certifications,
      communities: content.communities,
    },
    next_steps: buildNextSteps(ctx),
    ...(includeProfessional &&
      resources && {
        professional_tier_content: {
          ...buildProfessionalContent(ctx),
          courses: resources.courses,
          certifications: resources.certifications,
        },
      }),
    ...(includePremium &&
      resources && {
        premium_tier_content: {
          ...buildPremiumContent(ctx),
          communities: resources.communities,
        },
      }),
  }
}
