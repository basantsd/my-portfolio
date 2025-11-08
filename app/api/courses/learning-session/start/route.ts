import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, sectionId, topicId } = await req.json()

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    // Check enrollment exists
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

    // Check if there's already an active session (no endTime)
    const activeSession = await db.learningSession.findFirst({
      where: {
        enrollmentId: enrollment.id,
        endTime: null,
      },
    })

    if (activeSession) {
      return NextResponse.json({
        session: activeSession,
        message: "Session already active",
      })
    }

    // Create new learning session
    const learningSession = await db.learningSession.create({
      data: {
        enrollmentId: enrollment.id,
        userId: session.user.id,
        courseId: courseId,
        sectionId: sectionId || null,
        topicId: topicId || null,
        startTime: new Date(),
      },
    })

    return NextResponse.json({
      session: learningSession,
      message: "Learning session started",
    })
  } catch (error) {
    console.error("Start learning session error:", error)
    return NextResponse.json(
      { error: "Failed to start learning session" },
      { status: 500 }
    )
  }
}
