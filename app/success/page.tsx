import Link from "next/link";
import { OrderSaver } from "./OrderSaver";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ payment_intent: string; product_id: string }>;
}) {
    const { payment_intent, product_id } = await searchParams;

    return (
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 py-24 animate-fade-in">
            { }
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-scale-in">
                <CheckCircle className="text-green-600" size={40} />
            </div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-4xl md:text-5xl font-serif text-stone-900">
                    Order Confirmed
                </h1>
                <p className="text-stone-500 font-light text-lg">
                    Thank you for your purchase. Your artifact is being prepared for shipment.
                </p>
            </div>

            { }
            <div className="mt-8 px-6 py-3 bg-stone-100 rounded-full">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                    Reference: {payment_intent?.slice(-12) || "PENDING"}
                </span>
            </div>

            { }
            <OrderSaver sessionId={payment_intent} productId={product_id} />

            { }
            <div className="mt-12 p-6 bg-stone-50 rounded-lg border border-stone-100 max-w-md w-full">
                <div className="flex items-start gap-4 text-left">
                    <Package className="text-stone-400 shrink-0 mt-1" size={20} />
                    <div>
                        <h3 className="font-medium text-stone-900 mb-1">What's next?</h3>
                        <p className="text-sm text-stone-500">
                            You'll receive a confirmation email with tracking information once your order ships.
                        </p>
                    </div>
                </div>
            </div>

            { }
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link
                    href="/orders"
                    className="btn-primary inline-flex items-center gap-3 group"
                >
                    <span>View Orders</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                    href="/"
                    className="btn-secondary"
                >
                    Continue Browsing
                </Link>
            </div>
        </section>
    );
}