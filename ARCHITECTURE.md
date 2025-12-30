# CareerAI Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                       (React Components)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Header     │  │  InputForm   │  │   Footer     │          │
│  │  Navigation  │  │ (7 fields)   │  │   (links)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │         RoadmapDisplay Component                     │      │
│  │  - Timeline section                                 │      │
│  │  - 4 Milestones with tasks                          │      │
│  │  - Skill gaps analysis                              │      │
│  │  - Recommended roles (4+)                           │      │
│  │  - Resources (courses, certs, communities)          │      │
│  │  - Print-friendly formatting                        │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │         PricingSection Component                     │      │
│  │  - Free tier                                        │      │
│  │  - Professional tier ($39/month)                    │      │
│  │  - Executive tier ($129/month)                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP POST
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API LAYER                           │
│                  (Server-Side Processing)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │      POST /api/roadmap                               │      │
│  │  1. Validate input (CareerInput)                     │      │
│  │  2. Call AI model (Claude or OpenAI)                 │      │
│  │  3. Parse response                                  │      │
│  │  4. Return Roadmap JSON                             │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ API Call
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI MODEL LAYER (Optional)                    │
│                  (External API Services)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │  Claude API (Haiku)  │    │  OpenAI (GPT-3.5)   │          │
│  │  Recommended         │    │  Alternative        │          │
│  │  $0.01-0.02/req      │    │  $0.005-0.015/req   │          │
│  └──────────────────────┘    └──────────────────────┘          │
│                                                                 │
│  Shared Prompt:                                                │
│  - Analyze user career profile                                 │
│  - Generate 4-phase roadmap                                    │
│  - Provide skills, roles, resources                            │
│  - Return JSON format                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input Flow
```
User fills form → InputForm validates → POST to /api/roadmap
                                             │
                                             ▼
                                    Create CareerInput object
                                             │
                                             ▼
                                    Send to API endpoint
```

### 2. Roadmap Generation Flow
```
API receives CareerInput
     │
     ▼
Validate input fields
     │
     ▼
Call AI model with prompt
     │
     ▼
Parse AI response (JSON)
     │
     ▼
Return Roadmap object
     │
     ▼
RoadmapDisplay renders
     │
     ▼
User sees results
```

### 3. Response Structure
```
CareerInput {
  currentRole: string
  yearsExperience: number
  skills?: string[]
  goals: string
  educationLevel?: string
}
            │
            ▼ (API processes)
            │
Roadmap {
  title: string
  summary: string
  timeline: { total_months, start_date, estimated_completion }
  milestones: Milestone[]
  skill_gaps: string[]
  recommended_roles: RecommendedRole[]
  resource_categories: ResourceCategories
  next_steps: string[]
}
```

## Component Hierarchy

```
App (page.tsx)
├── Header
│   └── Navigation links
├── Hero Section
│   └── Value proposition
├── InputForm
│   ├── Job title input
│   ├── Years input
│   ├── Education dropdown
│   ├── Skills multi-add
│   ├── Goals textarea
│   └── Submit button
├── RoadmapDisplay (conditionally rendered)
│   ├── Timeline section
│   ├── Milestones (4 phases)
│   │   ├── Phase title & duration
│   │   └── Task list
│   ├── Skill gaps section
│   ├── Recommended roles (grid)
│   ├── Resources section
│   │   ├── Courses
│   │   ├── Certifications
│   │   └── Communities
│   ├── Action items
│   └── Print button
├── PricingSection
│   ├── Free tier card
│   ├── Professional tier card
│   └── Executive tier card
└── Footer
    └── Links & copyright
```

## Type System

```
TypeScript Interfaces (types/index.ts)

CareerInput
├── currentRole: string
├── yearsExperience: number
├── skills?: string[]
├── goals: string
├── educationLevel?: string
└── resume?: File

Roadmap
├── title: string
├── summary: string
├── timeline: Timeline
│   ├── total_months: number
│   ├── start_date: string
│   └── estimated_completion: string
├── milestones: Milestone[]
│   ├── phase: number
│   ├── title: string
│   ├── description: string
│   ├── tasks: string[]
│   └── duration_months: number
├── skill_gaps: string[]
├── recommended_roles: RecommendedRole[]
│   ├── title: string
│   ├── description: string
│   ├── demand: string
│   └── salary_range: string
└── resource_categories: ResourceCategories
    ├── courses
    │   ├── essential: string[]
    │   └── advanced: string[]
    ├── certifications: string[]
    └── communities: string[]
```

## File Organization

