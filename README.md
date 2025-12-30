# Cloud Designs: AI Career Planner

An intelligent career roadmap generator that uses AI to help professionals transition into AI-resilient roles. Built with Next.js 16, React 19, TypeScript, and Claude Haiku API.

**Live Demo:** [Coming Soon - Deploy to Vercel](#deployment)

## 🎯 Overview

Cloud Designs helps professionals navigate career transitions in the age of AI. Users input their current role, experience level, and career goals—our AI analyzes their profile and generates a personalized, actionable roadmap with:

- 4-phase career progression plan (18-48 months)
- Skills gap analysis with learning resources
- Recommended roles with salary expectations
- Curated courses, certifications, and communities
- Printable PDF roadmaps

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19, TypeScript 5)
- **Styling**: Traditional CSS (2000+ lines) with CSS variables for theming
- **Features**: 
  - Light/dark mode with localStorage persistence
  - Responsive design (mobile-first)
  - Server-side rendering with Next.js App Router
  - No CSS framework dependencies

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **AI Model**: Claude Haiku 3.5 (Anthropic)
- **Cost**: ~$0.01-0.02 per roadmap generation
- **Architecture**: RESTful API with request validation

### Infrastructure
- **Deployment**: Vercel (production-ready)
- **Environment**: Node 18+ required
- **Database**: PostgreSQL + Prisma (optional - Phase 2)

### Development
- **Language**: TypeScript (strict mode)
- **Linting**: ESLint with Next.js config
- **Testing**: Jest-compatible test structure
- **Version Control**: Git/GitHub

## 📦 Features

### Core Features
- ✅ AI-powered career roadmap generation
- ✅ 4-phase career transition planning
- ✅ Skill gap identification
- ✅ Recommended roles with salary data
- ✅ Learning resources (courses, certifications, communities)
- ✅ Printable roadmaps
- ✅ Dark mode (default) + light mode toggle
- ✅ Responsive design for all devices

### Content Pages
- **Home (/)** - Hero section + input form + info cards
- **Features & Pricing (/features-pricing)** - 3 pricing tiers + comparison table
- **About (/about)** - Mission, vision, values, team info
- **Blog (/blog)** - Featured article + post grid
- **FAQ (/faq)** - 15+ questions across 6 categories
- **Contact (/contact)** - Contact form + support info
- **Privacy Policy (/privacy)** - GDPR/CCPA compliant (2800+ words)
- **Terms of Service (/terms)** - Industry-standard legal (2700+ words)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Anthropic API key (free tier available at [console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/sent1nel101/cloud-migration.git
cd cloud-migration

# Install dependencies
npm install

# Create .env.local with your API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Required: Anthropic API key
ANTHROPIC_API_KEY=[your-key]

# Optional: For production
NEXT_PUBLIC_APP_URL=https://yoursite.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=[stripe-public-key]
DATABASE_URL=postgresql://[connection-string]
NEXTAUTH_SECRET=[generated-secret]
```

## 🛠️ Available Commands

```bash
npm run dev       # Start development server (hot reload)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint checks
npm test          # Run tests (requires Jest setup)
```

## 📁 Project Structure

```
cloud-migration/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page (/)
│   ├── layout.tsx           # Root layout
│   ├── api/
│   │   ├── roadmap/route.ts         # AI roadmap generation
│   │   ├── roadmaps/route.ts        # Get user roadmaps
│   │   ├── auth/signup/route.ts     # User registration
│   │   ├── auth/[...nextauth]/      # NextAuth handlers
│   │   └── webhooks/stripe/route.ts # Stripe webhooks
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx   # User dashboard
│   └── [routes]/            # Other pages
├── components/              # Reusable React components
│   ├── Header.tsx
│   ├── InputForm.tsx
│   ├── RoadmapDisplay.tsx
│   ├── PricingSection.tsx
│   └── Footer.tsx
├── lib/                     # Business logic
│   ├── auth.ts
│   ├── prisma.ts
│   ├── user-service.ts
│   ├── roadmap-service.ts
│   └── payment-service.ts
├── types/                   # TypeScript types
├── prisma/                  # Database schema
├── __tests__/               # Unit tests
├── package.json
└── tsconfig.json
```

## 🔄 API Specification

### POST /api/roadmap

Generates a personalized career roadmap using AI.

**Request:**
```json
{
  "currentRole": "Software Engineer",
  "yearsExperience": 5,
  "skills": ["Python", "JavaScript", "React"],
  "goals": "Transition to AI/ML roles",
  "educationLevel": "Bachelor's"
}
```

**Response (200 OK):**
```json
{
  "title": "Career Migration Path: Software Engineer → AI Specialist",
  "summary": "An 18-month transition plan leveraging your engineering background...",
  "timeline": {
    "total_months": 18,
    "start_date": "2024-12-29",
    "estimated_completion": "2026-06-29"
  },
  "milestones": [/* ... */],
  "skill_gaps": ["Python for ML", "Statistics"],
  "recommended_roles": [/* ... */],
  "resource_categories": {/* ... */},
  "next_steps": ["Enroll in 'AI for Everyone'"]
}
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- **types.test.ts** - TypeScript interface validation
- **validation.test.ts** - Form input validation
- **api-logic.test.ts** - API business logic

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub (already done)**

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Select `sent1nel101/cloud-migration` repo
   - Add environment variables:
     - `ANTHROPIC_API_KEY` = Your Anthropic API key
     - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` = Your Stripe publishable key
     - `DATABASE_URL` = Your PostgreSQL connection string (optional)
     - `NEXTAUTH_SECRET` = Generated secret for NextAuth
   - Click "Deploy"

3. **Verify:**
   - Test all pages load
   - Test form submission
   - Verify theme toggle works

## 🔐 Security

- ✅ API keys in environment variables (never exposed)
- ✅ Server-side input validation
- ✅ HTTPS enforced (Vercel default)
- ✅ GDPR-compliant privacy policy
- ✅ Legal terms of service included

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and flow diagrams
- **[AI_INTEGRATION.md](./AI_INTEGRATION.md)** - Claude API setup details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and fixes

## 🗺️ Roadmap

### Phase 1: MVP (Complete ✅)
- [x] AI roadmap generation
- [x] 8 static pages
- [x] Dark/light mode
- [x] Responsive design

### Phase 2: User Persistence (In Progress)
- [x] User authentication (NextAuth.js)
- [x] Database schema (PostgreSQL + Prisma)
- [x] Save/manage roadmaps
- [ ] Payment processing (Stripe)

### Phase 3: Advanced Features (Future)
- [ ] Resume file upload & parsing
- [ ] Email notifications
- [ ] Real course API integration
- [ ] Community features

## 👤 Author

**Darec McDaniel**
- Email: [darec@darecmcdaniel.info](mailto:darec@darecmcdaniel.info)

## 📄 License

MIT License

---

**Built with ❤️ to help professionals navigate AI-driven career transitions.**
