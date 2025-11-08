import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/services - Get all active services
export async function GET(request: NextRequest) {
  try {
    const services = await db.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: "asc",
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}
