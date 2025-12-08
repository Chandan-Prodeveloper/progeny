"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Upload, LogOut, Leaf, AlertCircle, CheckCircle, Clock, Crown, Apple, Wheat, Bean } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SubscriptionModal } from "@/components/subscription-modal"

interface ScanResult {
  id: string
  disease_name: string
  confidence_score: number
  remedies: string[]
  created_at: string
  crop_type: string
}

interface UserProfile {
  full_name: string
  is_admin: boolean
}

interface UsageData {
  daily_scans_used: number
  daily_limit: number
  can_scan: boolean
  total_scans_available: number | string
}

interface Subscription {
  scans_remaining: number
  expires_at: string
  status: string
  plan_type: string
}

const CROP_TYPES = [
  { value: 'apple', label: 'Apple', icon: Apple, color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 'corn', label: 'Corn', icon: Wheat, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'potato', label: 'Potato', icon: Bean, color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'tomato', label: 'Tomato', icon: Leaf, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
]

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      console.log("[v0] Loading user data...")
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        console.log("[v0] Auth error or no user:", authError)
        router.push("/signin")
        return
      }

      console.log("[v0] User found:", user.id)

      const response = await fetch("/api/usage")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Usage data loaded:", data)
        
        setUserProfile({
          full_name: data.user.full_name,
          is_admin: data.user.is_admin
        })
        setUsage(data.usage)
        setSubscription(data.subscription)
      } else {
        console.error("[v0] Error loading usage data:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      
      setSelectedFile(file)
      setScanResult(null)
      setError(null)
      
      // Create image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    if (!selectedCrop) {
      setError("Please select a crop type first")
      return
    }
    fileInputRef.current?.click()
  }

  const handleCropSelect = (cropType: string) => {
    setSelectedCrop(cropType)
    setSelectedFile(null)
    setImagePreview(null)
    setScanResult(null)
    setError(null)
  }

  const handleReset = () => {
    setSelectedCrop(null)
    setSelectedFile(null)
    setImagePreview(null)
    setScanResult(null)
    setError(null)
  }

  const handleScanImage = async () => {
    if (!selectedFile || !selectedCrop) return

    console.log("[v0] Starting scan with current usage:", usage)
    setIsScanning(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("crop_type", selectedCrop)

      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("[v0] Scan response:", response.status, result)

      if (!response.ok) {
        if (response.status === 403 && result.error?.includes("Daily scan limit reached")) {
          setError("You've reached your daily limit of 5 free scans. Upgrade to Premium for unlimited scans!")
          setShowSubscriptionModal(true)
        } else {
          throw new Error(result.error || "Scan failed")
        }
        return
      }

      setScanResult(result.scan)
      console.log("[v0] Scan successful, refreshing usage data")
      await loadUserData()
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

  const hasActiveSubscription = subscription && subscription.scans_remaining > 0
  const canScan = usage?.can_scan || false
  const usageCount = usage?.daily_scans_used || 0
  const dailyLimit = usage?.daily_limit || 5
  const usagePercentage = (usageCount / dailyLimit) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">Progeny AI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {hasActiveSubscription ? "Premium Scans:" : "Daily Usage:"}
              </span>
              <Badge variant={hasActiveSubscription ? "default" : "outline"} className="font-medium">
                {userProfile?.is_admin 
                  ? "Unlimited" 
                  : hasActiveSubscription 
                    ? `${subscription.scans_remaining} scans remaining`
                    : `${usageCount}/${dailyLimit} scans`}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userProfile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {userProfile?.full_name || "User"}
                {userProfile?.is_admin && <Badge className="ml-2 text-xs">Admin</Badge>}
                {hasActiveSubscription && !userProfile?.is_admin && (
                  <Badge className="ml-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </span>
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
              <h1 className="text-3xl font-bold">Welcome back, {userProfile?.full_name?.split(" ")[0] || "User"}!</h1>
              <p className="text-muted-foreground">
                {userProfile?.is_admin
                  ? "You have unlimited scans as an admin user."
                  : hasActiveSubscription
                    ? `You have ${subscription.scans_remaining} premium scans remaining.`
                    : `Ready to scan your plants for diseases? You have ${Math.max(0, dailyLimit - usageCount)} free scans remaining today.`}
              </p>
            </div>

            {/* Premium Status */}
            {hasActiveSubscription && !userProfile?.is_admin && (
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Crown className="w-5 h-5" />
                    Premium Plan Active
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-purple-100 rounded-lg border border-purple-200">
                      <div className="font-semibold text-purple-700">{subscription.scans_remaining}</div>
                      <div className="text-purple-600">Scans Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-pink-100 rounded-lg border border-pink-200">
                      <div className="font-semibold text-pink-700">
                        {Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-pink-600">Days Left</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daily Usage Tracker */}
            {!userProfile?.is_admin && !hasActiveSubscription && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    Daily Usage Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Scans used today</span>
                    <span className="font-medium">{usageCount} of {dailyLimit}</span>
                  </div>
                  <Progress value={usagePercentage} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-semibold text-green-700">{Math.max(0, dailyLimit - usageCount)}</div>
                      <div className="text-green-600">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-700">{usageCount}</div>
                      <div className="text-blue-600">Used Today</div>
                    </div>
                  </div>
                  {usageCount >= dailyLimit && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-800">
                          Daily limit reached! Upgrade to Premium for unlimited scans.
                        </span>
                      </div>
                      <SubscriptionModal currentUsage={usageCount} dailyLimit={dailyLimit}>
                        <Button className="w-full bg-primary hover:bg-primary/90">Upgrade Now</Button>
                      </SubscriptionModal>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 1: Crop Selection */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Step 1: Select Crop Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CROP_TYPES.map((crop) => {
                    const Icon = crop.icon
                    return (
                      <button
                        key={crop.value}
                        onClick={() => handleCropSelect(crop.value)}
                        disabled={isScanning}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCrop === crop.value
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${crop.color} disabled:opacity-50`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Icon className="w-8 h-8" />
                          <span className="font-medium">{crop.label}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {selectedCrop && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      Selected: <span className="font-semibold capitalize">{selectedCrop}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Upload Image */}
            {selectedCrop && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Step 2: Upload {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Leaf Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto rounded-lg border-2 border-gray-200"
                      />
                      {!isScanning && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null)
                            setImagePreview(null)
                          }}
                          className="absolute top-2 right-2 bg-white"
                        >
                          Change Image
                        </Button>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isScanning}
                  />

                  {!selectedFile ? (
                    <Button 
                      className="w-full h-12 text-lg" 
                      onClick={handleUploadClick} 
                      disabled={isScanning || !canScan}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose Image File
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        className="w-full h-12 text-lg" 
                        onClick={handleScanImage} 
                        disabled={isScanning || !canScan}
                      >
                        {isScanning ? (
                          <>
                            <Clock className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Analyze Plant Disease
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={handleReset}
                        disabled={isScanning}
                      >
                        Start Over
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Scan Results */}
            {scanResult && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Scan Results - {scanResult.crop_type.charAt(0).toUpperCase() + scanResult.crop_type.slice(1)}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {userProfile?.is_admin ? (
                    <>
                      <Badge className="bg-red-100 text-red-800 mb-2">Admin</Badge>
                      <p className="text-sm text-muted-foreground">Unlimited scans available</p>
                    </>
                  ) : hasActiveSubscription ? (
                    <>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-2">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium Active
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {subscription!.scans_remaining} premium scans remaining
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Expires: {new Date(subscription!.expires_at).toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-blue-100 text-blue-800 mb-2">Free Plan</Badge>
                      <p className="text-sm text-muted-foreground">
                        {usageCount >= dailyLimit
                          ? "Daily limit reached! Upgrade for unlimited scans."
                          : `${Math.max(0, dailyLimit - usageCount)} scans remaining today`}
                      </p>
                    </>
                  )}
                </div>
                
                {!userProfile?.is_admin && (!hasActiveSubscription || subscription!.scans_remaining <= 5) && (
                  <>
                    <SubscriptionModal currentUsage={usageCount} dailyLimit={dailyLimit}>
                      <Button className="w-full bg-accent hover:bg-accent/90">
                        {hasActiveSubscription ? "Renew Premium" : usageCount >= dailyLimit ? "Upgrade Now" : "Upgrade to Premium"}
                        <span className="ml-2 text-sm">₹200/month</span>
                      </Button>
                    </SubscriptionModal>
                    <div className="text-xs text-muted-foreground text-center">Get 100 scans for 28 days</div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
          </div>
        </div>
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal currentUsage={usageCount} dailyLimit={dailyLimit}>
          <div style={{ display: "none" }} />
        </SubscriptionModal>
      )}
    </div>
  )
}