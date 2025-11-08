import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/courses - Get all published courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const level = searchParams.get("level")

    const where: any = {}

    if (published === "true") {
      where.published = true
    }

    if (level) {
      where.level = level
    }

    const courses = await db.course.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}
