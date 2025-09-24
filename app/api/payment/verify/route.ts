import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
    console.log("[DEBUG] Payment verification started")
    
    try {
        // Check environment variables
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("[ERROR] STRIPE_SECRET_KEY not found")
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        console.log("[DEBUG] Creating Supabase client")
        const supabase = await createClient()

        // Get current user first
        console.log("[DEBUG] Getting user authentication")
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        
        if (authError) {
            console.error("[ERROR] Authentication error:", authError)
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
        }
        
        if (!user) {
            console.error("[ERROR] No user found")
            return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 })
        }

        console.log("[DEBUG] User authenticated:", user.id)

        // Parse request body
        let requestData;
        try {
            requestData = await request.json()
            console.log("[DEBUG] Request data parsed:", requestData)
        } catch (parseError) {
            console.error("[ERROR] JSON parse error:", parseError)
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
        }

        const { stripe_session_id } = requestData

        if (!stripe_session_id) {
            console.error("[ERROR] Missing session ID")
            return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
        }

        console.log("[DEBUG] Verifying payment for user:", user.id, "session:", stripe_session_id)

        // **CRITICAL FIX: Check if this session has already been processed**
        console.log("[DEBUG] Checking for existing subscription with this session ID")
        const { data: existingSubscription, error: existingError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("stripe_subscription_id", stripe_session_id)
            .single()

        if (existingError && existingError.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error("[ERROR] Error checking existing subscription:", existingError)
            return NextResponse.json({ 
                error: "Database error while checking subscription", 
                details: existingError.message 
            }, { status: 500 })
        }

        // If subscription already exists, return success
        if (existingSubscription) {
            console.log("[DEBUG] Subscription already exists for session:", stripe_session_id)
            return NextResponse.json({
                success: true,
                subscription: {
                    id: existingSubscription.id,
                    scans_remaining: existingSubscription.scans_remaining,
                    expires_at: existingSubscription.expires_at,
                    status: existingSubscription.status,
                },
                message: "Subscription already activated"
            })
        }

        // Verify the session with Stripe
        let session;
        try {
            console.log("[DEBUG] Retrieving Stripe session")
            session = await stripe.checkout.sessions.retrieve(stripe_session_id)
            console.log("[DEBUG] Stripe session retrieved successfully")
        } catch (stripeError) {
            console.error("[ERROR] Stripe session retrieval failed:", stripeError)
            return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
        }

        // Verify payment was successful
        if (session.payment_status !== "paid") {
            console.error("[ERROR] Payment not completed for session:", stripe_session_id, "Status:", session.payment_status)
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
        }

        // Verify session belongs to the current user (if metadata exists)
        if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
            console.error("[ERROR] Session user mismatch:", session.metadata.user_id, "vs", user.id)
            return NextResponse.json({ error: "Session verification failed" }, { status: 400 })
        }

        console.log("[DEBUG] Payment verified successfully for session:", stripe_session_id)
        console.log("[DEBUG] Session details:", {
            payment_status: session.payment_status,
            customer: session.customer,
            amount_total: session.amount_total,
            currency: session.currency
        })

        // Get plan details from metadata or use defaults
        const scans = parseInt(session.metadata?.scans || "100")
        const durationDays = parseInt(session.metadata?.duration_days || "28")

        // Calculate expiry date
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + durationDays)

        console.log("[DEBUG] Creating new subscription")
        
        // **CRITICAL FIX: Use insert with proper error handling for duplicates**
        const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .insert({
                user_id: user.id,
                stripe_subscription_id: stripe_session_id,
                stripe_customer_id: session.customer?.toString() || null,
                status: "active",
                scans_remaining: scans,
                expires_at: expiresAt.toISOString(),
                plan_type: session.metadata?.plan_type || "premium_monthly",
            })
            .select()
            .single()

        if (subError) {
            // If it's a duplicate key error, try to fetch the existing subscription
            if (subError.code === '23505') {
                console.log("[DEBUG] Duplicate subscription detected, fetching existing one")
                const { data: existingSub } = await supabase
                    .from("subscriptions")
                    .select("*")
                    .eq("stripe_subscription_id", stripe_session_id)
                    .single()

                if (existingSub) {
                    return NextResponse.json({
                        success: true,
                        subscription: {
                            id: existingSub.id,
                            scans_remaining: existingSub.scans_remaining,
                            expires_at: existingSub.expires_at,
                            status: existingSub.status,
                        },
                        message: "Subscription already activated"
                    })
                }
            }
            
            console.error("[ERROR] Error creating subscription:", subError)
            return NextResponse.json({ 
                error: "Error activating subscription", 
                details: subError.message 
            }, { status: 500 })
        }

        console.log("[DEBUG] Ensuring user profile and resetting daily usage")
        // Call your custom function to ensure profile exists and reset usage
        try {
            const { error: profileError } = await supabase.rpc('ensure_user_profile')
            if (profileError) {
                console.error("[WARNING] Could not ensure user profile:", profileError)
            }
        } catch (profileError) {
            console.error("[WARNING] Profile function error:", profileError)
        }

        console.log("[DEBUG] Subscription created successfully:", subscription.id)

        return NextResponse.json({
            success: true,
            subscription: {
                id: subscription.id,
                scans_remaining: subscription.scans_remaining,
                expires_at: subscription.expires_at,
                status: subscription.status,
            },
            message: "Subscription activated successfully"
        })
    } catch (error) {
        console.error("[ERROR] Payment verification error:", error)
        console.error("[ERROR] Error stack:", error instanceof Error ? error.stack : "No stack trace")
        return NextResponse.json({ 
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}