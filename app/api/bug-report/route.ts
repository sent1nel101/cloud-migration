import { NextRequest, NextResponse } from "next/server";

interface BugReportData {
  browser: string;
  errorMessage: string;
  datetime: string;
  userComments: string;
}

const CONTACT_EMAIL = "contact@darecmcdaniel.info";

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

    // Format the email with headers for each section
    const emailHtml = `
      <h2>New Bug Report Submission</h2>
      <hr />
      
      <h3>Browser Type</h3>
      <p>${body.browser || "Not provided"}</p>
      
      <h3>Error Message</h3>
      <p>${body.errorMessage ? body.errorMessage.replace(/\n/g, "<br />") : "Not provided"}</p>
      
      <h3>Date & Time</h3>
      <p>${body.datetime ? new Date(body.datetime).toLocaleString() : "Not provided"}</p>
      
      <h3>What were you doing?</h3>
      <p>${body.userComments ? body.userComments.replace(/\n/g, "<br />") : "Not provided"}</p>
    `;

    // Send email to contact address
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailResult = await resend.emails.send({
        from: "Cloud Designs <noreply@darecmcdaniel.info>",
        to: CONTACT_EMAIL,
        subject: "New Bug Report Submission",
        html: emailHtml,
      });

      if (emailResult.error) {
        console.error("Email send error:", emailResult.error);
        return NextResponse.json(
          { error: "Failed to send bug report" },
          { status: 500 }
        );
      }

      console.log("Bug report submission sent:", {
        timestamp: new Date().toISOString(),
        emailId: emailResult.data?.id,
        ...body,
      });
    } catch (emailError) {
      console.error("Resend error:", emailError);
      // Log but don't fail - API key might not be set in dev
      console.log("Bug report submission logged (email not sent):", {
        timestamp: new Date().toISOString(),
        ...body,
      });
    }

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
