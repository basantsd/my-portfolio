import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { error: "Email already subscribed" },
          { status: 400 }
        )
      } else {
        // Re-subscribe
        await db.newsletter.update({
          where: { email },
          data: { subscribed: true, subscribedAt: new Date() },
        })

        return NextResponse.json(
          { success: true, message: "Re-subscribed successfully!" },
          { status: 200 }
        )
      }
    }

    // Create new subscription
    await db.newsletter.create({
      data: { email },
    })

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to subscribe" },
      { status: 500 }
    )
  }
}

// GET endpoint for admin to fetch subscribers
export async function GET(req: NextRequest) {
  try {
    const subscribers = await db.newsletter.findMany({
      orderBy: {
        subscribedAt: "desc",
      },
    })

    return NextResponse.json({ subscribers }, { status: 200 })
  } catch (error: any) {
    console.error("Fetch subscribers error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}
