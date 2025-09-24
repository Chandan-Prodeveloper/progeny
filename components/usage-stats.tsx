"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, TrendingUp, Calendar, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface UsageData {
  daily_scans_used: number
  daily_limit: number
  can_scan: boolean
}

interface Subscription {
  scans_remaining: number
  expires_at: string
  status: string
}

interface RecentScan {
  id: string
  disease_name: string
  confidence_score: number
  created_at: string
  status: string
}

interface UsageStatsProps {
  userId?: string
  isAdmin?: boolean
}

export function UsageStats({ userId, isAdmin }: UsageStatsProps) {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsageData()
  }, [userId])

  const loadUsageData = async () => {
    try {
      const response = await fetch("/api/usage")
      if (response.ok) {
        const data = await response.json()
        setUsage(data.usage)
        setSubscription(data.subscription)
        setRecentScans(data.recent_scans)
      }
    } catch (error) {
      console.error("[v0] Error loading usage data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!usage) return null

  const usagePercentage = (usage.daily_scans_used / usage.daily_limit) * 100

  return (
    <div className="space-y-6">
      {/* Usage Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Scans</p>
                <p className="text-2xl font-bold">
                  {isAdmin ? "Unlimited" : `${usage.daily_scans_used}/${usage.daily_limit}`}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">
                  {isAdmin ? "∞" : Math.max(0, usage.daily_limit - usage.daily_scans_used)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {subscription && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Premium Scans</p>
                  <p className="text-2xl font-bold">{subscription.scans_remaining}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{recentScans.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Usage Progress */}
      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Daily Usage Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Scans used today</span>
              <span className="font-medium">
                {usage.daily_scans_used} of {usage.daily_limit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-700">
                  {Math.max(0, usage.daily_limit - usage.daily_scans_used)}
                </div>
                <div className="text-green-600">Remaining</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-700">{usage.daily_scans_used}</div>
                <div className="text-blue-600">Used Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.slice(0, 5).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{scan.disease_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(scan.created_at).toLocaleDateString()} • Confidence:{" "}
                      {(scan.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Badge variant={scan.status === "completed" ? "default" : "secondary"}>{scan.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
