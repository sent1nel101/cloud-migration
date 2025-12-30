# Quick Start Guide

Get CareerAI running locally in 5 minutes.

## Prerequisites
- Node.js 18+
- npm or yarn
- Git

## 1. Install & Setup (2 min)

```bash
# Navigate to project directory
cd amp-migration

# Install dependencies (already done if you ran npm install earlier)
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your API key (or skip for mock data)
# ANTHROPIC_API_KEY=your_key_here
```

## 2. Run Development Server (1 min)

```bash
npm run dev
```

Output will show:
```
✓ Ready in 1.2s
✓ Route (app) [ ]
✓ Route (app/api/roadmap) [ ]
- Local:        http://localhost:3000
```

Visit http://localhost:3000 in your browser.

## 3. Test the App (2 min)

1. Fill in the form:
   - Job Title: `Marketing Manager`
   - Years: `5`
   - Skills: `Project Management`, `Analytics`, `Communication`
   - Goals: `Transition into AI/ML roles`

2. Click "Generate My Career Roadmap"

3. View your personalized roadmap

4. See pricing options for paid tiers

## Current Features

✓ Input form (career data collection)
✓ Roadmap generation (mock AI)
✓ Printable output
✓ Responsive design
✓ Pricing page
✓ Mobile friendly

## Next: Integrate Real AI

To use Claude or OpenAI instead of mock data:

### Step 1: Get API Key
- Claude: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/account/api-keys

### Step 2: Add Key to .env.local
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxx
# or
OPENAI_API_KEY=sk-xxxxx
```

### Step 3: Install SDK
```bash
npm install @anthropic-ai/sdk
# or
npm install openai
```

### Step 4: Update API Route
See `AI_INTEGRATION.md` for code examples.

### Step 5: Test
```bash
npm run dev
# Generate a roadmap - should now use real AI
```

## Deployment

Ready to go live? See `DEPLOYMENT.md` for options:
- Vercel (recommended, free)
- AWS
- DigitalOcean
- Heroku
- Self-hosted

## Useful Commands

```bash
# Development
npm run dev           # Start dev server (localhost:3000)
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Check code quality

# Testing
npm run build         # Full build test

# Formatting
# (No formatter configured yet - use your IDE)
```

## Project Structure

```
├── app/
│   ├── api/roadmap/route.ts    ← API endpoint (edit for real AI)
│   ├── page.tsx                ← Home page
│   ├── layout.tsx              ← Root layout
│   └── globals.css             ← Global styles
├── components/
│   ├── Header.tsx              ← Navigation
│   ├── InputForm.tsx           ← Form (edit for fields)
│   ├── RoadmapDisplay.tsx      ← Results display
│   ├── PricingSection.tsx      ← Pricing
│   └── Footer.tsx              ← Footer
├── types/index.ts              ← TypeScript types
├── public/                      ← Static files
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Common Tasks

### Add a New Input Field
Edit `components/InputForm.tsx`:
```typescript
<input name="newField" ... />
```

### Change Styling
Edit component files - uses Tailwind CSS
```typescript
<div className="bg-blue-600 text-white px-4 py-2 rounded">
```

### Modify Roadmap Output
Edit `components/RoadmapDisplay.tsx` for display
Edit `types/index.ts` to change data structure

### Add Paid Features
Create new components in `components/`
Add new API routes in `app/api/`

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process on port 3000
# Windows: netstat -ano | findstr :3000 then taskkill /PID xxxx /F
# Mac/Linux: lsof -i :3000 then kill -9 <PID>

npm run dev -- -p 3001  # or use different port
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run lint          # See all errors
# Fix errors in your IDE
```

### Build fails
```bash
npm run build         # See build errors
# Check error messages and fix
```

## Get Help

- Check `README.md` for full documentation
- Check `AI_INTEGRATION.md` for AI setup
- Check `DEPLOYMENT.md` for going live
- Check `PROJECT_OUTLINE.md` for project details
- Open issues on GitHub

## Next Steps

1. ✓ Run locally (you are here)
2. Add real AI integration (see `AI_INTEGRATION.md`)
3. Deploy to Vercel (see `DEPLOYMENT.md`)
4. Add paid features (see `TODO.md`)
5. Monitor and iterate

## Success Checklist

- [x] Node.js installed
- [x] Project cloned/set up
- [x] Dependencies installed
- [ ] Dev server running (run `npm run dev`)
- [ ] App visible at http://localhost:3000
- [ ] Form submits and generates roadmap
- [ ] Mobile version works
- [ ] Ready for AI integration

Start the dev server and let's go:

```bash
npm run dev
```

Then visit http://localhost:3000

Enjoy building! 🚀
