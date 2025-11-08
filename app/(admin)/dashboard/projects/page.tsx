import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DeleteProjectButton } from "./delete-button"

export const dynamic = "force-dynamic"

export default async function ProjectsAdminPage() {
  const projects = await db.project.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" }
    ]
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/dashboard/projects/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle>{project.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge>{project.status}</Badge>
                    {project.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Slug: {project.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteProjectButton id={project.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
