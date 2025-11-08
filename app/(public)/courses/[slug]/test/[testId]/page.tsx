import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { TestTakingClient } from "./test-client"

export const dynamic = "force-dynamic"

export default async function TestPage({
  params
}: {
  params: Promise<{ slug: string; testId: string }>
}) {
  const { slug, testId } = await params
  const session = await auth()

  if (!session) {
    redirect(`/login?callbackUrl=/courses/${slug}/test/${testId}`)
  }

  // Get test with questions and answers
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
          answers: {
            orderBy: { order: "asc" }
          }
        },
        orderBy: { order: "asc" }
      }
    }
  })

  if (!test || test.section.course.slug !== slug) {
    notFound()
  }

  // Check if user is enrolled in the course
  const enrollment = await db.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: test.section.courseId
      }
    }
  })

  if (!enrollment) {
    redirect(`/courses/${slug}`)
  }

  // Get previous attempts
  const previousAttempts = await db.userTestAttempt.findMany({
    where: {
      userId: session.user.id,
      testId: testId
    },
    orderBy: {
      completedAt: "desc"
    },
    take: 5
  })

  return (
    <TestTakingClient
      test={test}
      course={test.section.course}
      userId={session.user.id}
      previousAttempts={previousAttempts}
    />
  )
}
