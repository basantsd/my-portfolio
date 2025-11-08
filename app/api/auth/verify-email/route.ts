import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json()

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required" },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await db.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: token,
          },
        },
      })

      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      )
    }

    // Update user to mark email as verified
    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete the used verification token
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now login.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    )
  }
}
