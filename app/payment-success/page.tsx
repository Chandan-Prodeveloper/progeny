"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Leaf, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  
  // Use ref to prevent multiple API calls
  const hasVerified = useRef(false)
  const verificationInProgress = useRef(false)

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple calls
      if (!sessionId || hasVerified.current || verificationInProgress.current) {
        if (!sessionId) {
          setError("No session ID found")
          setIsProcessing(false)
        }
        return
      }

      verificationInProgress.current = true
      setIsProcessing(true)
      setError(null)

      try {
        console.log("[DEBUG] Starting payment verification for session:", sessionId)
        
        // Call the payment verification API
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stripe_session_id: sessionId,
            // Remove hardcoded user_id - let the API use the authenticated user
            plan_type: "premium_monthly",
            scans: "100",
            duration_days: "28"
          }),
        })

        const result = await response.json()
        console.log("[DEBUG] Verification result:", result)

        if (response.ok && result.success) {
          setSubscriptionData(result.subscription)
          hasVerified.current = true
          console.log("[DEBUG] Payment verification successful")
        } else {
          console.error("[ERROR] Verification failed:", result)
          setError(result.error || "Payment verification failed")
        }
      } catch (err) {
        console.error("Payment verification error:", err)
        setError("Network error occurred while verifying payment")
      } finally {
        setIsProcessing(false)
        verificationInProgress.current = false
      }
    }

    // Add a small delay to prevent immediate double calls
    const timeoutId = setTimeout(verifyPayment, 100)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [sessionId])

  // Manual retry function
  const retryVerification = () => {
    hasVerified.current = false
    verificationInProgress.current = false
    setError(null)
    setIsProcessing(true)
    
    // Trigger verification again
    setTimeout(() => {
      const verifyPayment = async () => {
        if (verificationInProgress.current) return
        
        verificationInProgress.current = true
        
        try {
          const response = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stripe_session_id: sessionId,
              plan_type: "premium_monthly",
              scans: "100",
              duration_days: "28"
            }),
          })

          const result = await response.json()

          if (response.ok && result.success) {
            setSubscriptionData(result.subscription)
            hasVerified.current = true
          } else {
            setError(result.error || "Payment verification failed")
          }
        } catch (err) {
          console.error("Retry verification error:", err)
          setError("Network error occurred while verifying payment")
        } finally {
          setIsProcessing(false)
          verificationInProgress.current = false
        }
      }
      
      verifyPayment()
    }, 100)
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we activate your subscription.</p>
            {sessionId && (
              <p className="text-xs text-muted-foreground mt-2">Session: ...{sessionId.slice(-8)}</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Verification Failed</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={retryVerification}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Retrying..." : "Retry Verification"}
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
            {sessionId && (
              <p className="text-xs text-muted-foreground mt-4">Session ID: ...{sessionId.slice(-8)}</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Progeny AI</span>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <p className="text-muted-foreground">Your premium subscription has been activated successfully.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Premium Plan Activated</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>Amount Paid: ₹200</p>
              <p>100 scans for 28 days</p>
              {subscriptionData && (
                <>
                  <p>Scans Remaining: {subscriptionData.scans_remaining}</p>
                  <p>Status: {subscriptionData.status}</p>
                </>
              )}
              <p>Session ID: ...{sessionId?.slice(-8)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/support">Need Help?</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            You will receive a confirmation email shortly with your subscription details.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}