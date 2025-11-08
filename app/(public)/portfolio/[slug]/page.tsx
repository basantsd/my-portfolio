import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import ProjectDetailClient from "./project-detail-client"

export const dynamic = "force-dynamic"

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const project = await db.project.findUnique({
    where: { slug }
  })

  if (!project) {
    notFound()
  }

  // Get related projects (same tags)
  const relatedProjects = await db.project.findMany({
    where: {
      id: { not: project.id },
      tags: {
        hasSome: project.tags
      }
    },
    take: 3,
    orderBy: {
      createdAt: "desc"
    }
  })

  return <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
}
