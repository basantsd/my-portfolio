import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      })
    }

    // Delete any existing reset tokens
    await db.verificationToken.deleteMany({
      where: {
        identifier: `reset:${email}`,
      },
    })

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // Token expires in 1 hour

    await db.verificationToken.create({
      data: {
        identifier: `reset:${email}`,
        token: resetToken,
        expires,
      },
    })

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@example.com",
          to: email,
          subject: "Reset Your Password",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>Hi ${user.name || "there"},</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Reset Password
              </a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p>Best regards,<br>The Team</p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
