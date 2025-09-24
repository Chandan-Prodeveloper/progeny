import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Force the route to be dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Get user profile to check if admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin, full_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Error loading profile:", profileError)
      return NextResponse.json({ error: "Error loading profile" }, { status: 500 })
    }

    // Get today's usage
    const today = new Date().toISOString().split("T")[0]
    const { data: dailyUsage, error: usageError } = await supabase
      .from("daily_usage")
      .select("scans_used")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()

    // Get active subscription info
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("scans_remaining, expires_at, status, plan_type, created_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Get recent scans with better error handling
    const { data: recentScans, error: scansError } = await supabase
      .from("scans")
      .select("id, disease_name, confidence_score, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (scansError) {
      console.error("[v0] Error loading recent scans:", scansError)
    }

    // Calculate total scans used today (considering both daily and subscription usage)
    const dailyScansUsed = dailyUsage?.scans_used || 0
    const hasActiveSubscription = subscription && subscription.scans_remaining > 0
    
    // Determine if user can scan
    let canScan = false
    if (profile.is_admin) {
      canScan = true
    } else if (hasActiveSubscription) {
      canScan = subscription.scans_remaining > 0
    } else {
      canScan = dailyScansUsed < 5
    }

    console.log("[v0] Usage calculation:", {
      userId: user.id,
      isAdmin: profile.is_admin,
      dailyScansUsed,
      hasActiveSubscription,
      subscriptionScansRemaining: subscription?.scans_remaining || 0,
      canScan
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile.full_name,
        is_admin: profile.is_admin,
      },
      usage: {
        daily_scans_used: dailyScansUsed,
        daily_limit: 5,
        can_scan: canScan,
        total_scans_available: profile.is_admin 
          ? "unlimited" 
          : (hasActiveSubscription ? subscription.scans_remaining : Math.max(0, 5 - dailyScansUsed))
      },
      subscription: subscription
        ? {
            scans_remaining: subscription.scans_remaining,
            expires_at: subscription.expires_at,
            status: subscription.status,
            plan_type: subscription.plan_type || "premium_monthly"
          }
        : null,
      recent_scans: recentScans || [],
    })
  } catch (error) {
    console.error("[v0] Usage API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
