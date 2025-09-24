"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Leaf, Zap, Shield, Clock } from "lucide-react"

interface SubscriptionModalProps {
  children: React.ReactNode
  currentUsage?: number
  dailyLimit?: number
}

export function SubscriptionModal({ children, currentUsage = 0, dailyLimit = 5 }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "premium_monthly",
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("[v0] Subscription error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Leaf, text: "100 plant scans", highlight: true },
    { icon: Clock, text: "Valid for 28 days", highlight: false },
    { icon: Zap, text: "Priority processing", highlight: false },
    { icon: Shield, text: "Advanced AI models", highlight: false },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Upgrade to Premium</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Usage Alert */}
          {currentUsage >= dailyLimit && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <Leaf className="w-4 h-4" />
                <span className="font-medium">Daily limit reached!</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                You've used all {dailyLimit} free scans today. Upgrade to continue scanning.
              </p>
            </div>
          )}

          {/* Pricing Card */}
          <Card className="border-2 border-primary">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardTitle className="text-2xl">Premium Plan</CardTitle>
              <div className="text-3xl font-bold text-primary">
                ₹200
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.highlight ? "bg-primary text-primary-foreground" : "bg-green-100"
                      }`}
                    >
                      {feature.highlight ? (
                        <feature.icon className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                    <span className={feature.highlight ? "font-medium" : "text-muted-foreground"}>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full h-12 text-lg" onClick={handleSubscribe} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Secure payment powered by Stripe</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Cancel anytime • No hidden fees • Instant activation</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
