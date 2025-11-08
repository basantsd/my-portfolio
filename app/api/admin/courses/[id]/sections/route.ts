import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const { sections, ...courseData } = data

    // Delete all existing sections (cascade will delete topics, tests, questions, answers)
    await db.courseSection.deleteMany({
      where: { courseId: id }
    })

    // Update course with new sections
    const course = await db.course.update({
      where: { id },
      data: {
        ...courseData,
        sections: sections ? {
          create: sections.map((section: any) => ({
            title: section.title,
            description: section.description,
            order: section.order,
            requireTest: section.requireTest,
            topics: {
              create: section.topics.map((topic: any) => ({
                title: topic.title,
                description: topic.description,
                videoUrl: topic.videoUrl,
                duration: topic.duration,
                order: topic.order,
                isFree: topic.isFree
              }))
            },
            test: section.test ? {
              create: {
                title: section.test.title,
                description: section.test.description,
                passingScore: section.test.passingScore,
                timeLimit: section.test.timeLimit,
                questions: {
                  create: section.test.questions.map((question: any) => ({
                    question: question.question,
                    explanation: question.explanation,
                    order: question.order,
                    points: question.points,
                    answers: {
                      create: question.answers.map((answer: any) => ({
                        answer: answer.answer,
                        isCorrect: answer.isCorrect,
                        order: answer.order
                      }))
                    }
                  }))
                }
              }
            } : undefined
          }))
        } : undefined
      },
      include: {
        sections: {
          include: {
            topics: true,
            test: {
              include: {
                questions: {
                  include: {
                    answers: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error updating course with sections:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}
