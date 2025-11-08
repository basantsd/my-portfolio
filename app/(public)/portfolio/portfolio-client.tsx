"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, ExternalLink, Search } from "lucide-react"
import type { Project, ProjectStatus } from "@prisma/client"

interface PortfolioClientProps {
  projects: Project[]
}

export default function PortfolioClient({ projects }: PortfolioClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Get all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  )

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || project.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const getStatusVariant = (status: ProjectStatus) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "IN_PROGRESS":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Portfolio</h1>
        <p className="text-lg text-muted-foreground">
          Explore my blockchain and Web3 projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/portfolio/${project.slug}`}>
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Link href={`/portfolio/${project.slug}`}>
                  <CardTitle className="text-xl hover:text-primary">{project.title}</CardTitle>
                </Link>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
              <CardDescription className="line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/portfolio/${project.slug}`}>
                    View Details
                  </Link>
                </Button>
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={project.liveUrl} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}
