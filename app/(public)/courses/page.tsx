import { db } from "@/lib/db"
import CoursesClient from "./courses-client"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: {
      published: true
    },
    include: {
      modules: {
        include: {
          lessons: true
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return <CoursesClient courses={courses} />
}
