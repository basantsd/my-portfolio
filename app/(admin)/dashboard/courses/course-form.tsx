"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Trash2 } from "lucide-react"

type Lesson = {
  id?: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  isFree: boolean
}

type CourseModule = {
  id?: string
  title: string
  order: number
  lessons: Lesson[]
}

type Course = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  thumbnail: string
  price: number
  isPremium: boolean
  published: boolean
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  duration: number
  modules?: CourseModule[]
}

type CourseFormProps = {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: course?.title || "",
    slug: course?.slug || "",
    description: course?.description || "",
    content: course?.content || JSON.stringify({ features: [], learningOutcomes: [], requirements: [], includes: [] }, null, 2),
    thumbnail: course?.thumbnail || "",
    price: course?.price || 0,
    isPremium: course?.isPremium || false,
    published: course?.published || false,
    level: course?.level || "BEGINNER",
    duration: course?.duration || 0,
  })

  const [modules, setModules] = useState<CourseModule[]>(
    course?.modules || [
      {
        title: "Introduction",
        order: 0,
        lessons: [
          {
            title: "Course Overview",
            description: "What you'll learn in this course",
            videoUrl: "https://example.com/video1.mp4",
            duration: 10,
            order: 0,
            isFree: true
          }
        ]
      }
    ]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse content JSON
      let contentData
      try {
        contentData = JSON.parse(formData.content)
      } catch {
        alert("Invalid JSON in content field")
        setLoading(false)
        return
      }

      const data = {
        ...formData,
        content: JSON.stringify(contentData),
        price: Number(formData.price),
        duration: Number(formData.duration),
        modules: modules.map((module, moduleIndex) => ({
          ...module,
          order: moduleIndex,
          lessons: module.lessons.map((lesson, lessonIndex) => ({
            ...lesson,
            order: lessonIndex,
            duration: Number(lesson.duration)
          }))
        }))
      }

      const url = course
        ? `/api/admin/courses/${course.id}`
        : "/api/admin/courses"

      const method = course ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save course")
      }

      router.push("/dashboard/courses")
      router.refresh()
    } catch (error) {
      console.error("Error saving course:", error)
      alert(error instanceof Error ? error.message : "Failed to save course. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setFormData({ ...formData, slug })
  }

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "New Module",
        order: modules.length,
        lessons: []
      }
    ])
  }

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index))
  }

  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...modules]
    newModules[index] = { ...newModules[index], [field]: value }
    setModules(newModules)
  }

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons.push({
      title: "New Lesson",
      description: "",
      videoUrl: "https://example.com/video.mp4",
      duration: 10,
      order: newModules[moduleIndex].lessons.length,
      isFree: false
    })
    setModules(newModules)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
    setModules(newModules)
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons[lessonIndex] = {
      ...newModules[moduleIndex].lessons[lessonIndex],
      [field]: value
    }
    setModules(newModules)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (JSON) *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={8}
                placeholder='{"features": [], "learningOutcomes": [], "requirements": [], "includes": []}'
                className="font-mono text-xs"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL *</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Total Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked as boolean })}
                />
                <Label htmlFor="isPremium" className="cursor-pointer">
                  Premium Course
                </Label>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish Course
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules & Lessons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Modules & Lessons</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addModule}>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {modules.map((module, moduleIndex) => (
              <Card key={moduleIndex}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Module {moduleIndex + 1} Title</Label>
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeModule(moduleIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Card key={lessonIndex} className="bg-muted/50">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Lesson Title</Label>
                              <Input
                                value={lesson.title}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Video URL</Label>
                              <Input
                                value={lesson.videoUrl}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, "videoUrl", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={lesson.description || ""}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "description", e.target.value)}
                            rows={2}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Duration (minutes)</Label>
                            <Input
                              type="number"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, "duration", Number(e.target.value))}
                              required
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                              checked={lesson.isFree}
                              onCheckedChange={(checked) => updateLesson(moduleIndex, lessonIndex, "isFree", checked)}
                            />
                            <Label className="cursor-pointer">Free Preview</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(moduleIndex)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {course ? "Update Course" : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
