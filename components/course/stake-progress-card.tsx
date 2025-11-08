"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, Trophy, Flame } from "lucide-react"

type StakeProgressCardProps = {
  progress: {
    completionPercentage: number
    testAverage: number
    totalLearningMinutes: number
    currentStreak: number
    longestStreak: number
  }
  requirements: {
    requiredCompletion: number
    requiredTestAverage: number
    requiredDailyMinutes: number
    courseDurationDays: number | null
  }
  requirementsMet: {
    completion: boolean
    testAverage: boolean
    learningTime: boolean
  }
  stakeAmount: number | null
  courseEndDate: Date | null
  refundEligible: boolean
}

export function StakeProgressCard({
  progress,
  requirements,
  requirementsMet,
  stakeAmount,
  courseEndDate,
  refundEligible,
}: StakeProgressCardProps) {
  const requiredTotalMinutes = requirements.courseDurationDays
    ? requirements.courseDurationDays * requirements.requiredDailyMinutes
    : 0

  const daysRemaining = courseEndDate
    ? Math.max(0, Math.ceil((new Date(courseEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Stake Progress</CardTitle>
            <CardDescription>
              Complete any one requirement to get your {stakeAmount} ETH back
            </CardDescription>
          </div>
          {refundEligible && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Eligible for Refund!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Remaining */}
        {courseEndDate && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Time Remaining</span>
            </div>
            <Badge variant="outline">{daysRemaining} days</Badge>
          </div>
        )}

        {/* Requirement 1: Course Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {requirementsMet.completion ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">Course Completion</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {progress.completionPercentage}% / {requirements.requiredCompletion}%
            </span>
          </div>
          <Progress value={progress.completionPercentage} className="h-2" />
        </div>

        {/* Requirement 2: Test Average */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {requirementsMet.testAverage ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">Test Average</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress.testAverage)}% / {requirements.requiredTestAverage}%
            </span>
          </div>
          <Progress value={progress.testAverage} className="h-2" />
        </div>

        {/* Requirement 3: Learning Time */}
        {requiredTotalMinutes > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {requirementsMet.learningTime ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">Learning Time</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {progress.totalLearningMinutes} / {requiredTotalMinutes} min
              </span>
            </div>
            <Progress
              value={(progress.totalLearningMinutes / requiredTotalMinutes) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Streak</p>
              <p className="text-lg font-bold">{progress.currentStreak} days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best Streak</p>
              <p className="text-lg font-bold">{progress.longestStreak} days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
