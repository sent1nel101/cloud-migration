# Database Schema Sync - Add Missing Columns

## Problem

Dashboard error when fetching roadmaps:
```
The column `(not available)` does not exist in the current database.
```

## Root Cause

Session 33 added two columns to the Roadmap table in `prisma/schema.prisma`:
- `goals TEXT` - Original user career goals
- `education TEXT` - Education level

Your database hasn't been updated with these columns yet.

## Solution: Add Missing Columns with SQL

Since DATABASE_URL is configured correctly in .env.local, use a SQL client to add the missing columns directly.

### Step 1: Connect to Your Database

Use your preferred PostgreSQL client (pgAdmin, DBeaver, psql, etc.) and connect with the DATABASE_URL credentials from .env.local.

### Step 2: Run This SQL

```sql
-- Add the missing columns to the Roadmap table
ALTER TABLE "Roadmap" ADD COLUMN IF NOT EXISTS goals TEXT;
ALTER TABLE "Roadmap" ADD COLUMN IF NOT EXISTS education TEXT;

-- Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Roadmap' 
ORDER BY column_name;
```

### Step 3: Verify Success

You should see the new columns in the output:
```
 column_name  | data_type
--------------+----------
 createdAt    | timestamp
 education    | text
 goals        | text
 id           | uuid
 ...
```

### Step 4: Restart Dev Server

```bash
# Stop the dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 5: Test

Go to http://localhost:3000/dashboard - roadmaps should now load.

## Why This Approach?

- ✅ DATABASE_URL already configured and working
- ✅ Prisma CLI has version issues with Prisma 7 config
- ✅ Direct SQL is fast and reliable for local development
- ✅ Doesn't require prisma migrate reset (preserves any existing data)
- ✅ Works with any PostgreSQL client you're familiar with

## Alternative: If You Don't Have a SQL Client

Use psql (PostgreSQL command line) if PostgreSQL is installed:

```bash
psql "postgresql://[user]:[password]@[host]:[port]/[database]"
```

Then paste the SQL commands above.

## Schema Information

These are the exact columns added in Session 33:

```prisma
goals         String @db.Text  // Original career goals from user input
education     String? @db.Text  // Education level (optional)
```

Both are stored as TEXT/VARCHAR in PostgreSQL and are used for the "Edit Inputs" feature on the dashboard.
