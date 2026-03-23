'use client';

import { useState } from "react";
import { getProductById } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, XCircle, ArrowRight } from "lucide-react";

interface DBOrder {
    id: string;
    stripeSessionId: string;
    productId: string;
    createdAt: Date;
    status: string;
}

export function OrderList({ initialOrders }: { initialOrders: DBOrder[] }) {
    const router = useRouter();
    const [refundingFnId, setRefundingFnId] = useState<string | null>(null);

    const handleRefund = async (orderId: string) => {
        if (!confirm("Are you sure you want to refund this item?")) return;

        setRefundingFnId(orderId);
        try {
            const res = await fetch("/api/refund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId })
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Refund failed. Please contact support.");
            }
        } catch (error) {
            console.error(error);
            alert("Error processing refund.");
        } finally {
            setRefundingFnId(null);
        }
    };

    if (initialOrders.length === 0) {
        return (
            <div className="bg-surface-container-low p-12 text-center rounded-lg animate-fade-in py-32 border border-outline-variant/10">
                <p className="text-secondary mb-8 font-headline text-2xl italic">
                    Your collection is currently empty.
                </p>
                <Link href="/" className="btn-primary inline-flex items-center gap-2 group">
                    Begin Your Curation
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-fade-in-up">
            <h3 className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-8 pb-2 border-b border-outline-variant/20">Summary of Acquisitions</h3>

            <div className="space-y-16">
                {initialOrders.map((order) => {
                    const product = getProductById(order.productId);
                    if (!product) return null;

                    const isRefunding = refundingFnId === order.id;
                    const isRefunded = order.status === "refunded";

                    return (
                        <div key={order.id} className={`flex flex-col sm:flex-row gap-10 group relative transition-opacity duration-300 ${isRefunded ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            {/* Decorative order number / background */}
                            <div className="absolute -left-12 top-0 text-outline-variant/20 font-headline italic text-8xl -z-10 select-none hidden lg:block">
                                #{order.id.slice(-4).toUpperCase()}
                            </div>

                            <Link href={`/product/${product.slug}`} className="w-32 h-44 bg-surface-variant flex-shrink-0 shadow-sm relative overflow-hidden rounded-sm group-hover:scale-[1.02] transition-transform duration-500">
                                {product.image && (
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                )}
                                <div className="absolute inset-0 bg-primary/5"></div>
                            </Link>

                            <div className="flex-grow py-2 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-headline text-2xl text-primary leading-tight">
                                            {product.title}
                                        </h4>
                                        <p className="font-body text-secondary text-sm italic">{product.subtitle}</p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <p className="font-label text-[10px] text-outline tracking-widest uppercase">
                                                ID: {order.id.slice(-10)}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-outline-variant/30"></span>
                                            <p className="font-label text-[10px] text-outline tracking-widest uppercase">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-headline text-xl text-primary">
                                            ${(product.price / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
                                    <div className="flex items-center text-xs text-secondary italic">
                                        {isRefunded ? (
                                            <div className="flex items-center gap-2 text-error">
                                                <XCircle size={14} />
                                                DE-ACCESSIONED
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Package size={14} strokeWidth={1.5} />
                                                1 UNIT SECURED · PREPARING PROVENANCE
                                            </div>
                                        )}
                                    </div>

                                    {!isRefunded && (
                                        <button
                                            onClick={() => handleRefund(order.id)}
                                            disabled={isRefunding}
                                            className="text-[10px] font-label font-bold text-secondary hover:text-error uppercase tracking-widest transition-colors disabled:opacity-50 underline decoration-outline-variant/30 underline-offset-8"
                                        >
                                            {isRefunding ? "Processing..." : "Refund Acquisition"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
