import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProjectForm } from "../../project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const project = await db.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-2">Update project details</p>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
