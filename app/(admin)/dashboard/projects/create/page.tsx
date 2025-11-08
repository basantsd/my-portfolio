import { ProjectForm } from "../project-form"

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Project</h1>
        <p className="text-muted-foreground mt-2">Add a new project to your portfolio</p>
      </div>
      <ProjectForm />
    </div>
  )
}
