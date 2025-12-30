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
- **Database**: None (MVP - data not persisted)

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
git clone https://github.com/yourusername/cloud-designs.git
cd cloud-designs

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
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# Optional: For production
NEXT_PUBLIC_APP_URL=https://yoursite.com
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
cloud-designs/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page (/)
│   ├── layout.tsx           # Root layout
│   ├── api/
│   │   └── roadmap/route.ts # AI roadmap generation endpoint
│   └── [routes]/
│       ├── about/page.tsx
│       ├── blog/page.tsx
│       ├── faq/page.tsx
│       ├── contact/page.tsx
│       ├── features-pricing/page.tsx
│       ├── privacy/page.tsx
│       └── terms/page.tsx
├── components/              # Reusable React components
│   ├── Header.tsx           # Navigation + theme toggle
│   ├── InputForm.tsx        # Career info form
│   ├── RoadmapDisplay.tsx   # Results visualization
│   ├── PricingSection.tsx   # Pricing tiers
│   └── Footer.tsx           # Site footer
├── types/
│   └── index.ts             # TypeScript interfaces (CareerInput, Roadmap, etc.)
├── __tests__/               # Unit tests
│   ├── types.test.ts        # Type validation tests
│   ├── validation.test.ts   # Form validation tests
│   └── api-logic.test.ts    # API logic tests
├── styles/                  # Global CSS
│   └── globals.css          # Main stylesheet (2000+ lines)
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
└── postcss.config.js        # PostCSS config
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
  "milestones": [
    {
      "phase": 1,
      "title": "Foundation: AI Literacy & Assessment",
      "description": "Build foundational understanding...",
      "tasks": ["Complete 'AI for Everyone'", "Research 3-5 AI roles..."],
      "duration_months": 3
    }
    // ... more phases
  ],
  "skill_gaps": ["Python for ML", "Statistics", "TensorFlow"],
  "recommended_roles": [
    {
      "title": "ML Engineer",
      "description": "Build and deploy ML systems",
      "demand": "Very High",
      "salary_range": "$130K - $200K"
    }
    // ... more roles
  ],
  "resource_categories": {
    "courses": {
      "essential": ["AI for Everyone (Coursera)"],
      "advanced": ["Deep Learning Specialization"]
    },
    "certifications": ["Google Cloud AI Engineer"],
    "communities": ["r/MachineLearning"]
  },
  "next_steps": ["Enroll in 'AI for Everyone'", "Set up GitHub account"]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: currentRole, yearsExperience"
}
```

**Validation Rules:**
- `currentRole`: Required, non-empty string
- `yearsExperience`: Required, integer 0-70
- `skills`: Optional, array of strings
- `goals`: Required, non-empty string
- `educationLevel`: Optional string

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
The `__tests__/` directory includes:

1. **types.test.ts** - TypeScript interface validation
   - CareerInput shape
   - Milestone structure
   - Roadmap completeness
   - ResourceCategories organization

2. **validation.test.ts** - Form input validation
   - Required field checking
   - Experience range validation
   - Skills array validation
   - Multiple error detection

3. **api-logic.test.ts** - API business logic
   - Roadmap structure validation
   - Timeline calculations
   - JSON parsing/cleaning
   - Error handling

### Integration Testing
To test with real Claude API:

```bash
# 1. Ensure .env.local has valid ANTHROPIC_API_KEY
# 2. Start dev server
npm run dev

# 3. Test in browser or with curl
curl -X POST http://localhost:3000/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "currentRole": "Product Manager",
    "yearsExperience": 5,
    "goals": "Transition to AI Product Lead"
  }'
```

## 🎨 Design & Theming

### Color Scheme
The app uses CSS custom properties for theming:

```css
/* Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #f3f4f6;
--text-primary: #1f2937;

/* Dark Mode (default) */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--text-primary: #f1f5f9;

