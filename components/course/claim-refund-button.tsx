"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { STAKE_TO_LEARN_ABI, STAKE_CONTRACT_ADDRESSES } from "@/lib/stake-to-learn-config"
import { useRouter } from "next/navigation"

type ClaimRefundButtonProps = {
  courseId: string
  enrollmentId: string
  stakeAmount: number
  eligible: boolean
  reason: string
  alreadyClaimed: boolean
  adminClaimed: boolean
}

export function ClaimRefundButton({
  courseId,
  enrollmentId,
  stakeAmount,
  eligible,
  reason,
  alreadyClaimed,
  adminClaimed,
}: ClaimRefundButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { address, isConnected, chain } = useAccount()
  const { writeContract, data: hash, isPending: isTransactionPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const contractAddress = chain
    ? STAKE_CONTRACT_ADDRESSES[chain.id as keyof typeof STAKE_CONTRACT_ADDRESSES]
    : undefined

  const handleClaimRefund = async () => {
    if (!isConnected || !address || !contractAddress) {
      setError("Please connect your wallet")
      return
    }

    setError(null)

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: STAKE_TO_LEARN_ABI,
        functionName: "claimRefund",
        args: [enrollmentId as `0x${string}`],
      })
    } catch (err) {
      console.error("Claim refund error:", err)
      setError("Failed to submit transaction")
    }
  }

  const verifyAndUpdate = async () => {
    if (!hash) return

    setVerifying(true)

    try {
      const response = await fetch("/api/courses/stake/claim-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          transactionHash: hash,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify refund claim")
      }

      // Close modal and refresh page
      setIsOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Verification error:", err)
      setError("Refund successful but verification failed. Please contact support.")
    } finally {
      setVerifying(false)
    }
  }

  // Auto-verify when transaction is confirmed
  if (isConfirmed && !verifying && hash) {
    verifyAndUpdate()
  }

  if (alreadyClaimed) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>You have already claimed your refund!</AlertDescription>
      </Alert>
    )
  }

  if (adminClaimed) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The grace period has expired and your stake has been claimed.
        </AlertDescription>
      </Alert>
    )
  }

  if (!eligible) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Not eligible for refund yet. {reason}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Claim {stakeAmount} ETH Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Your Refund</DialogTitle>
          <DialogDescription>
            Congratulations! You met the requirements. Claim your {stakeAmount} ETH stake back.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Message */}
          <Alert className="bg-green-500/10 border-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600">
              {reason}
            </AlertDescription>
          </Alert>

          {/* Refund Amount */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">Refund Amount</span>
            <span className="text-2xl font-bold">{stakeAmount} ETH</span>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Transaction Status */}
          {!hash && (
            <Button
              onClick={handleClaimRefund}
              disabled={isTransactionPending || !contractAddress || !isConnected}
              className="w-full"
              size="lg"
            >
              {isTransactionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isTransactionPending ? "Confirming..." : "Claim Refund"}
            </Button>
          )}

          {hash && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  {isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : isConfirmed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {isConfirming && "Confirming transaction..."}
                    {isConfirmed && !verifying && "Transaction confirmed!"}
                    {verifying && "Verifying refund..."}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {hash.slice(0, 10)}...{hash.slice(-8)}
                  </p>
                </div>
              </div>

              {isConfirmed && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Refund successful! Updating your enrollment...</p>
                </div>
              )}
            </div>
          )}

          {!contractAddress && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Smart contract not deployed on this network. Please switch to Sepolia testnet.
              </AlertDescription>
            </Alert>
          )}

          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to claim your refund.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
