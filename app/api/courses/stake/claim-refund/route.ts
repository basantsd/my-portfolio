import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, transactionHash } = await req.json()

    if (!courseId || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get enrollment
    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      )
    }

    if (!enrollment.isStakeToLearn) {
      return NextResponse.json(
        { error: "This is not a stake-to-learn course" },
        { status: 400 }
      )
    }

    if (enrollment.refundClaimed) {
      return NextResponse.json(
        { error: "Refund already claimed" },
        { status: 400 }
      )
    }

    if (enrollment.adminClaimed) {
      return NextResponse.json(
        { error: "Stake already claimed by admin" },
        { status: 400 }
      )
    }

    // Update enrollment to mark refund as claimed
    const updatedEnrollment = await db.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        refundClaimed: true,
        refundClaimedAt: new Date(),
        transactionId: transactionHash,
      },
    })

    // Update payment status if exists
    if (enrollment.payment) {
      await db.blockchainPayment.update({
        where: { enrollmentId: enrollment.id },
        data: {
          status: "REFUNDED",
        },
      })
    }

    return NextResponse.json({
      success: true,
      enrollment: updatedEnrollment,
      message: "Refund claimed successfully",
    })
  } catch (error) {
    console.error("Claim refund error:", error)
    return NextResponse.json(
      { error: "Failed to claim refund" },
      { status: 500 }
    )
  }
}
