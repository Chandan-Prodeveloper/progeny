import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()

        // In production, you would verify the webhook signature here
        const sig = request.headers.get('stripe-signature')

        let event: Stripe.Event

        if (sig && process.env.STRIPE_WEBHOOK_SECRET) {
            // Production: Verify webhook signature
            try {
                event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
            } catch (err) {
                console.error("Webhook signature verification failed:", err)
                return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
            }
        } else {
            // Development/Test: Parse body directly
            event = JSON.parse(body)
        }

        const supabase = await createClient()

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session
            const { user_id, scans, duration_days, plan_type } = session.metadata || {}

            if (!user_id || !scans || !duration_days) {
                console.error("[v0] Missing required metadata in session:", session.id)
                return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
            }

            // Calculate expiry date
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + Number.parseInt(duration_days))

            // Create or update subscription
            const { error } = await supabase.from("subscriptions").upsert({
                user_id,
                stripe_subscription_id: session.id,
                stripe_customer_id: session.customer,
                status: "active",
                scans_remaining: Number.parseInt(scans),
                expires_at: expiresAt.toISOString(),
                plan_type: plan_type || "premium_monthly",
                updated_at: new Date().toISOString(),
            })

            if (error) {
                console.error("[v0] Error updating subscription:", error)
                return NextResponse.json({ error: "Error updating subscription" }, { status: 500 })
            }

            console.log("[v0] Subscription activated for user:", user_id)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("[v0] Webhook error:", error)
        return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }
}