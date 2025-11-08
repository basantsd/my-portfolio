import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { TestResultsClient } from "./results-client"

export const dynamic = "force-dynamic"

export default async function TestResultsPage({
  params
}: {
  params: Promise<{ slug: string; testId: string; attemptId: string }>
}) {
  const { slug, testId, attemptId } = await params
  const session = await auth()

  if (!session) {
    redirect(`/login`)
  }

  // Get attempt with test details
  const attempt = await db.userTestAttempt.findUnique({
    where: { id: attemptId },
    include: {
      test: {
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
      }
    }
  })

  if (!attempt || attempt.userId !== session.user.id) {
    notFound()
  }

  if (attempt.test.section.course.slug !== slug || attempt.test.id !== testId) {
    notFound()
  }

  return (
    <TestResultsClient
      attempt={attempt}
      test={attempt.test}
      course={attempt.test.section.course}
    />
  )
}
