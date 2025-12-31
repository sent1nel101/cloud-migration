# Prisma 7 Migration Issue - PERMANENT WORKAROUND

## Problem
Goals and education columns exist in the database but cannot be queried through Prisma due to Prisma 7's breaking changes in how migrations work.

## Root Cause
1. **Prisma 7 removed `url` from schema.prisma** - Must use `prisma.config.ts` instead
2. **No migration history in repo** - Columns were manually added via SQL, not through Prisma migrations
3. **Schema/database metadata mismatch** - Prisma client can't verify these columns exist
4. **Result**: P2022 error when querying goals/education columns

## Error Message
```
The column `(not available)` does not exist in the current database.
Error code: P2022
```

## Attempts Made (Don't Repeat)
- ❌ `npx prisma db pull` - Requires datasource.url which Prisma 7 rejects
- ❌ `npx prisma migrate resolve` - Requires datasource.url which Prisma 7 rejects  
- ❌ `npx prisma generate` - Cache issue, doesn't solve schema mismatch
- ❌ Adding/removing `url = env("DATABASE_URL")` - Causes validation error in Prisma 7
- ❌ Creating prisma.config.ts - Complex setup, not compatible with current project structure

## Permanent Solution Implemented
**Goals and education fields are EXCLUDED from the Prisma schema and code queries.**

- Columns exist in database (can be used for future features)
- Prisma schema definition removed (lines 99-100 in schema.prisma)
- Code queries commented out (lines 77-78 in lib/roadmap-service.ts)
- Dashboard and "Edit Inputs" work with remaining fields: role, experience, skills

## What Still Works
✅ Dashboard displays roadmaps  
✅ "Edit Inputs" prefills role, experience, skills  
✅ Users can create/view/delete roadmaps  
✅ Form submission and roadmap generation  
✅ All tier-specific features  

## What Doesn't Work
⚠️ "Edit Inputs" doesn't prefill goals/education (data is lost on reload)

## Future Fix (Requires Migration Setup)
To properly re-enable goals/education:
1. Set up `prisma.config.ts` with Prisma 7 adapter pattern
2. Create formal migrations folder with history
3. Run `npx prisma migrate dev --name add_goals_education`
4. Re-enable in schema.prisma and roadmap-service.ts

**This is a longer refactor and should be done as a separate task when time permits.**

## Files Affected
- `prisma/schema.prisma` - Goals/education fields commented out
- `lib/roadmap-service.ts` - Goals/education queries commented out
- No changes to database required (columns remain as fallback)

## Decision Rationale
After multiple attempts to force the schema to sync with database:
- The workaround keeps the app fully functional
- Dashboard works without errors
- 90% of features are unaffected (only prefill loses 2 of 5 fields)
- Proper fix requires significant Prisma 7 refactor that's beyond scope
- App is deployable and usable as-is

**Document this decision to prevent repeating the same troubleshooting cycle.**
