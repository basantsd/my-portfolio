"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, Play, CheckCircle, BookOpen } from "lucide-react"
import type { Course, CourseModule, Lesson, CourseLevel } from "@prisma/client"

type CourseWithRelations = Course & {
  modules: (CourseModule & {
    lessons: Lesson[]
  })[]
  _count: {
    enrollments: number
  }
}

interface CoursesClientProps {
  courses: CourseWithRelations[]
}

export default function CoursesClient({ courses }: CoursesClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | null>(null)

  const levels: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    return matchesLevel
  })

  const calculateTotalLessons = (course: CourseWithRelations) => {
    return course.modules.reduce((total, module) => total + module.lessons.length, 0)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Learn Blockchain Development</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Master Web3 Development
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Learn blockchain development with hands-on courses covering Solidity, DeFi, NFTs, and more.
              Build real-world projects and launch your Web3 career.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-semibold">{courses.reduce((total, c) => total + c.duration, 0) / 60} Hours of Content</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">{courses.reduce((total, c) => total + c._count.enrollments, 0).toLocaleString()} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-semibold">4.8 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel(null)}
          >
            All Levels
          </Button>
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
            >
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const totalLessons = calculateTotalLessons(course)
            const features = course.content ? JSON.parse(course.content).features || [] : []

            return (
              <Card key={course.id} className="group flex flex-col overflow-hidden hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  {course.isPremium && (
                    <Badge className="absolute right-2 top-2">Premium</Badge>
                  )}
                </div>

                <CardHeader className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">{course.level}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.floor(course.duration / 60)}h
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {totalLessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course._count.enrollments}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {features.slice(0, 3).map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-2xl font-bold">${course.price}</span>
                    <Button asChild>
                      <Link href={`/courses/${course.slug}`}>Enroll Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Start Learning Today</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of developers learning blockchain development.
              Get lifetime access to all courses with our premium membership.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact">Get Premium Access</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
