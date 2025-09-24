import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Mock plant disease detection API
const mockPlantDiseases = [
  {
    name: "Leaf Spot",
    confidence: 0.92,
    remedies: [
      "Remove affected leaves immediately",
      "Apply copper-based fungicide spray",
      "Improve air circulation around plants",
      "Water at soil level to avoid wetting leaves",
    ],
  },
  {
    name: "Powdery Mildew",
    confidence: 0.88,
    remedies: [
      "Spray with baking soda solution (1 tsp per quart water)",
      "Apply neem oil in early morning or evening",
      "Increase spacing between plants for better airflow",
      "Remove infected plant parts",
    ],
  },
  {
    name: "Bacterial Blight",
    confidence: 0.85,
    remedies: [
      "Apply copper sulfate spray",
      "Remove and destroy infected plant material",
      "Avoid overhead watering",
      "Use disease-resistant varieties in future plantings",
    ],
  },
  {
    name: "Healthy Plant",
    confidence: 0.95,
    remedies: [
      "Continue current care routine",
      "Monitor regularly for any changes",
      "Maintain proper watering schedule",
      "Ensure adequate nutrition",
    ],
  },
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Scan request from user:", user.id)

    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin, email, full_name")
      .eq("id", user.id)
      .single()

    // If profile doesn't exist, create it
    if (profileError && profileError.code === "PGRST116") {
      console.log("[v0] Profile not found, creating new profile")
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          is_admin: false,
        })
        .select("is_admin, email, full_name")
        .single()

      if (createError) {
        console.error("[v0] Error creating profile:", createError)
        return NextResponse.json({ error: "Error creating user profile" }, { status: 500 })
      }
      profile = newProfile
    } else if (profileError) {
      console.error("[v0] Error fetching profile:", profileError)
      return NextResponse.json({ error: "Error fetching user profile" }, { status: 500 })
    }

    if (!profile) {
      console.error("[v0] Profile is null after creation/fetch")
      return NextResponse.json({ error: "Error loading user profile" }, { status: 500 })
    }

    console.log("[v0] User profile:", profile)

    // Check if user can scan (considering admin status, subscription, and daily limits)
    const canScan = await checkUserCanScan(supabase, user.id, profile.is_admin)
    
    if (!canScan.allowed) {
      console.log("[v0] User cannot scan:", canScan.reason)
      return NextResponse.json(
        { error: canScan.reason },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Simulate AI processing
    const randomDisease = mockPlantDiseases[Math.floor(Math.random() * mockPlantDiseases.length)]
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create scan record
    const { data: scan, error: insertError } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        image_url: `placeholder_${Date.now()}.jpg`,
        disease_name: randomDisease.name,
        confidence_score: randomDisease.confidence,
        remedies: randomDisease.remedies,
        status: "completed",
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error creating scan record:", insertError)
      return NextResponse.json({ error: "Error saving scan results" }, { status: 500 })
    }

    // Update usage after successful scan
    await updateUsageAfterScan(supabase, user.id, profile.is_admin)

    return NextResponse.json({
      success: true,
      scan: {
        id: scan.id,
        disease_name: randomDisease.name,
        confidence_score: randomDisease.confidence,
        remedies: randomDisease.remedies,
        created_at: scan.created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Scan API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to check if user can scan
async function checkUserCanScan(supabase: any, userId: string, isAdmin: boolean) {
  // Admin users have unlimited scans
  if (isAdmin) {
    return { allowed: true, reason: "Admin user" }
  }

  const today = new Date().toISOString().split("T")[0]

  // Check for active subscription with remaining scans
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("id, scans_remaining, status, expires_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .gt("scans_remaining", 0)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!subError && subscription && subscription.scans_remaining > 0) {
    console.log("[v0] User has active subscription with", subscription.scans_remaining, "scans remaining")
    return { allowed: true, reason: "Active subscription", subscription }
  }

  // Check daily usage for free users
  const { data: usage, error: usageError } = await supabase
    .from("daily_usage")
    .select("scans_used")
    .eq("user_id", userId)
    .eq("date", today)
    .single()

  const currentUsage = usage?.scans_used || 0
  const dailyLimit = 5

  if (currentUsage >= dailyLimit) {
    return { 
      allowed: false, 
      reason: "Daily scan limit reached. Please subscribe for unlimited scans." 
    }
  }

  console.log("[v0] User can scan - daily usage:", currentUsage, "/", dailyLimit)
  return { allowed: true, reason: "Within daily limit" }
}

// Helper function to update usage after scan
async function updateUsageAfterScan(supabase: any, userId: string, isAdmin: boolean) {
  // Don't track usage for admin users
  if (isAdmin) {
    console.log("[v0] Admin user - not tracking usage")
    return
  }

  // First, try to deduct from active subscription
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("id, scans_remaining")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .gt("scans_remaining", 0)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!subError && subscription && subscription.scans_remaining > 0) {
    // Deduct from subscription
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        scans_remaining: subscription.scans_remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", subscription.id)

    if (updateError) {
      console.error("[v0] Error updating subscription scans:", updateError)
    } else {
      console.log("[v0] Deducted 1 scan from subscription. Remaining:", subscription.scans_remaining - 1)
    }
    return
  }

  // If no active subscription, increment daily usage
  const today = new Date().toISOString().split("T")[0]

  // Get or create daily usage record
  let { data: usage, error: usageError } = await supabase
    .from("daily_usage")
    .select("scans_used")
    .eq("user_id", userId)
    .eq("date", today)
    .single()

  if (usageError && usageError.code === "PGRST116") {
    // Create new usage record
    const { error: createError } = await supabase
      .from("daily_usage")
      .insert({
        user_id: userId,
        date: today,
        scans_used: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (createError) {
      console.error("[v0] Error creating usage record:", createError)
    } else {
      console.log("[v0] Created new daily usage record with 1 scan")
    }
  } else if (!usageError && usage) {
    // Update existing usage record
    const { error: updateError } = await supabase
      .from("daily_usage")
      .update({ 
        scans_used: usage.scans_used + 1,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .eq("date", today)

    if (updateError) {
      console.error("[v0] Error updating daily usage:", updateError)
    } else {
      console.log("[v0] Updated daily usage to:", usage.scans_used + 1)
    }
  } else {
    console.error("[v0] Error fetching daily usage:", usageError)
  }
}