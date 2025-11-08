"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Lock,
  Unlock,
  Play,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
  Award
} from "lucide-react"
import Link from "next/link"

type Topic = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  duration: number
  order: number
  isFree: boolean
}

type Question = {
  id: string
  question: string
  explanation: string | null
  order: number
  points: number
  answers: Answer[]
}

type Answer = {
  id: string
  answer: string
  isCorrect: boolean
  order: number
}

type Test = {
  id: string
  title: string
  description: string | null
  passingScore: number
  timeLimit: number | null
  questions: Question[]
}

type Section = {
  id: string
  title: string
  description: string | null
  order: number
  requireTest: boolean
  topics: Topic[]
  test: Test | null
}

type Course = {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  sections: Section[]
}

type SectionProgress = {
  id: string
  userId: string
  sectionId: string
  unlocked: boolean
  completed: boolean
  completedAt: Date | null
}

type TestAttempt = {
  id: string
  userId: string
  testId: string
  score: number
  passed: boolean
  answers: any
  completedAt: Date
}

type Enrollment = {
  id: string
  userId: string
  courseId: string
  progress: number
  completed: boolean
}

type Props = {
  course: Course
  enrollment: Enrollment
  sectionProgress: SectionProgress[]
  testAttempts: TestAttempt[]
  userId: string
}

export function CourseLearningClient({
  course,
  enrollment,
  sectionProgress,
  testAttempts,
  userId
}: Props) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(
    course.sections[0] || null
  )
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const isSectionUnlocked = (sectionId: string) => {
    const progress = sectionProgress.find(p => p.sectionId === sectionId)
    return progress?.unlocked || false
  }

  const isSectionCompleted = (sectionId: string) => {
    const progress = sectionProgress.find(p => p.sectionId === sectionId)
    return progress?.completed || false
  }

  const getTestAttempt = (testId: string) => {
    return testAttempts.find(a => a.testId === testId)
  }

  const canAccessSection = (section: Section) => {
    const sectionIndex = course.sections.findIndex(s => s.id === section.id)

    // First section is always unlocked
    if (sectionIndex === 0) return true

    // Check if previous section is completed or doesn't require test
    const prevSection = course.sections[sectionIndex - 1]
    if (!prevSection) return true

    const prevProgress = sectionProgress.find(p => p.sectionId === prevSection.id)

    // If previous section requires test, check if it's passed
    if (prevSection.requireTest && prevSection.test) {
      const attempt = getTestAttempt(prevSection.test.id)
      return attempt?.passed || false
    }

    // Otherwise, just check if previous section exists in progress
    return prevProgress?.unlocked || false
  }

  const totalTopics = course.sections.reduce((acc, s) => acc + s.topics.length, 0)
  const completedSections = sectionProgress.filter(p => p.completed).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{completedSections} / {course.sections.length} sections completed</span>
                <span>•</span>
                <span>{enrollment.progress}% complete</span>
              </div>
            </div>
            <Link href={`/courses/${course.slug}`}>
              <Button variant="outline">Exit Course</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Course Sections */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2 p-4">
                  {course.sections.map((section, index) => {
                    const unlocked = canAccessSection(section)
                    const completed = isSectionCompleted(section.id)
                    const hasTest = section.test !== null
                    const testAttempt = hasTest ? getTestAttempt(section.test!.id) : null

                    return (
                      <div key={section.id}>
                        <button
                          onClick={() => unlocked && setSelectedSection(section)}
                          disabled={!unlocked}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedSection?.id === section.id
                              ? "bg-primary text-primary-foreground"
                              : unlocked
                              ? "bg-muted hover:bg-muted/80"
                              : "bg-muted/50 cursor-not-allowed opacity-60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {unlocked ? (
                                  completed ? (
                                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                                  ) : (
                                    <Unlock className="h-4 w-4 flex-shrink-0" />
                                  )
                                ) : (
                                  <Lock className="h-4 w-4 flex-shrink-0" />
                                )}
                                <span className="font-medium text-sm truncate">
                                  {index + 1}. {section.title}
                                </span>
                              </div>
                              <div className="text-xs opacity-80">
                                {section.topics.length} topics
                                {hasTest && " • Test required"}
                              </div>
                              {testAttempt && (
                                <Badge
                                  variant={testAttempt.passed ? "default" : "destructive"}
                                  className="mt-1 text-xs"
                                >
                                  Test: {testAttempt.score}%
                                </Badge>
                              )}
                            </div>
                            {unlocked && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main Content - Topics & Video */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSection ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedSection.title}</CardTitle>
                        {selectedSection.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {selectedSection.description}
                          </p>
                        )}
                      </div>
                      {selectedSection.requireTest && (
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          Test Required
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Topics in this section:</h3>
                      <div className="space-y-2">
                        {selectedSection.topics.map((topic, index) => (
                          <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            className={`w-full p-4 rounded-lg border-2 transition-all ${
                              selectedTopic?.id === topic.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Play className="h-5 w-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <div className="font-medium">{topic.title}</div>
                                {topic.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {topic.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{topic.duration} minutes</span>
                                  {topic.isFree && (
                                    <>
                                      <span>•</span>
                                      <Badge variant="secondary" className="text-xs">Free Preview</Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {selectedSection.test && (
                        <>
                          <Separator className="my-6" />
                          <div className="p-4 border-2 border-dashed rounded-lg">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium">{selectedSection.test.title}</div>
                                {selectedSection.test.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedSection.test.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                  <span>{selectedSection.test.questions.length} questions</span>
                                  <span>•</span>
                                  <span>Passing score: {selectedSection.test.passingScore}%</span>
                                  {selectedSection.test.timeLimit && (
                                    <>
                                      <span>•</span>
                                      <span>Time limit: {selectedSection.test.timeLimit} min</span>
                                    </>
                                  )}
                                </div>
                                <div className="mt-4">
                                  <Link href={`/courses/${course.slug}/test/${selectedSection.test.id}`}>
                                    <Button>
                                      {getTestAttempt(selectedSection.test.id)
                                        ? "Retake Test"
                                        : "Start Test"
                                      }
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Video Player */}
                {selectedTopic && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedTopic.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                        <video
                          controls
                          className="w-full h-full"
                          src={selectedTopic.videoUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      {selectedTopic.description && (
                        <p className="text-muted-foreground">{selectedTopic.description}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a section to begin learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
