import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

/**
 * Update student progress and sync with smart contract
 * This should be called periodically or when significant progress is made
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId } = await req.json()

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    // Get enrollment with related data
    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
      include: {
        course: {
          include: {
            sections: {
              include: {
                test: {
                  include: {
                    attempts: {
                      where: {
                        userId: session.user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      )
    }

    const course = enrollment.course

    // Calculate completion percentage
    const totalSections = course.sections.length
    const completedSections = await db.userSectionProgress.count({
      where: {
        userId: session.user.id,
        sectionId: {
          in: course.sections.map(s => s.id),
        },
        completed: true,
      },
    })
    const completionPercentage = totalSections > 0
      ? Math.round((completedSections / totalSections) * 100)
      : 0

    // Calculate test average
    const allTests = course.sections
      .filter(s => s.test)
      .map(s => s.test!)

    let testAverage = 0
    if (allTests.length > 0) {
      const testScores: number[] = []
      for (const test of allTests) {
        // Get best attempt for each test
        const bestAttempt = test.attempts.reduce((best, attempt) => {
          return attempt.score > (best?.score || 0) ? attempt : best
        }, test.attempts[0])

        if (bestAttempt) {
          testScores.push(bestAttempt.score)
        }
      }

      if (testScores.length > 0) {
        testAverage = testScores.reduce((sum, score) => sum + score, 0) / testScores.length
      }
    }

    // Update enrollment with calculated progress
    const updatedEnrollment = await db.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        completionPercentage,
        testAverage,
        // totalLearningMinutes is already tracked via learning sessions
      },
    })

    // Check if eligible for refund
    const refundEligible =
      completionPercentage >= course.requiredCompletion ||
      testAverage >= course.requiredTestAverage ||
      (course.durationDays && course.dailyLearningMinutes &&
       enrollment.totalLearningMinutes >= (course.durationDays * course.dailyLearningMinutes))

    // Update refund eligibility
    if (refundEligible && !enrollment.refundEligible) {
      await db.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { refundEligible: true },
      })
    }

    return NextResponse.json({
      success: true,
      progress: {
        completionPercentage,
        testAverage: Math.round(testAverage * 100) / 100,
        totalLearningMinutes: enrollment.totalLearningMinutes,
        refundEligible,
      },
      message: "Progress updated successfully",
    })
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}
