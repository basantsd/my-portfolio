import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { projectSchema } from "@/lib/validations"

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    const where: any = {}
    if (featured === "true") {
      where.featured = true
    }

    const projects = await db.project.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = projectSchema.parse(body)

    const project = await db.project.create({
      data: validated,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
