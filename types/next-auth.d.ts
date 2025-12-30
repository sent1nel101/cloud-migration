/**
 * NextAuth.js Type Augmentation
 * Extends the default User and Session types to include custom fields
 */

import { DefaultSession } from "next-auth";
import type { Tier } from "@/app/generated/prisma";

declare module "next-auth" {
  /**
   * Extended User type to include tier and id
   */
  interface User {
    id: string;
    tier: Tier;
  }

  /**
   * Extended Session type to include user id and tier
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      tier: Tier;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT token type to include tier and id
   */
  interface JWT {
    id: string;
    tier: Tier;
  }
}
