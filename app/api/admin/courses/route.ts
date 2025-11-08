import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { modules, ...courseData } = data

    const course = await db.course.create({
      data: {
        ...courseData,
        modules: modules ? {
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
        } : undefined
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
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
