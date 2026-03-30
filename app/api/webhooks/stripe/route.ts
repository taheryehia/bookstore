import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia",
    })
    : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    if (!stripe || !webhookSecret) {
        return NextResponse.json({ error: "Stripe configuration missing on server" }, { status: 500 });
    }

    try {
        const body = await req.text();
        const headerList = await headers();
        const signature = headerList.get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`⚠️ Webhook signature verification failed.`, err.message);
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const { userId, productId } = paymentIntent.metadata || {};

                if (!userId || !productId) {
                    console.error("Missing metadata for PaymentIntent:", paymentIntent.id);
                    break;
                }

                // Check if the order was already saved
                const existingOrder = await prisma.order.findUnique({
                    where: { stripeSessionId: paymentIntent.id }
                });

                if (!existingOrder) {
                    await prisma.order.create({
                        data: {
                            userId: userId,
                            stripeSessionId: paymentIntent.id,
                            productId: productId,
                            amount: paymentIntent.amount,
                            status: "paid",
                        }
                    });
                    console.log(`✅ Order successfully created from webhook for PaymentIntent: ${paymentIntent.id}`);
                }
                break;

            case "payment_intent.payment_failed":
                const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`❌ Payment failed for PaymentIntent: ${failedPaymentIntent.id}`);
                break;

            case "charge.refunded":
                const charge = event.data.object as Stripe.Charge;
                if (charge.payment_intent) {
                    // Update database to reflect refunded status
                    await prisma.order.updateMany({
                        where: { stripeSessionId: charge.payment_intent as string },
                        data: { status: "refunded" }
                    });
                    console.log(`🔄 Order status set to refunded for PaymentIntent: ${charge.payment_intent}`);
                }
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook processing error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
