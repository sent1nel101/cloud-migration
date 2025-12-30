/**
 * NextAuth.js v5 Configuration
 * Handles user authentication, session management, and user tier tracking
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    /**
     * Email/Password authentication
     * Users can sign up and log in with email and password
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        // Verify credentials are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // User not found or no password hash
        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tier: user.tier,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    /**
     * JWT callback - runs whenever JWT is created or updated
     * Always fetch fresh user data to ensure tier is current
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
      } else if (token.id) {
        // Always fetch fresh user data from database to get latest tier
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { tier: true },
        });
        if (freshUser) {
          token.tier = freshUser.tier;
        }
      }
      
      return token;
    },

    /**
     * Session callback - runs whenever session is checked
     * Add tier to session object
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.tier = token.tier as any;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "development-secret",
  },

  secret: process.env.NEXTAUTH_SECRET || "development-secret",
};