```
app/
├── api/
│   └── roadmap/
│       └── route.ts          ← API endpoint (edit for real AI)
│
├── page.tsx                  ← Main app (client component)
├── layout.tsx                ← Root layout
└── globals.css               ← Global styles

components/
├── Header.tsx                ← Navigation (server)
├── InputForm.tsx             ← Form (client with hooks)
├── RoadmapDisplay.tsx        ← Results (client with print)
├── PricingSection.tsx        ← Pricing (server)
└── Footer.tsx                ← Footer (server)

types/
└── index.ts                  ← All TypeScript interfaces

public/                        ← Static assets (empty for now)

Configuration Files
├── next.config.js            ← Next.js settings
├── tsconfig.json             ← TypeScript settings
├── tailwind.config.js        ← Tailwind CSS
├── postcss.config.js         ← PostCSS
└── .eslintrc.json            ← ESLint rules
```

## Deployment Architecture

### Development
```
Local Machine
     │
     ├─► npm run dev
     │    (Next.js dev server at localhost:3000)
     │
     └─► Open browser
          (Fast refresh, hot reload enabled)
```

### Production - Vercel
```
GitHub Repository
     │
     ├─► Push to main
     │    (auto-triggers)
     │
     ▼
Vercel CI/CD
     │
     ├─► Install dependencies
     ├─► Run build (next build)
     ├─► Optimize assets
     │
     ▼
Edge Network
     │
     ├─► Serverless functions (/api/*)
     ├─► Static assets (images, CSS, JS)
     ├─► CDN distribution
     │
     ▼
User Request → Edge Network → Next.js Route → Response
     │                              │
     ├─ Static pages (cached)      ├─ API routes (serverless)
     └─ With ISR (revalidation)    └─ Real-time responses
```

## Request/Response Example

### Request
```typescript
// POST /api/roadmap
{
  "currentRole": "Marketing Manager",
  "yearsExperience": 5,
  "skills": ["Analytics", "Project Management", "Communication"],
  "goals": "Transition into AI/ML roles",
  "educationLevel": "Bachelor's"
}
```

### Response
```typescript
{
  "title": "Career Migration Path: Marketing Manager → AI-Resilient Role",
  "summary": "Based on your 5 years in Marketing Manager...",
  "timeline": {
    "total_months": 48,
    "start_date": "2024-12-29",
    "estimated_completion": "2028-12-29"
  },
  "milestones": [
    {
      "phase": 1,
      "title": "Foundation (Months 1-3)",
      "description": "Build foundational AI literacy...",
      "tasks": ["Complete AI fundamentals course", "..."],
      "duration_months": 3
    },
    // ... phases 2-4
  ],
  "skill_gaps": ["Python programming", "Data analysis", ...],
  "recommended_roles": [
    {
      "title": "AI-Enhanced Marketing Manager",
      "description": "...",
      "demand": "High",
      "salary_range": "$80K - $120K"
    },
    // ... more roles
  ],
  "resource_categories": {
    "courses": { "essential": [...], "advanced": [...] },
    "certifications": [...],
    "communities": [...]
  },
  "next_steps": [...]
}
```

## Scaling Considerations

### Current (MVP)
- Single-server deployment (Vercel)
- No database
- Stateless API
- ~100 req/sec capacity
- ~$0 cost (mock AI)

### Phase 2 (With Database)
- Add PostgreSQL
- Add user authentication
- Store user profiles
- Still single-region

### Phase 3 (Production Scale)
- Multi-region deployment
- Redis caching
- Database replication
- Cost monitoring
- Error tracking (Sentry)

## Security Considerations

### Current MVP
- HTTPS enforced (Vercel)
- No sensitive data stored
- API rate limiting (Vercel)
- Input validation

### Future Additions
- Authentication (NextAuth.js)
- Database encryption
- GDPR compliance
- API key management
- Environment variables (no secrets in code)

## Performance Metrics

### Current Build
- Bundle size: ~200KB (optimized)
- API response: ~100ms (mock)
- Page load: <2s (dev)
- LCP: ~1s
- CLS: Near 0 (stable layout)

### After AI Integration
- API response: ~2-5s (Claude API)
- User-acceptable for background task
- Consider loading state UX

### Optimization Opportunities
- Response caching (Redis)
- Result memoization
- Lazy loading (future)
- Image optimization (if added)

## Error Handling

```
User submits form
     │
     ├─► Validation error → Show error message
     │
     ├─► Network error → Show "Try again" button
     │
     ├─► API error → Show "Service unavailable" message
     │
     └─► Success → Show results
```

## Environment Management

```
Development (.env.local)
├── ANTHROPIC_API_KEY (if using Claude)
└── OPENAI_API_KEY (if using OpenAI)

Production (Vercel)
├── ANTHROPIC_API_KEY (secret)
└── NODE_ENV=production
```

---

## Summary

**Current State**: 
- Fully functional frontend
- Working API endpoint
- Mock data for testing
- Ready for real AI integration

**Data Flow**:
1. User → Form input
2. Form → API POST
3. API → AI model (or mock)
4. Model → JSON response
5. Response → Display component
6. Display → User sees roadmap

**Deployment**:
- Vercel (recommended)
- Serverless architecture
- Auto-scaling
- CDN distribution
- One-click deployment from GitHub

**Next Step**: Integrate real AI or deploy as-is!
