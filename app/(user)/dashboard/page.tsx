import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import DashboardClient from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function UserDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard")
  }

  // Get user's enrolled courses with progress
  const enrollments = await db.courseEnrollment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: {
        include: {
          sections: {
            include: {
              topics: true,
              test: true,
            },
            orderBy: { order: "asc" },
          },
        },
      },
      learningSessions: {
        orderBy: { startTime: "desc" },
        take: 10,
      },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  })

  // Get user section progress
  const sectionProgress = await db.userSectionProgress.findMany({
    where: {
      userId: session.user.id,
    },
  })

  // Get recent test attempts
  const testAttempts = await db.userTestAttempt.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      test: {
        include: {
          section: {
            include: {
              course: {
                select: {
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      completedAt: "desc",
    },
    take: 5,
  })

  return (
    <DashboardClient
      user={session.user}
      enrollments={enrollments}
      sectionProgress={sectionProgress}
      testAttempts={testAttempts}
    />
  )
}
