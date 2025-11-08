import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import * as bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user has a password (not OAuth only), verify current password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        )
      }

      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }
    }

    // Hash and set new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}
