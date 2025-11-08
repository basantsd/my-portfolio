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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      )
    }

    // Delete any existing verification tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    })

    // Generate new verification token
    const verificationToken = randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setHours(expires.getHours() + 24) // Token expires in 24 hours

    await db.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
      },
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&email=${email}`

    try {
      // If Resend API key is configured, send email
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@example.com",
          to: email,
          subject: "Verify your email address",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Hi ${user.name || "there"},</p>
              <p>Please verify your email address by clicking the link below:</p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Verify Email Address
              </a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p>Best regards,<br>The Team</p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    )
  }
}
