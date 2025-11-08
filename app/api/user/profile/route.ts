import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json()

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
