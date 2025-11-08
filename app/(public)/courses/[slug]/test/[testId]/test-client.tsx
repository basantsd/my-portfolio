"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, AlertCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Answer = {
  id: string
  answer: string
  isCorrect: boolean
  order: number
}

type Question = {
  id: string
  question: string
  explanation: string | null
  order: number
  points: number
  answers: Answer[]
}

type Test = {
  id: string
  title: string
  description: string | null
  passingScore: number
  timeLimit: number | null
  questions: Question[]
  section: {
    id: string
    title: string
    course: {
      id: string
      slug: string
      title: string
    }
  }
}

type PreviousAttempt = {
  id: string
  score: number
  passed: boolean
  completedAt: Date
}

type Props = {
  test: Test
  course: { id: string; slug: string; title: string }
  userId: string
  previousAttempts: PreviousAttempt[]
}

export function TestTakingClient({ test, course, userId, previousAttempts }: Props) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    test.timeLimit ? test.timeLimit * 60 : null
  )
  const [submitting, setSubmitting] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!started || timeRemaining === null) return

    if (timeRemaining <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [started, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = test.questions[currentQuestionIndex]

  const toggleAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => {
      const current = prev[questionId] || []
      if (current.includes(answerId)) {
        return {
          ...prev,
          [questionId]: current.filter(id => id !== answerId)
        }
      } else {
        return {
          ...prev,
          [questionId]: [...current, answerId]
        }
      }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const response = await fetch(`/api/courses/test/${test.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers })
      })

      if (!response.ok) {
        throw new Error("Failed to submit test")
      }

      const result = await response.json()

      // Redirect to results page
      router.push(`/courses/${course.slug}/test/${test.id}/results/${result.attemptId}`)
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Failed to submit test. Please try again.")
      setSubmitting(false)
    }
  }

  const answeredQuestions = Object.keys(selectedAnswers).length
  const progress = (answeredQuestions / test.questions.length) * 100

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{course.title}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{test.section.title}</span>
              </div>
              <CardTitle className="text-3xl">{test.title}</CardTitle>
              {test.description && (
                <CardDescription className="text-base mt-2">{test.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{test.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{test.passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Passing Score</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {test.timeLimit ? `${test.timeLimit} min` : "Unlimited"}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Limit</div>
                </div>
              </div>

              {previousAttempts.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Previous Attempts</h3>
                  <div className="space-y-2">
                    {previousAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {attempt.passed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          <div>
                            <div className="font-medium">Score: {attempt.score}%</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={attempt.passed ? "default" : "destructive"}>
                          {attempt.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium mb-1">Before you start:</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• You can review your answers before submitting</li>
                    <li>• Select all correct answers for each question</li>
                    {test.timeLimit && <li>• The timer will start immediately</li>}
                    <li>• You need {test.passingScore}% to pass and unlock the next section</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStarted(true)} size="lg" className="flex-1">
                  Start Test
                </Button>
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with timer */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{test.title}</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className={`font-mono text-lg ${timeRemaining < 300 ? "text-destructive" : ""}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl">
                {currentQuestion.question}
              </CardTitle>
              <Badge variant="secondary">{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {currentQuestion.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="flex items-start gap-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => toggleAnswer(currentQuestion.id, answer.id)}
                >
                  <Checkbox
                    id={answer.id}
                    checked={selectedAnswers[currentQuestion.id]?.includes(answer.id) || false}
                    onCheckedChange={() => toggleAnswer(currentQuestion.id, answer.id)}
                  />
                  <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                    {answer.answer}
                  </Label>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                {answeredQuestions} / {test.questions.length} answered
              </div>

              {currentQuestionIndex < test.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || answeredQuestions < test.questions.length}
                >
                  {submitting ? "Submitting..." : "Submit Test"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question navigator */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {test.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`aspect-square rounded-lg border-2 font-medium text-sm transition-colors ${
                    index === currentQuestionIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : selectedAnswers[q.id]?.length > 0
                      ? "border-green-500 bg-green-500/10"
                      : "border-muted-foreground/20 hover:border-primary/50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
