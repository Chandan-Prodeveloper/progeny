import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
})

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

        const { priceId } = await request.json()

        // Define pricing plans
        const plans = {
            premium_monthly: {
                amount: 20000, // ₹200 in paise
                currency: "inr",
                scans: 100,
                duration_days: 28,
                name: "Premium Monthly Plan",
                description: "100 scans valid for 28 days",
            },
        }

        const plan = plans[priceId as keyof typeof plans]
        if (!plan) {
            return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
        }

        // Get user profile for customer details
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", user.id)
            .single()

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: plan.currency,
                        product_data: {
                            name: plan.name,
                            description: plan.description,
                        },
                        unit_amount: plan.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
            customer_email: user.email || profile?.email,
            metadata: {
                user_id: user.id,
                plan_type: priceId,
                scans: plan.scans.toString(),
                duration_days: plan.duration_days.toString(),
            },
        })

        console.log("[v0] Stripe checkout session created:", session.id)

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        })
    } catch (error) {
        console.error("[v0] Stripe checkout creation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}