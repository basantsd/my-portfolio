import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/blog - Get all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const tag = searchParams.get("tag")

    const where: any = {}

    if (published === "true") {
      where.published = true
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    const posts = await db.blogPost.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}
