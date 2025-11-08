"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchaseWithCryptoButton } from "@/components/course/purchase-with-crypto-button"
import {
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  BookOpen,
  ArrowLeft,
  Award,
  Globe,
  Lock,
  ChevronRight,
  ChevronDown,
  Share2
} from "lucide-react"
import type { Course, CourseModule, Lesson } from "@prisma/client"

type CourseWithRelations = Course & {
  modules: (CourseModule & {
    lessons: Lesson[]
  })[]
  _count: {
    enrollments: number
  }
}

interface CourseDetailClientProps {
  course: CourseWithRelations
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
  const totalDuration = course.modules.reduce(
    (total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    0
  )

  // Parse JSON content
  let parsedContent = {
    features: [],
    learningOutcomes: [],
    requirements: [],
    includes: []
  }
  try {
    parsedContent = JSON.parse(course.content)
  } catch (e) {
    // Use defaults if parsing fails
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left Column - Course Info */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                {course.isPremium && <Badge>Premium</Badge>}
              </div>

              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {course.title}
              </h1>

              <p className="mb-6 text-lg text-muted-foreground">
                {course.description}
              </p>

              {/* Stats */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground">(250 ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course._count.enrollments.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(totalDuration / 60)} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=basant"
                  alt="Basant Singh"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="text-sm text-muted-foreground">Created by</div>
                  <div className="font-semibold">Basant Singh</div>
                </div>
              </div>
            </div>

            {/* Right Column - Course Card */}
            <div className="lg:sticky lg:top-4 lg:h-fit">
              <Card className="overflow-hidden shadow-xl">
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Button size="lg" className="rounded-full p-4">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="mb-2 text-3xl font-bold">${course.price}</div>
                    <div className="text-sm text-muted-foreground">
                      One-time payment, lifetime access
                    </div>
                    <div className="mt-2 text-lg font-semibold text-blue-600">
                      Or pay {(course.price / 3000).toFixed(4)} ETH
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PurchaseWithCryptoButton
                      courseId={course.id}
                      courseName={course.title}
                      priceInEth={parseFloat((course.price / 3000).toFixed(4))}
                    />
                    <Button size="lg" variant="outline" className="w-full">
                      Buy with Card (Coming Soon)
                    </Button>
                  </div>

                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      30-day money-back guarantee
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Lifetime access
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Certificate of completion
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* What You'll Learn */}
              {parsedContent.learningOutcomes && parsedContent.learningOutcomes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {parsedContent.learningOutcomes.map((outcome: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* This Course Includes */}
              {parsedContent.includes && parsedContent.includes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>This course includes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {parsedContent.includes.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p>{course.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              {parsedContent.requirements && parsedContent.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parsedContent.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.modules.length} modules • {totalLessons} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.modules.map((module, index) => (
                    <Card key={module.id} className="overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {expandedModules.includes(module.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                          <div>
                            <div className="font-semibold">Module {index + 1}: {module.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {module.lessons.length} lessons
                            </div>
                          </div>
                        </div>
                      </button>

                      {expandedModules.includes(module.id) && (
                        <div className="border-t bg-muted/20">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between border-b p-4 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isFree ? (
                                  <Play className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {lesson.isFree && (
                                  <Badge variant="outline" className="text-xs">Free Preview</Badge>
                                )}
                                <span>{lesson.duration} min</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Instructor Tab */}
            <TabsContent value="instructor">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=basant"
                      alt="Basant Singh"
                      className="h-24 w-24 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 text-2xl font-bold">Basant Singh</h3>
                      <p className="mb-4 text-muted-foreground">Blockchain Developer & Educator</p>
                      <p className="mb-6">
                        Senior blockchain developer with 5+ years of experience building DeFi protocols and smart contracts.
                        Passionate about education and making Web3 accessible.
                      </p>

                      <div className="grid grid-cols-3 gap-4 border-t pt-4">
                        <div>
                          <div className="text-2xl font-bold">4.8</div>
                          <div className="text-sm text-muted-foreground">Instructor Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course._count.enrollments.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">5</div>
                          <div className="text-sm text-muted-foreground">Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join {course._count.enrollments.toLocaleString()}+ students already learning {course.title}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg">
                Enroll for ${course.price}
              </Button>
              <Button size="lg" variant="outline">
                Try Free Preview
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
