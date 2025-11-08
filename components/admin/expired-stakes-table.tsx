"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Loader2, DollarSign } from "lucide-react"
import { STAKE_TO_LEARN_ABI, STAKE_CONTRACT_ADDRESSES } from "@/lib/stake-to-learn-config"
import { useRouter } from "next/navigation"

type ExpiredStake = {
  enrollmentId: string
  blockchainEnrollmentId: string
  user: {
    name: string | null
    email: string
  }
  course: {
    title: string
  }
  stakedAmountEth: number
  courseEndDate: Date
  refundEligible: boolean
  adminClaimed: boolean
  refundClaimed: boolean
}

type ExpiredStakesTableProps = {
  stakes: ExpiredStake[]
}

export function ExpiredStakesTable({ stakes }: ExpiredStakesTableProps) {
  const router = useRouter()
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  const { chain } = useAccount()
  const { writeContract, data: hash, isPending: isTransactionPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const contractAddress = chain
    ? STAKE_CONTRACT_ADDRESSES[chain.id as keyof typeof STAKE_CONTRACT_ADDRESSES]
    : undefined

  const handleClaimStake = async (stake: ExpiredStake) => {
    if (!contractAddress) {
      alert("Smart contract not deployed on this network")
      return
    }

    setClaimingId(stake.enrollmentId)

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: STAKE_TO_LEARN_ABI,
        functionName: "adminClaimExpiredStake",
        args: [stake.blockchainEnrollmentId as `0x${string}`],
      })
    } catch (error) {
      console.error("Claim stake error:", error)
      setClaimingId(null)
    }
  }

  const verifyAndUpdate = async () => {
    if (!hash || !claimingId) return

    setVerifying(true)

    try {
      const response = await fetch("/api/courses/stake/admin-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: claimingId,
          transactionHash: hash,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify claim")
      }

      router.refresh()
    } catch (error) {
      console.error("Verification error:", error)
      alert("Claim successful but verification failed. Please refresh the page.")
    } finally {
      setVerifying(false)
      setClaimingId(null)
    }
  }

  // Auto-verify when transaction is confirmed
  if (isConfirmed && !verifying && hash && claimingId) {
    verifyAndUpdate()
  }

  const canClaimStakes = stakes.filter(
    (s) => !s.refundClaimed && !s.adminClaimed && !s.refundEligible
  )

  const gracePeriodEnd = (date: Date) => {
    const end = new Date(date)
    end.setDate(end.getDate() + 5) // 5 day grace period
    return end
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Expired Stakes</h3>
        <p className="text-sm text-muted-foreground">
          Stakes from students who didn't meet the requirements
        </p>
      </div>

      <Table>
        <TableCaption>
          {canClaimStakes.length === 0
            ? "No claimable stakes available"
            : `${canClaimStakes.length} stake(s) available to claim`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Course Ended</TableHead>
            <TableHead>Grace Period Ends</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stakes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No expired stakes found
              </TableCell>
            </TableRow>
          ) : (
            stakes.map((stake) => {
              const canClaim =
                !stake.refundClaimed &&
                !stake.adminClaimed &&
                !stake.refundEligible &&
                new Date() >= gracePeriodEnd(stake.courseEndDate)

              return (
                <TableRow key={stake.enrollmentId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{stake.user.name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{stake.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{stake.course.title}</TableCell>
                  <TableCell className="font-mono">{stake.stakedAmountEth} ETH</TableCell>
                  <TableCell>{new Date(stake.courseEndDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {gracePeriodEnd(stake.courseEndDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {stake.adminClaimed ? (
                      <Badge variant="secondary">Claimed</Badge>
                    ) : stake.refundClaimed ? (
                      <Badge variant="outline">Student Refunded</Badge>
                    ) : stake.refundEligible ? (
                      <Badge variant="default" className="bg-green-500">
                        Student Eligible
                      </Badge>
                    ) : canClaim ? (
                      <Badge variant="destructive">Claimable</Badge>
                    ) : (
                      <Badge variant="outline">Grace Period</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {canClaim && (
                      <Button
                        size="sm"
                        onClick={() => handleClaimStake(stake)}
                        disabled={
                          claimingId === stake.enrollmentId ||
                          isTransactionPending ||
                          isConfirming ||
                          !contractAddress
                        }
                      >
                        {claimingId === stake.enrollmentId &&
                        (isTransactionPending || isConfirming || verifying) ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            {verifying ? "Verifying..." : "Claiming..."}
                          </>
                        ) : (
                          <>
                            <DollarSign className="mr-2 h-3 w-3" />
                            Claim Stake
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
