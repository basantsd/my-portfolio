import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      courseId,
      courseName,
      transactionHash,
      walletAddress,
      network,
      amount,
      amountInEth,
    } = await req.json()

    // Validate required fields
    if (!courseId || !transactionHash || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
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

    // Check if transaction already used
    const existingPayment = await db.blockchainPayment.findUnique({
      where: { transactionHash },
    })

    if (existingPayment) {
      return NextResponse.json(
        { error: "Transaction already used" },
        { status: 400 }
      )
    }

    // Create enrollment with payment
    const enrollment = await db.courseEnrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        paymentMethod: "CRYPTO",
        transactionId: transactionHash,
        payment: {
          create: {
            walletAddress,
            transactionHash,
            amount: amount.toString(),
            amountInEth: parseFloat(amountInEth),
            courseId,
            courseName: courseName || course.title,
            network,
            status: "CONFIRMED",
            confirmedAt: new Date(),
          },
        },
      },
      include: {
        course: true,
        payment: true,
      },
    })

    // Initialize progress for first section if course has sections
    const sections = await db.courseSection.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      take: 1,
    })

    if (sections.length > 0) {
      await db.userSectionProgress.create({
        data: {
          userId: session.user.id,
          sectionId: sections[0].id,
          unlocked: true,
          completed: false,
        },
      })
    }

    return NextResponse.json({
      success: true,
      enrollment,
      course: enrollment.course,
      payment: enrollment.payment,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
