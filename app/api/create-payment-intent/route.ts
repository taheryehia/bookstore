import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/lib/products";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia",
    })
    : null;

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!dbUser) {
        return NextResponse.json({ error: "User no longer exists. Please sign out and sign in again." }, { status: 403 });
    }

    if (!stripe) {
        console.error("Stripe secret key is missing");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    try {
        const { productId } = await request.json();

        const product = products.find(p => p.id === productId);

        if (!product) {
            return NextResponse.json({ error: "Invalid Product" }, { status: 400 });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: product.price, // amount is in cents
            currency: 'usd',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: session.user.id,
                productId: product.id,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err: any) {
        console.error("Stripe Error:", err);
        return NextResponse.json({ error: err.message || "Failed to create PaymentIntent" }, { status: 500 });
    }
}
