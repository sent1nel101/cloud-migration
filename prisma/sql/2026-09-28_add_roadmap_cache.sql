-- Adds the RoadmapCache table (see model RoadmapCache in prisma/schema.prisma).
-- Additive and idempotent: safe to run more than once, touches no existing tables.
--
-- Apply manually (e.g. psql "$DATABASE_URL" -f prisma/sql/2026-09-28_add_roadmap_cache.sql).
-- Do NOT use `prisma db push` for this: the live "Roadmap" table has goals/education
-- columns that are not in schema.prisma, and db push would try to drop them.

CREATE TABLE IF NOT EXISTS "RoadmapCache" (
    "id"          TEXT         NOT NULL,
    "currentRole" TEXT         NOT NULL,
    "targetRole"  TEXT         NOT NULL,
    "content"     TEXT         NOT NULL,
    "model"       TEXT         NOT NULL,
    "hitCount"    INTEGER      NOT NULL DEFAULT 0,
    "lastHitAt"   TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapCache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoadmapCache_currentRole_targetRole_key"
    ON "RoadmapCache"("currentRole", "targetRole");

-- Block Supabase's public API (anon/authenticated keys). No policies are added,
-- so those roles get no access. The app connects via Prisma as the table owner,
-- which RLS does not restrict.
ALTER TABLE "RoadmapCache" ENABLE ROW LEVEL SECURITY;
