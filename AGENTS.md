# AGENTS.md - AI Career Planner Project

## ⚠️ CRITICAL: Tracking Files Maintenance

**Keep these FOUR files updated at ALL times** - they are your project source of truth:

1. **TODO.md** - What needs to be done (update task status)
2. **ACTIONS.md** - Current work and next steps (update with progress, add session notes)
3. **SUMMARY.md** - Completed work and progress tracking (add new completions)
4. **AGENTS.md** - Commands, styles, structure (this file - update when adding recurring commands)

Update these files WHENEVER:
- You complete a major task
- You start a new phase
- You change direction or priorities
- You want to document decisions
- Before committing to git

These files are used to:
- Track project progress
- Communicate status clearly
- Remember what was done and why
- Plan next steps
- Onboard new team members

## Build/Lint/Test Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint (no test framework configured)
```

## Database Commands

```bash
# Push schema to database (always use --url for direct connection)
npx prisma db push --url="postgresql://..." --accept-data-loss

# View database GUI
npx prisma studio

# Generate Prisma client
npx prisma generate
```

No test runner currently configured. Testing should be added with Jest or Vitest if needed.

## Architecture & Codebase Structure

- **Framework**: Next.js 16.1.1 with React 19 and TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **App Router**: Uses Next.js App Router pattern
- **Entry Point**: `app/page.tsx` (home page)
- **Layout**: `app/layout.tsx` (root layout with metadata)
- **Structure**: Single-page starter template; expand in `app/` directory for additional routes

## Code Style Guidelines

- **Language**: TypeScript (strict mode enabled)
- **Import Paths**: Use `@/*` alias for imports from root directory
- **Module Resolution**: ESNext modules with bundler resolution
- **JSX**: React 17+ JSX transform (automatic)
- **Components**: Functional components with React hooks
- **Styling**: Tailwind CSS classes only (no external CSS)
- **Type Safety**: Explicit types required; `noEmit` enabled
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Exports**: Default exports for page components, named for utilities
- **Linting**: ESLint with Next.js core web vitals and TypeScript configs enabled
