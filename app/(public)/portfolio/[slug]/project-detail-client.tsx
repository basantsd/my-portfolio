"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Share2,
  Calendar,
  Tag
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Project, ProjectStatus } from "@prisma/client"

interface ProjectDetailClientProps {
  project: Project
  relatedProjects: Project[]
}

export default function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
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
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Tags and Status */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              <Badge variant={getStatusVariant(project.status)}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            {/* Description */}
            <p className="mb-8 text-lg text-muted-foreground">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(project.createdAt)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <Button size="lg" asChild>
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View Code
                  </Link>
                </Button>
              )}
              {project.liveUrl && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Live Demo
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="ghost">
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl">
          <img
            src={project.image}
            alt={project.title}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* Project Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            </CardContent>
          </Card>

          {/* Technologies Used */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Technologies Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {project.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="my-8" />

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <Button size="lg" asChild>
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Link>
              </Button>
            )}
            {project.liveUrl && (
              <Button size="lg" variant="outline" asChild>
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Visit Live Site
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="border-t bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-3xl font-bold">Related Projects</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedProjects.map((relatedProject) => (
                  <Card key={relatedProject.id} className="group overflow-hidden hover:shadow-lg">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold line-clamp-1">{relatedProject.title}</h3>
                        <Badge variant={getStatusVariant(relatedProject.status)} className="text-xs">
                          {relatedProject.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {relatedProject.description}
                      </p>
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href={`/portfolio/${relatedProject.slug}`}>
                          View Project
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
