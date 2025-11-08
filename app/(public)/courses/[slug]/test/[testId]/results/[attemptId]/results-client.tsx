"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, AlertCircle, Award, RefreshCcw, ArrowRight } from "lucide-react"

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
  passingScore: number
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

type Attempt = {
  id: string
  score: number
  passed: boolean
  answers: any
  completedAt: Date
}

type Props = {
  attempt: Attempt
  test: Test
  course: { id: string; slug: string; title: string }
}

export function TestResultsClient({ attempt, test, course }: Props) {
  const detailedAnswers = attempt.answers as Record<string, any>
  const correctCount = Object.values(detailedAnswers).filter((a: any) => a.isCorrect).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Results Summary */}
        <Card className={attempt.passed ? "border-green-500" : "border-destructive"}>
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              {attempt.passed ? (
                <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">
              {attempt.passed ? "Congratulations! You Passed!" : "Test Not Passed"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {attempt.passed
                ? "You've successfully completed this test and unlocked the next section."
                : "Don't worry, you can retake the test to improve your score."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="text-center p-4 border rounded-lg">
                <div className={`text-4xl font-bold ${attempt.passed ? "text-green-500" : "text-destructive"}`}>
                  {attempt.score}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Your Score</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-4xl font-bold">{test.passingScore}%</div>
                <div className="text-sm text-muted-foreground mt-1">Passing Score</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-4xl font-bold">{correctCount}/{test.questions.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Correct Answers</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href={`/courses/${course.slug}/learn`}>
                  {attempt.passed ? (
                    <>
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Back to Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Link>
              </Button>
              {!attempt.passed && (
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/courses/${course.slug}/test/${test.id}`}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retake Test
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Answer Review</h2>
            <Badge variant="secondary">
              {correctCount} of {test.questions.length} correct
            </Badge>
          </div>

          {test.questions.map((question, index) => {
            const userAnswerData = detailedAnswers[question.id]
            const isCorrect = userAnswerData?.isCorrect || false
            const userAnswerIds = userAnswerData?.userAnswers || []
            const correctAnswerIds = userAnswerData?.correctAnswers || []

            return (
              <Card key={question.id} className={isCorrect ? "border-green-500/50" : "border-destructive/50"}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          Question {index + 1}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                    </div>
                    <Badge variant={isCorrect ? "default" : "destructive"}>
                      {userAnswerData?.earnedPoints || 0} / {question.points} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {question.answers.map((answer) => {
                      const isUserAnswer = userAnswerIds.includes(answer.id)
                      const isCorrectAnswer = correctAnswerIds.includes(answer.id)

                      return (
                        <div
                          key={answer.id}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? "border-green-500 bg-green-500/5"
                              : isUserAnswer
                              ? "border-destructive bg-destructive/5"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrectAnswer ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : isUserAnswer ? (
                              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            ) : (
                              <div className="h-5 w-5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span>{answer.answer}</span>
                                {isCorrectAnswer && (
                                  <Badge variant="secondary" className="text-xs">
                                    Correct
                                  </Badge>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <Badge variant="destructive" className="text-xs">
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {question.explanation && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Explanation</div>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Certificate or Retry CTA */}
        <Card className="mt-8">
          <CardContent className="py-8">
            {attempt.passed ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Section Completed!</h3>
                  <p className="text-muted-foreground">
                    You've unlocked the next section. Keep up the great work!
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link href={`/courses/${course.slug}/learn`}>
                    Continue to Next Section
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Need More Practice?</h3>
                  <p className="text-muted-foreground">
                    Review the course material and try the test again when you're ready.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href={`/courses/${course.slug}/learn`}>
                      Review Material
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/courses/${course.slug}/test/${test.id}`}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Retake Test
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
