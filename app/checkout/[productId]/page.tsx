import { getProductById } from "@/lib/products";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import Link from "next/link";
import CheckoutFormWrapper from "./CheckoutFormWrapper";

export default async function CheckoutPage({
    params,
}: {
    params: Promise<{ productId: string }>;
}) {
    const { productId } = await params;
    const product = getProductById(productId);
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    if (!product) {
        notFound();
    }

    return (
        <article className="animate-fade-in pb-24 relative min-h-screen bg-surface-container-low">
            <main className="pt-32 lg:pt-40 max-w-6xl mx-auto px-6 lg:px-12">
                <div className="mb-12">
                    <Link href={`/product/${product.slug}`} className="font-label text-xs uppercase tracking-[0.3em] text-secondary hover:text-primary transition-colors inline-flex items-center gap-4 group">
                        <span className="w-8 h-[1px] bg-secondary group-hover:bg-primary group-hover:w-12 transition-all duration-300"></span>
                        Cancel & Return
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Order Summary (Left) */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-40">
                        <div className="space-y-4">
                            <h1 className="font-headline text-4xl text-primary leading-[1.05] -tracking-[0.03em]">
                                Complete Acquisition
                            </h1>
                            <p className="font-body text-secondary text-lg font-light italic">
                                Please review your order and securely complete your payment below.
                            </p>
                        </div>

                        <div className="bg-surface-container-lowest p-8 shadow-sm rounded-sm">
                            <div className="flex gap-6 items-center">
                                <div className="w-24 h-32 relative shrink-0 shadow-md">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-surface-variant flex items-center justify-center font-headline italic text-primary/20 text-xs text-center p-2">
                                            {product.title}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <span className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-on-secondary-container">
                                        {product.category}
                                    </span>
                                    <h2 className="font-headline text-xl text-primary">{product.title}</h2>
                                    <p className="font-headline italic text-sm text-secondary">By {product.author}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-between items-end">
                                <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Total</span>
                                <span className="font-headline text-2xl text-primary">${(product.price / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form (Right) */}
                    <div className="lg:col-span-7">
                        <div className="bg-surface-container-lowest p-8 md:p-12 shadow-sm rounded-sm min-h-[400px]">
                            <CheckoutFormWrapper productId={product.id} price={product.price} />
                        </div>
                    </div>

                </div>
            </main>
        </article>
    );
}
