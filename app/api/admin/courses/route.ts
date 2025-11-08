import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    const course = await db.course.create({
      data
    })

    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
