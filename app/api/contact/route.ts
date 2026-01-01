import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  type: string;
  subject: string;
  message: string;
}

const CONTACT_EMAIL = "contact@darecmcdaniel.info";

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

    // Send email to contact address
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailResult = await resend.emails.send({
        from: "Cloud Designs <noreply@darecmcdaniel.info>",
        to: CONTACT_EMAIL,
        replyTo: body.email,
        subject: `New Contact Form: ${body.subject} (${body.type})`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${body.name} (${body.email})</p>
          ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ""}
          <p><strong>Type:</strong> ${body.type}</p>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <hr />
          <h3>Message:</h3>
          <p>${body.message.replace(/\n/g, "<br />")}</p>
        `,
      });

      if (emailResult.error) {
        console.error("Email send error:", emailResult.error);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }

      console.log("Contact form submission sent:", {
        timestamp: new Date().toISOString(),
        emailId: emailResult.data?.id,
        ...body,
      });
    } catch (emailError) {
      console.error("Resend error:", emailError);
      // Log but don't fail - API key might not be set in dev
      console.log("Contact form submission logged (email not sent):", {
        timestamp: new Date().toISOString(),
        ...body,
      });
    }

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
