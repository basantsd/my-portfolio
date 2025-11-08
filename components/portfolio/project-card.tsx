"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    tags: string[]
    githubUrl?: string | null
    liveUrl?: string | null
    status: string
    image: string
    images?: string[]
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const allImages = project.images && project.images.length > 0
    ? project.images
    : [project.image]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <Card className="group overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      {/* Image Slider */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <img
          src={allImages[currentImageIndex]}
          alt={`${project.title} - Image ${currentImageIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-500"
        />

        {/* Slider Controls - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
          <Badge
            variant={
              project.status === "COMPLETED"
                ? "default"
                : project.status === "IN_PROGRESS"
                ? "secondary"
                : "outline"
            }
            className="shrink-0"
          >
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
            <Badge key={tag} variant="outline" className="text-xs hover:scale-110 transition-transform">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          {project.githubUrl && project.githubUrl !== "#" && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </Link>
            </Button>
          )}
          {project.liveUrl && project.liveUrl !== "#" && (
            <Button variant="default" size="sm" asChild className="flex-1">
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Demo
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
