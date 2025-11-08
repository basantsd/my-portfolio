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
import { Loader2, Plus } from "lucide-react"
import { SectionForm, type Section } from "./section-form"

type Course = {
  id?: string
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
}

type CourseSectionFormProps = {
  course?: Course & { sections?: any[] }
}

export function CourseSectionForm({ course }: CourseSectionFormProps) {
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

  const [sections, setSections] = useState<Section[]>(
    course?.sections || [
      {
        title: "Introduction",
        description: "Get started with the course",
        order: 0,
        requireTest: false,
        topics: [
          {
            title: "Welcome to the Course",
            description: "Course overview and what you'll learn",
            videoUrl: "https://example.com/video1.mp4",
            duration: 10,
            order: 0,
            isFree: true
          }
        ],
        test: null
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
        sections: sections.map((section, sIndex) => ({
          ...section,
          order: sIndex,
          topics: section.topics.map((topic, tIndex) => ({
            ...topic,
            order: tIndex,
            duration: Number(topic.duration)
          })),
          test: section.test ? {
            ...section.test,
            passingScore: Number(section.test.passingScore),
            timeLimit: section.test.timeLimit ? Number(section.test.timeLimit) : null,
            questions: section.test.questions.map((q, qIndex) => ({
              ...q,
              order: qIndex,
              points: Number(q.points),
              answers: q.answers.map((a, aIndex) => ({
                ...a,
                order: aIndex
              }))
            }))
          } : null
        }))
      }

      const url = course
        ? `/api/admin/courses/${course.id}/sections`
        : "/api/admin/courses/sections"

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

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "New Section",
        description: "",
        order: sections.length,
        requireTest: false,
        topics: [],
        test: null
      }
    ])
  }

  const updateSection = (index: number, section: Section) => {
    const newSections = [...sections]
    newSections[index] = section
    setSections(newSections)
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
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

        {/* Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Course Sections</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Add sections with topics and optional tests. Tests can lock the next section until passed.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, index) => (
              <SectionForm
                key={index}
                section={section}
                sectionIndex={index}
                onUpdate={(updated) => updateSection(index, updated)}
                onRemove={() => removeSection(index)}
              />
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
