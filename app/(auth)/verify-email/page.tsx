"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
      setStatus("error")
      setMessage("Invalid verification link")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Verification failed")
        }

        setStatus("success")
        setMessage(data.message || "Email verified successfully!")

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } catch (err: any) {
        setStatus("error")
        setMessage(err.message || "Failed to verify email")
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {status === "success" && <CheckCircle2 className="h-8 w-8 text-green-600" />}
            {status === "error" && <XCircle className="h-8 w-8 text-destructive" />}
          </div>
          <CardTitle>
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your email has been verified successfully. You can now login to your account.
                Redirecting to login page...
              </AlertDescription>
            </Alert>
          )}
          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {message}. The verification link may have expired or is invalid.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {status === "success" && (
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
          {status === "error" && (
            <>
              <Button
                className="w-full"
                onClick={async () => {
                  const email = searchParams.get("email")
                  if (!email) return

                  try {
                    const res = await fetch("/api/auth/resend-verification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    })

                    if (res.ok) {
                      setMessage("Verification email resent! Please check your inbox.")
                    } else {
                      const data = await res.json()
                      setMessage(data.error || "Failed to resend email")
                    }
                  } catch (error) {
                    setMessage("Failed to resend verification email")
                  }
                }}
              >
                Resend Verification Email
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/signup">Create New Account</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
