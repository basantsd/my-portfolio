import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import CourseDetailClient from "./course-detail-client"

export const dynamic = "force-dynamic"

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: "asc"
            }
          }
        },
        orderBy: {
          order: "asc"
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  })

  if (!course || !course.published) {
    notFound()
  }

  // Check if user is enrolled
  let isEnrolled = false
  if (session?.user?.id) {
    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    })
    isEnrolled = !!enrollment
  }

  return <CourseDetailClient course={course} isEnrolled={isEnrolled} />
}
