import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { testId } = await params
    const { answers } = await req.json()

    // Get test with questions and correct answers
    const test = await db.sectionTest.findUnique({
      where: { id: testId },
      include: {
        section: {
          include: {
            course: true
          }
        },
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Check enrollment
    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: test.section.courseId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in course" }, { status: 403 })
    }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const detailedAnswers: Record<string, any> = {}

    test.questions.forEach((question) => {
      totalPoints += question.points
      const userAnswers = answers[question.id] || []
      const correctAnswerIds = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.id)

      // Check if user selected exactly the correct answers
      const isCorrect =
        userAnswers.length === correctAnswerIds.length &&
        userAnswers.every((id: string) => correctAnswerIds.includes(id)) &&
        correctAnswerIds.every(id => userAnswers.includes(id))

      if (isCorrect) {
        earnedPoints += question.points
      }

      detailedAnswers[question.id] = {
        questionId: question.id,
        userAnswers,
        correctAnswers: correctAnswerIds,
        isCorrect,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0
      }
    })

    const score = Math.round((earnedPoints / totalPoints) * 100)
    const passed = score >= test.passingScore

    // Save test attempt
    const attempt = await db.userTestAttempt.create({
      data: {
        userId: session.user.id,
        testId: test.id,
        score,
        passed,
        answers: detailedAnswers
      }
    })

    // If passed and section requires test, unlock next section
    if (passed && test.section.requireTest) {
      // Mark current section as completed
      await db.userSectionProgress.upsert({
        where: {
          userId_sectionId: {
            userId: session.user.id,
            sectionId: test.section.id
          }
        },
        update: {
          completed: true,
          completedAt: new Date()
        },
        create: {
          userId: session.user.id,
          sectionId: test.section.id,
          unlocked: true,
          completed: true,
          completedAt: new Date()
        }
      })

      // Find next section and unlock it
      const sections = await db.courseSection.findMany({
        where: { courseId: test.section.courseId },
        orderBy: { order: "asc" }
      })

      const currentIndex = sections.findIndex(s => s.id === test.section.id)
      const nextSection = sections[currentIndex + 1]

      if (nextSection) {
        await db.userSectionProgress.upsert({
          where: {
            userId_sectionId: {
              userId: session.user.id,
              sectionId: nextSection.id
            }
          },
          update: {
            unlocked: true
          },
          create: {
            userId: session.user.id,
            sectionId: nextSection.id,
            unlocked: true,
            completed: false
          }
        })
      }

      // Update course progress
      const totalSections = sections.length
      const completedSections = await db.userSectionProgress.count({
        where: {
          userId: session.user.id,
          sectionId: {
            in: sections.map(s => s.id)
          },
          completed: true
        }
      })

      const courseProgress = Math.round((completedSections / totalSections) * 100)
      const courseCompleted = completedSections === totalSections

      await db.courseEnrollment.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: test.section.courseId
          }
        },
        data: {
          progress: courseProgress,
          completed: courseCompleted
        }
      })
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      passingScore: test.passingScore
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}