/* Primary Brand Color */
--primary-color: #3b82f6;
```

### Switching Themes
- Click the sun/moon icon in the Header
- Theme preference is saved to localStorage
- Dark mode is the default theme

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "MVP: Cloud Designs AI Career Planner"
git branch -M main
git remote add origin https://github.com/yourusername/cloud-designs.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Select your GitHub repo
   - Add environment variable:
     - Key: `ANTHROPIC_API_KEY`
     - Value: Your Anthropic API key
   - Click "Deploy"

3. **Verify:**
   - Test all pages load
   - Test form submission
   - Verify theme toggle works
   - Check mobile responsiveness

### Alternative Deployments
- **Docker**: Add Dockerfile for containerization
- **AWS**: Use AWS Amplify or EC2
- **Azure**: Use Azure App Service

## 📊 Performance Metrics

- **Page Load**: ~1.2s (cached)
- **API Response**: ~2-3s (includes Claude AI latency)
- **Lighthouse Score**: 90+ (mobile), 95+ (desktop)
- **TypeScript**: Zero compilation errors
- **Bundle Size**: ~150KB (optimized)

## 🔐 Security

- ✅ API key stored in environment variables (never exposed to frontend)
- ✅ Server-side validation of all inputs
- ✅ HTTPS enforced (Vercel default)
- ✅ CORS headers configured
- ✅ No sensitive data stored in localStorage
- ✅ XSS protection via React's built-in sanitization
- ✅ GDPR-compliant privacy policy
- ✅ Legal terms of service included

## 🐛 Troubleshooting

### "Missing ANTHROPIC_API_KEY"
- Create `.env.local` in project root
- Add your API key from [console.anthropic.com](https://console.anthropic.com)

### "Failed to generate roadmap"
- Check API key validity
- Verify Claude API account has credits
- Check browser console for detailed error
- Review server logs: `npm run dev`

### Theme not persisting
- Clear localStorage: `localStorage.clear()`
- Ensure cookies enabled
- Check browser dev tools → Storage

### "Not found" errors on pages
- Verify file exists in `app/[route]/page.tsx`
- Check route naming matches file structure
- Restart dev server: `npm run dev`

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[AI_INTEGRATION.md](./AI_INTEGRATION.md)** - Claude API setup details
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and flow diagrams
- **[PROJECT_OUTLINE.md](./PROJECT_OUTLINE.md)** - Original specifications
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide

## 🗺️ Roadmap

### Phase 1: MVP (Complete ✅)
- [x] AI roadmap generation
- [x] 8 static pages
- [x] Dark/light mode
- [x] Responsive design

### Phase 2: User Persistence (Future)
- [ ] User authentication (NextAuth.js)
- [ ] Database (PostgreSQL + Prisma)
- [ ] Save multiple roadmaps per user
- [ ] Email notifications

### Phase 3: Advanced Features (Future)
- [ ] Resume file upload & parsing
- [ ] Real course API integration
- [ ] Payment processing (Stripe)
- [ ] Community features
- [ ] Job board integration

### Phase 4: Scale (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Admin panel
- [ ] Internationalization

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and add tests
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/your-feature`
6. Submit a Pull Request

### Code Style
- Use TypeScript strict mode
- ESLint configured - run `npm run lint`
- Comments for complex logic
- Test coverage for new features

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Darec McDaniel**
- Email: [contact@darecmcdaniel.info](mailto:contact@darecmcdaniel.info)
- Portfolio: [darecmcdaniel.info](https://darecmcdaniel.info)

## 🙏 Acknowledgments

- Claude AI by Anthropic for career advice generation
- Next.js team for the amazing framework
- React community for components and best practices
- Vercel for deployment platform

## 📞 Support

- **Documentation**: See files listed in Documentation section
- **Issues**: Create a GitHub issue for bugs
- **Email**: [contact@darecmcdaniel.info](mailto:contact@darecmcdaniel.info)

---

**Built with ❤️ to help professionals navigate AI-driven career transitions.**
