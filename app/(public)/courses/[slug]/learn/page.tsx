import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { CourseLearningClient } from "./learning-client"

export const dynamic = "force-dynamic"

export default async function CourseLearnPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  if (!session) {
    redirect(`/login?callbackUrl=/courses/${slug}/learn`)
  }

  // Get course with sections
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      sections: {
        include: {
          topics: {
            orderBy: { order: "asc" }
          },
          test: {
            include: {
              questions: {
                include: {
                  answers: {
                    orderBy: { order: "asc" }
                  }
                },
                orderBy: { order: "asc" }
              }
            }
          }
        },
        orderBy: { order: "asc" }
      }
    }
  })

  if (!course || !course.published) {
    notFound()
  }

  // Check if user is enrolled
  const enrollment = await db.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id
      }
    }
  })

  if (!enrollment) {
    redirect(`/courses/${slug}`)
  }

  // Get user's section progress
  const sectionProgress = await db.userSectionProgress.findMany({
    where: {
      userId: session.user.id,
      sectionId: {
        in: course.sections.map(s => s.id)
      }
    }
  })

  // Get user's test attempts
  const testIds = course.sections
    .filter(s => s.test)
    .map(s => s.test!.id)

  const testAttempts = await db.userTestAttempt.findMany({
    where: {
      userId: session.user.id,
      testId: {
        in: testIds
      }
    },
    orderBy: {
      completedAt: "desc"
    }
  })

  // Initialize progress for first section if needed
  if (course.sections.length > 0 && sectionProgress.length === 0) {
    await db.userSectionProgress.create({
      data: {
        userId: session.user.id,
        sectionId: course.sections[0].id,
        unlocked: true,
        completed: false
      }
    })
  }

  return (
    <CourseLearningClient
      course={course}
      enrollment={enrollment}
      sectionProgress={sectionProgress}
      testAttempts={testAttempts}
      userId={session.user.id}
    />
  )
}
