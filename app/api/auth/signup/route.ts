import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: "USER",
      },
    })

    // Generate verification token
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
              <h2>Welcome to Our Platform!</h2>
              <p>Hi ${name || "there"},</p>
              <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Verify Email Address
              </a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create this account, you can safely ignore this email.</p>
              <p>Best regards,<br>The Team</p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Continue even if email fails - user can request new verification
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
      requiresVerification: true,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
