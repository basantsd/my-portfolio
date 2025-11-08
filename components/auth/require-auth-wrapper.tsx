"use client"

import { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

type RequireAuthWrapperProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function RequireAuthWrapper({ children, fallback }: RequireAuthWrapperProps) {
  const { data: session, status } = useSession()

  // Show loading state
  if (status === "loading") {
    return (
      <Button disabled size="lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  // Show login prompt if not authenticated
  if (!session) {
    return fallback || (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">Enroll Now</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to login or create an account before enrolling in this course.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please login with your social media account or create a new account to continue.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/login">Login with Social Media</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Check if email is verified
  if (!session.user.emailVerified) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">Enroll Now</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Verification Required</DialogTitle>
            <DialogDescription>
              Please verify your email address before enrolling in courses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your email address has not been verified yet. Please check your inbox for the verification link.
              </AlertDescription>
            </Alert>

            <Button
              size="lg"
              className="w-full"
              onClick={async () => {
                try {
                  const res = await fetch("/api/auth/resend-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: session.user.email }),
                  })

                  if (res.ok) {
                    alert("Verification email sent! Please check your inbox.")
                  } else {
                    const data = await res.json()
                    alert(data.error || "Failed to send verification email")
                  }
                } catch (error) {
                  alert("Failed to send verification email")
                }
              }}
            >
              Resend Verification Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // User is authenticated and verified, show the actual component
  return <>{children}</>
}
