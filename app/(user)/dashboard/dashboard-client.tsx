"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Trophy,
  Flame,
  Play,
  CheckCircle,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type DashboardClientProps = {
  user: any
  enrollments: any[]
  sectionProgress: any[]
  testAttempts: any[]
}

export default function DashboardClient({
  user,
  enrollments,
  sectionProgress,
  testAttempts,
}: DashboardClientProps) {
  // Calculate stats
  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter((e) => e.completed).length
  const totalLearningMinutes = enrollments.reduce(
    (sum, e) => sum + e.totalLearningMinutes,
    0
  )
  const totalLearningHours = Math.floor(totalLearningMinutes / 60)
  const longestStreak = Math.max(...enrollments.map((e) => e.longestStreak), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name || "Learner"}!</h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in-up animate-delay-100">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {completedCourses} completed
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLearningHours}h</div>
              <p className="text-xs text-muted-foreground">
                {totalLearningMinutes % 60}m total
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{longestStreak}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {testAttempts.filter((t) => t.passed).length}
              </div>
              <p className="text-xs text-muted-foreground">
                of {testAttempts.length} attempts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6 animate-fade-in-up animate-delay-200">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {enrollments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {enrollments.map((enrollment) => {
                  const course = enrollment.course
                  const totalSections = course.sections.length
                  const completedSections = sectionProgress.filter(
                    (p) =>
                      p.completed &&
                      course.sections.some((s: any) => s.id === p.sectionId)
                  ).length
                  const progressPercentage = totalSections > 0
                    ? Math.round((completedSections / totalSections) * 100)
                    : 0

                  return (
                    <Card key={enrollment.id} className="card-hover overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                            <CardDescription className="mt-2">
                              {completedSections} of {totalSections} sections completed
                            </CardDescription>
                          </div>
                          {enrollment.isStakeToLearn && (
                            <Badge variant="secondary" className="flex-shrink-0">
                              Stake to Learn
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progressPercentage}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>

                        {enrollment.isStakeToLearn && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-bold">{enrollment.completionPercentage}%</div>
                              <div className="text-muted-foreground">Completion</div>
                            </div>
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-bold">{Math.round(enrollment.testAverage)}%</div>
                              <div className="text-muted-foreground">Test Avg</div>
                            </div>
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-bold">{enrollment.currentStreak}</div>
                              <div className="text-muted-foreground">Streak</div>
                            </div>
                          </div>
                        )}

                        <Button asChild className="w-full">
                          <Link href={`/courses/${course.slug}/learn`}>
                            <Play className="mr-2 h-4 w-4" />
                            Continue Learning
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning sessions and test attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testAttempts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No activity yet. Start learning to see your progress here!
                  </p>
                )}
                {testAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      attempt.passed ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      {attempt.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{attempt.test.section.course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {attempt.test.title} - Score: {attempt.score}%
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={attempt.passed ? "default" : "destructive"}>
                        {attempt.passed ? "Passed" : "Failed"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(attempt.completedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="card-hover">
                <CardHeader>
                  <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
                  <CardTitle>First Course</CardTitle>
                  <CardDescription>Enrolled in your first course</CardDescription>
                </CardHeader>
                <CardContent>
                  {totalCourses > 0 ? (
                    <Badge className="bg-green-500">Unlocked!</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <Flame className="h-12 w-12 text-orange-500 mb-2" />
                  <CardTitle>Week Streak</CardTitle>
                  <CardDescription>Learn for 7 days in a row</CardDescription>
                </CardHeader>
                <CardContent>
                  {longestStreak >= 7 ? (
                    <Badge className="bg-green-500">Unlocked!</Badge>
                  ) : (
                    <Badge variant="outline">{longestStreak}/7 days</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-blue-500 mb-2" />
                  <CardTitle>Perfect Score</CardTitle>
                  <CardDescription>Score 100% on any test</CardDescription>
                </CardHeader>
                <CardContent>
                  {testAttempts.some((t) => t.score === 100) ? (
                    <Badge className="bg-green-500">Unlocked!</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
