"use client"

import { useState } from "react"
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, Check, X } from "lucide-react"
import { CONTRACT_ADDRESSES, COURSE_PAYMENT_ABI } from "@/lib/wagmi-config"
import { useRouter } from "next/navigation"

type PurchaseWithCryptoButtonProps = {
  courseId: string
  courseName: string
  priceInEth: number
  disabled?: boolean
}

export function PurchaseWithCryptoButton({
  courseId,
  courseName,
  priceInEth,
  disabled
}: PurchaseWithCryptoButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { writeContract, data: hash, isPending: isTransactionPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const contractAddress = chain ? CONTRACT_ADDRESSES[chain.id as keyof typeof CONTRACT_ADDRESSES] : undefined

  const handlePurchase = async () => {
    if (!isConnected || !address || !contractAddress) {
      return
    }

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: COURSE_PAYMENT_ABI,
        functionName: 'purchaseCourse',
        args: [courseId],
        value: parseEther(priceInEth.toString()),
      })
    } catch (error) {
      console.error('Purchase error:', error)
    }
  }

  const verifyAndEnroll = async () => {
    if (!hash || !address) return

    setVerifying(true)

    try {
      const response = await fetch('/api/courses/purchase/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          courseName,
          transactionHash: hash,
          walletAddress: address,
          network: chain?.name || 'unknown',
          amount: parseEther(priceInEth.toString()).toString(),
          amountInEth: priceInEth,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      const data = await response.json()

      // Close modal and redirect to course learning page
      setIsOpen(false)
      router.push(`/courses/${data.course.slug}/learn`)
      router.refresh()
    } catch (error) {
      console.error('Verification error:', error)
      alert('Payment successful but verification failed. Please contact support.')
    } finally {
      setVerifying(false)
    }
  }

  // Auto-verify when transaction is confirmed
  if (isConfirmed && !verifying && hash) {
    verifyAndEnroll()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" disabled={disabled} className="w-full md:w-auto">
          <Wallet className="mr-2 h-5 w-5" />
          Buy with ETH - {priceInEth} ETH
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase with Cryptocurrency</DialogTitle>
          <DialogDescription>
            Complete your purchase using ETH
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Course</span>
              <span className="text-sm">{courseName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Price</span>
              <span className="text-lg font-bold">{priceInEth} ETH</span>
            </div>
            {chain && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network</span>
                <Badge variant="secondary">{chain.name}</Badge>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          {!isConnected ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to continue
              </p>
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  variant="outline"
                  className="w-full"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect {connector.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Connected Wallet</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {address}
                  </p>
                </div>
                <Check className="h-4 w-4 text-green-500" />
              </div>

              {/* Transaction Status */}
              {!hash && (
                <Button
                  onClick={handlePurchase}
                  disabled={isTransactionPending || !contractAddress}
                  className="w-full"
                  size="lg"
                >
                  {isTransactionPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isTransactionPending ? 'Confirming...' : `Pay ${priceInEth} ETH`}
                </Button>
              )}

              {hash && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      {isConfirming ? (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      ) : isConfirmed ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {isConfirming && 'Confirming transaction...'}
                        {isConfirmed && !verifying && 'Transaction confirmed!'}
                        {verifying && 'Verifying payment...'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {hash.slice(0, 10)}...{hash.slice(-8)}
                      </p>
                    </div>
                  </div>

                  {isConfirmed && (
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Payment successful! Enrolling you in the course...</p>
                    </div>
                  )}
                </div>
              )}

              {!contractAddress && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-600">
                    Smart contract not deployed on this network. Please switch to Sepolia testnet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
