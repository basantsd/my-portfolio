import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { CourseForm } from "../../course-form"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: true
        },
        orderBy: { order: "asc" }
      }
    }
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground mt-2">Update course details</p>
      </div>
      <CourseForm course={course} />
    </div>
  )
}
