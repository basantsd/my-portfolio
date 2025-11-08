import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import CourseDetailClient from "./course-detail-client"

export const dynamic = "force-dynamic"

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

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

  return <CourseDetailClient course={course} />
}
