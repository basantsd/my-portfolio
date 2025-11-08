import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    // Get enrollment
    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      )
    }

    // Find active session
    const activeSession = await db.learningSession.findFirst({
      where: {
        enrollmentId: enrollment.id,
        endTime: null,
      },
    })

    if (!activeSession) {
      return NextResponse.json({ active: false, session: null })
    }

    return NextResponse.json({ active: true, session: activeSession })
  } catch (error) {
    console.error("Get active session error:", error)
    return NextResponse.json(
      { error: "Failed to get active session" },
      { status: 500 }
    )
  }
}
