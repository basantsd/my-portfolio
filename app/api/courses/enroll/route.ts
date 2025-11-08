import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      )
    }

    const { courseId } = await req.json()

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      )
    }

    // Create enrollment
    const enrollment = await db.courseEnrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        paymentMethod: "FREE",
      },
    })

    return NextResponse.json(
      {
        success: true,
        enrollment,
        message: "Successfully enrolled in the course",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Enrollment error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to enroll in course" },
      { status: 500 }
    )
  }
}
