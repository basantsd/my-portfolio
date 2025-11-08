import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"
import { STAKE_TO_LEARN_ABI } from "@/lib/stake-to-learn-config"

// Initialize public client for reading contract
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
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
      include: {
        course: true,
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

    if (!enrollment.enrollmentId) {
      return NextResponse.json(
        { error: "No blockchain enrollment found" },
        { status: 400 }
      )
    }

    // Check eligibility on smart contract
    const contractAddress = process.env.NEXT_PUBLIC_STAKE_CONTRACT_ADDRESS_SEPOLIA as `0x${string}`

    if (!contractAddress) {
      return NextResponse.json(
        { error: "Smart contract not configured" },
        { status: 500 }
      )
    }

    const [eligible, reason] = await publicClient.readContract({
      address: contractAddress,
      abi: STAKE_TO_LEARN_ABI,
      functionName: "isEligibleForRefund",
      args: [enrollment.enrollmentId as `0x${string}`],
    }) as [boolean, string]

    // Also check local progress for display
    const course = enrollment.course
    const requirementsMet = {
      completion: enrollment.completionPercentage >= course.requiredCompletion,
      testAverage: enrollment.testAverage >= course.requiredTestAverage,
      learningTime: false,
    }

    if (course.durationDays && course.dailyLearningMinutes) {
      const requiredMinutes = course.durationDays * course.dailyLearningMinutes
      requirementsMet.learningTime = enrollment.totalLearningMinutes >= requiredMinutes
    }

    const courseEnded = enrollment.courseEndDate
      ? new Date() >= new Date(enrollment.courseEndDate)
      : false

    return NextResponse.json({
      eligible,
      reason,
      courseEnded,
      alreadyClaimed: enrollment.refundClaimed,
      adminClaimed: enrollment.adminClaimed,
      progress: {
        completionPercentage: enrollment.completionPercentage,
        testAverage: enrollment.testAverage,
        totalLearningMinutes: enrollment.totalLearningMinutes,
        currentStreak: enrollment.currentStreak,
        longestStreak: enrollment.longestStreak,
      },
      requirements: {
        requiredCompletion: course.requiredCompletion,
        requiredTestAverage: course.requiredTestAverage,
        requiredDailyMinutes: course.dailyLearningMinutes,
        courseDurationDays: course.durationDays,
      },
      requirementsMet,
      stakeAmount: enrollment.stakedAmountEth,
    })
  } catch (error) {
    console.error("Check eligibility error:", error)
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    )
  }
}
