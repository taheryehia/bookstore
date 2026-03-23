import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderList } from "./OrderList";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default async function OrdersPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <main className="pt-24 lg:pt-32 pb-48 px-6 md:px-12 max-w-5xl mx-auto flex flex-col justify-center min-h-[80vh]">
            {/* Header / Hero */}
            <header className="text-center mb-32 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container mb-12 shadow-sm">
                    <CheckCircle2 size={48} strokeWidth={1} />
                </div>
                <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-primary tracking-tight mb-8 leading-[1.1]">
                    The Curated <br />Archive.
                </h1>
                <p className="font-body text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
                    A record of your literary acquisitions. Each volume is preserved and tracked within your personal Atelier collection.
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/"
                        className="btn-secondary inline-flex items-center gap-3 group text-[10px] uppercase font-bold tracking-[0.2em]"
                    >
                        Explore More
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </header>

            {/* List Frame */}
            <div className="space-y-24">
                <OrderList initialOrders={orders} />
            </div>

            {/* Help / Footer CTA */}
            <div className="pt-32 flex flex-col items-center space-y-6 animate-fade-in">
                <Link
                    href="/"
                    className="btn-primary px-16 py-6"
                >
                    Return to Collections
                </Link>
                <p className="font-body text-xs text-secondary italic">
                    Need assistance with your archive? <Link className="text-primary font-bold underline underline-offset-4 decoration-surface-tint" href="#">Contact our Concierge</Link>
                </p>
            </div>
        </main>
    );
}
