import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  type: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Send an email to the support address
    // 2. Store in database for tracking
    // 3. Send confirmation email to user

    // For now, just log and return success
    console.log("Contact form submission:", {
      timestamp: new Date().toISOString(),
      ...body,
    });

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // TODO: Store in database

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! We'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
