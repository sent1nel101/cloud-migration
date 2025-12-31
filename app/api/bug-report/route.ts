import { NextRequest, NextResponse } from "next/server";

interface BugReportData {
  browser: string;
  errorMessage: string;
  datetime: string;
  userComments: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BugReportData = await request.json();

    // Validate that at least some data is provided
    if (!body.browser && !body.errorMessage && !body.userComments) {
      return NextResponse.json(
        { error: "Please provide at least some information about the bug" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Send an email to the support address
    // 2. Store in database for tracking
    // 3. Send confirmation email to user

    // For now, just log and return success
    console.log("Bug report submission:", {
      timestamp: new Date().toISOString(),
      ...body,
    });

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // TODO: Store in database
    // TODO: Create GitHub issue or track in bug tracking system

    return NextResponse.json(
      {
        success: true,
        message: "Bug report submitted successfully. Thank you for helping us improve!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bug report error:", error);
    return NextResponse.json(
      { error: "Failed to submit bug report" },
      { status: 500 }
    );
  }
}
