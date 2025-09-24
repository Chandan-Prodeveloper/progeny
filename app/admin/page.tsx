"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Users, BarChart3, Settings, LogOut, Leaf, Crown, CheckCircle, Clock } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserProfile {
  full_name: string
  is_admin: boolean
}

interface ScanResult {
  id: string
  disease_name: string
  confidence_score: number
  remedies: string[]
  created_at: string
}

interface AdminStats {
  total_users: number
  total_scans: number
  active_subscriptions: number
}

export default function AdminDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adminStats, setAdminStats] = useState<AdminStats>({ total_users: 0, total_scans: 0, active_subscriptions: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push("/signin")
        return
      }

      // Load user profile and verify admin status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, is_admin")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.is_admin) {
        router.push("/dashboard")
        return
      }

      setUserProfile(profile)

      // Load admin statistics
      const { data: users } = await supabase.from("profiles").select("id", { count: "exact" })
      const { data: scans } = await supabase.from("scans").select("id", { count: "exact" })
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("id", { count: "exact" })
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString())

      setAdminStats({
        total_users: users?.length || 0,
        total_scans: scans?.length || 0,
        active_subscriptions: subscriptions?.length || 0,
      })
    } catch (error) {
      console.error("[v0] Error loading admin data:", error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setScanResult(null)
      setError(null)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleScanImage = async () => {
    if (!selectedFile) return

    setIsScanning(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Scan failed")
      }

      setScanResult(result.scan)
      setSelectedFile(null)

      // Refresh stats
      await loadAdminData()
    } catch (error: any) {
      console.error("[v0] Scan error:", error)
      setError(error.message || "An error occurred during scanning")
    } finally {
      setIsScanning(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Progeny AI</span>
            <Badge className="bg-yellow-100 text-yellow-800 ml-2">
              <Crown className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userProfile?.full_name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{userProfile?.full_name || "Admin"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Unlimited access to all plant disease detection features and admin tools.
              </p>
            </div>

            {/* Admin Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary">∞</div>
                  <p className="text-sm text-muted-foreground">Unlimited Scans</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent">{adminStats.total_users}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{adminStats.total_scans}</div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                </CardContent>
              </Card>
            </div>

            {/* Upload and Scan Section */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  {isScanning ? (
                    <Clock className="w-10 h-10 text-primary animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">
                    {isScanning ? "Analyzing Plant..." : "Admin Plant Scanner"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isScanning
                      ? "Our AI is analyzing your plant image for diseases..."
                      : "Upload plant images for disease detection (unlimited access)"}
                  </p>
                  {selectedFile && !isScanning && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">Selected: {selectedFile.name}</p>
                    </div>
                  )}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isScanning}
                />
                {!selectedFile ? (
                  <Button className="w-full h-12 text-lg" onClick={handleUploadClick} disabled={isScanning}>
                    Choose Image File
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full h-12 text-lg" onClick={handleScanImage} disabled={isScanning}>
                      {isScanning ? "Analyzing..." : "Analyze Plant Disease"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleUploadClick}
                      disabled={isScanning}
                    >
                      Choose Different Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scan Results */}
            {scanResult && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Admin Scan Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800">Disease Detected:</h4>
                      <p className="text-lg font-medium">{scanResult.disease_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Confidence Score:</h4>
                      <p className="text-lg font-medium">{(scanResult.confidence_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Recommended Remedies:</h4>
                    <ul className="space-y-1">
                      {scanResult.remedies.map((remedy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-green-700">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Admin Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">New user registration</p>
                        <p className="text-sm text-muted-foreground">farmer.john@email.com joined</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">2 min ago</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Disease detection completed</p>
                        <p className="text-sm text-muted-foreground">Tomato Early Blight - 94% confidence</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">5 min ago</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Crown className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Premium subscription</p>
                        <p className="text-sm text-muted-foreground">User upgraded to premium plan</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Status */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                    <Crown className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                  <p className="text-sm text-muted-foreground">Full system access with unlimited features</p>
                </div>
              </CardContent>
            </Card>

            {/* Admin Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Model</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subscriptions</span>
                  <Badge className="bg-blue-100 text-blue-800">{adminStats.active_subscriptions} Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
