/**
 * User Sign Up API
 * POST /api/auth/signup
 * Creates a new user account with email and password
 */

import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/user-service";
import { z } from "zod";

// Request validation schema
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type SignupRequest = z.infer<typeof signupSchema>;

/**
 * POST /api/auth/signup
 * Creates a new user account
 *
 * @param req - Next.js request object
 * @returns JSON response with user data or error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = signupSchema.parse(body);

    // Create user
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    // Return created user (without password)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
        },
        message: "Account created successfully. Please sign in.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    // Handle duplicate email error
    if (
      error instanceof Error &&
      error.message === "Email already registered"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 409 }
      );
    }

    // Handle unexpected errors
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
