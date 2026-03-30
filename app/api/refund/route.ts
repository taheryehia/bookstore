import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
    : null;

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!stripe) {
        return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
    }

    const { orderId } = await request.json();

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order || order.userId !== session.user.id) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status === "refunded") {
            return NextResponse.json({ error: "Already refunded" }, { status: 400 });
        }

        // Now that we use Payment Intents directly, the stored stripeSessionId is the payment_intent ID.
        await stripe.refunds.create({
            payment_intent: order.stripeSessionId,
        });

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "refunded" }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Refund error:", error);
        return NextResponse.json({ error: "Refund failed" }, { status: 500 });
    }
}
