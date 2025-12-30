import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password
 * Handle password reset request
 * For MVP: Returns success without actually sending email
 * In production, integrate with email service (SendGrid, Resend, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true },
    });

    // Always return success (don't reveal if email exists for security)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, reset instructions have been sent',
      });
    }

    // TODO: In production, generate a reset token and send via email
    // For now, just return success
    // 
    // const resetToken = crypto.randomBytes(32).toString('hex');
    // const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    // const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    //
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetToken: resetTokenHash,
    //     resetTokenExpiry,
    //   },
    // });
    //
    // Send email with reset link (requires email service integration)
    // const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, reset instructions have been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    );
  }
}
