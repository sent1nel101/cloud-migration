/**
 * Prisma Client Instance
 * Singleton pattern to avoid creating multiple Prisma clients in development
 */

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter } as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
