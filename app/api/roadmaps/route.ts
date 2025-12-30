/**
 * User Roadmaps API
 * GET /api/roadmaps
 * Retrieves all saved roadmaps for the authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserRoadmaps } from "@/lib/roadmap-service";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/roadmaps
 * Returns list of user's saved roadmaps
 *
 * @param req - Next.js request object
 * @returns JSON array of roadmaps or error
 */
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in" },
        { status: 401 }
      );
    }

    // Get limit from query params (default 10)
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Fetch user's roadmaps
    const roadmaps = await getUserRoadmaps(session.user.id, limit);

    return NextResponse.json(
      {
        success: true,
        count: roadmaps.length,
        roadmaps,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch roadmaps",
      },
      { status: 500 }
    );
  }
}
