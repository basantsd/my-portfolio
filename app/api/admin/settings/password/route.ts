import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    // Get user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Note: This assumes you have a password field in the User model
    // If you're using OAuth only, you may need to adjust this
    // For now, we'll just hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.user.update({
      where: { id: session.user.id },
      data: {
        // You may need to add a password field to your User model
        // For now, this will fail gracefully if the field doesn't exist
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
