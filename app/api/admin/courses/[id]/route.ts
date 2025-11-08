import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Cascade delete will handle modules and lessons
    await db.course.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}

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
    const { modules, ...courseData } = data

    // If modules are provided, delete existing ones and recreate
    if (modules) {
      // Delete all existing modules (cascade will delete lessons)
      await db.courseModule.deleteMany({
        where: { courseId: id }
      })

      // Update course with new modules
      const course = await db.course.update({
        where: { id },
        data: {
          ...courseData,
          modules: {
            create: modules.map((module: any) => ({
              title: module.title,
              order: module.order,
              lessons: {
                create: module.lessons.map((lesson: any) => ({
                  title: lesson.title,
                  description: lesson.description,
                  videoUrl: lesson.videoUrl,
                  duration: lesson.duration,
                  order: lesson.order,
                  isFree: lesson.isFree
                }))
              }
            }))
          }
        },
        include: {
          modules: {
            include: {
              lessons: true
            }
          }
        }
      })

      return NextResponse.json(course)
    } else {
      // Just update course data without touching modules
      const course = await db.course.update({
        where: { id },
        data: courseData
      })

      return NextResponse.json(course)
    }
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}
