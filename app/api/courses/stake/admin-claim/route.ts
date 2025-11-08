import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enrollmentId, transactionHash } = await req.json()

    if (!enrollmentId || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get enrollment
    const enrollment = await db.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        course: true,
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      )
    }

    if (!enrollment.isStakeToLearn) {
      return NextResponse.json(
        { error: "This is not a stake-to-learn enrollment" },
        { status: 400 }
      )
    }

    if (enrollment.refundClaimed) {
      return NextResponse.json(
        { error: "Student already claimed refund" },
        { status: 400 }
      )
    }

    if (enrollment.adminClaimed) {
      return NextResponse.json(
        { error: "Stake already claimed by admin" },
        { status: 400 }
      )
    }

    // Update enrollment to mark admin claim
    const updatedEnrollment = await db.courseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        adminClaimed: true,
        adminClaimedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      enrollment: updatedEnrollment,
      message: "Stake claimed successfully",
    })
  } catch (error) {
    console.error("Admin claim error:", error)
    return NextResponse.json(
      { error: "Failed to claim stake" },
      { status: 500 }
    )
  }
}
