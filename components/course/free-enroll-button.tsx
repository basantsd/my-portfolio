"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface FreeEnrollButtonProps {
  courseId: string
  courseName: string
  enrolled?: boolean
}

export function FreeEnrollButton({ courseId, courseName, enrolled = false }: FreeEnrollButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleEnroll = async () => {
    if (!session) {
      setShowDialog(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to enroll in course")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/my-courses")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (enrolled) {
    return (
      <Button size="lg" variant="outline" className="w-full" asChild>
        <Link href="/my-courses">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Go to Course
        </Link>
      </Button>
    )
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={handleEnroll}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enrolling...
          </>
        ) : (
          "Enroll for Free"
        )}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-4 border-green-600 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Successfully enrolled! Redirecting to your courses...
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to enroll in this course. Please log in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href={`/login?callbackUrl=/courses/${courseId}`}>
                Log In
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
