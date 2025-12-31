/**
 * Resume Parse API Endpoint
 * POST /api/resume/parse
 * 
 * Accepts a resume file (PDF, DOCX, or TXT), parses it, and returns extracted career data
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { parseResume, ParsedResumeData } from "@/lib/resume-parser"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!["pdf", "docx", "txt"].includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      )
    }

    // Validate file size (5MB)
    const buffer = await file.arrayBuffer()
    if (buffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 413 }
      )
    }

    // Parse resume
    const bufferData = Buffer.from(buffer)
    const parsedData = await parseResume(
      bufferData,
      fileType as "pdf" | "docx" | "txt"
    )

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Resume parsing error:", error)
    const message = error instanceof Error ? error.message : "Resume parsing failed"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
