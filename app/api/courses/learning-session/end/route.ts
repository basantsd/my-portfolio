import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, courseId } = await req.json()

    // Find the active session
    let learningSession
    if (sessionId) {
      learningSession = await db.learningSession.findUnique({
        where: { id: sessionId },
        include: { enrollment: true },
      })
    } else if (courseId) {
      const enrollment = await db.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: courseId,
          },
        },
      })

      if (enrollment) {
        learningSession = await db.learningSession.findFirst({
          where: {
            enrollmentId: enrollment.id,
            endTime: null,
          },
          include: { enrollment: true },
        })
      }
    }

    if (!learningSession) {
      return NextResponse.json(
        { error: "No active learning session found" },
        { status: 404 }
      )
    }

    // Verify ownership
    if (learningSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const endTime = new Date()
    const durationMs = endTime.getTime() - learningSession.startTime.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))

    // Update learning session
    const updatedSession = await db.learningSession.update({
      where: { id: learningSession.id },
      data: {
        endTime: endTime,
        durationMinutes: durationMinutes,
      },
    })

    // Update enrollment total learning minutes
    const enrollment = await db.courseEnrollment.update({
      where: { id: learningSession.enrollmentId },
      data: {
        totalLearningMinutes: {
          increment: durationMinutes,
        },
      },
    })

    // Update streak if learning today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastLearning = enrollment.lastLearningDate
      ? new Date(enrollment.lastLearningDate)
      : null

    if (lastLearning) {
      lastLearning.setHours(0, 0, 0, 0)
    }

    let currentStreak = enrollment.currentStreak
    let longestStreak = enrollment.longestStreak

    if (!lastLearning || lastLearning.getTime() < today.getTime()) {
      // Learning for the first time today
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastLearning && lastLearning.getTime() === yesterday.getTime()) {
        // Consecutive day - increment streak
        currentStreak += 1
      } else {
        // Streak broken or first time - reset to 1
        currentStreak = 1
      }

      // Update longest streak if current is higher
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }

      // Update enrollment with streak data
      await db.courseEnrollment.update({
        where: { id: learningSession.enrollmentId },
        data: {
          lastLearningDate: new Date(),
          currentStreak: currentStreak,
          longestStreak: longestStreak,
        },
      })
    }

    return NextResponse.json({
      session: updatedSession,
      totalMinutes: enrollment.totalLearningMinutes + durationMinutes,
      currentStreak: currentStreak,
      longestStreak: longestStreak,
      message: "Learning session ended",
    })
  } catch (error) {
    console.error("End learning session error:", error)
    return NextResponse.json(
      { error: "Failed to end learning session" },
      { status: 500 }
    )
  }
}
