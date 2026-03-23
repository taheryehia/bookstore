import { getProduct, products } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";


export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ canceled?: string }>;
}) {
    const { slug } = await params;
    const { canceled } = await searchParams;
    const product = getProduct(slug);
    const session = await auth();

    if (!product) {
        notFound();
    }

    return (
        <article className="animate-fade-in pb-24">
            {/* Cancellation Notice */}
            {canceled && (
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 text-center animate-scale-in">
                    <p className="text-amber-800 text-sm">
                        <strong>Order cancelled.</strong> No charges were made to your account.
                    </p>
                </div>
            )}

            <main className="pt-32 lg:pt-48 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Book Visual Section (Left) */}
                    <div className="lg:col-span-7 relative group">
                        {/* Decorative background element from design */}
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-surface-container-low -z-10 rounded-lg"></div>

                        <div className="bg-surface-container-lowest shadow-sm p-6 md:p-12 relative overflow-hidden rounded-sm">
                            <div className="aspect-[4/5] relative w-full shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-surface-variant flex items-center justify-center font-headline italic text-primary/20 text-4xl">
                                        {product.title}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Details Section (Right) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-12">
                        {/* Header Section */}
                        <div className="space-y-4">
                            <span className="font-label text-[0.7rem] uppercase tracking-[0.3em] text-on-secondary-container">
                                {product.category} & Aesthetics
                            </span>
                            <h1 className="font-headline text-5xl lg:text-7xl text-primary leading-[1.05] -tracking-[0.03em]">
                                {product.title}
                            </h1>
                            <p className="font-headline italic text-2xl text-secondary font-normal">
                                By {product.author}
                            </p>
                        </div>

                        {/* Price & Divider */}
                        <div className="space-y-6">
                            <p className="font-headline text-4xl text-primary">
                                ${(product.price / 100).toFixed(2)}
                            </p>
                            <div className="h-[1px] w-24 bg-primary opacity-20"></div>
                        </div>

                        {/* Editorial Description */}
                        <div className="space-y-6 font-body text-secondary text-lg leading-[1.8] font-light italic">
                            {product.description.split('. ').map((sentence, idx) => (
                                <p key={idx}>{sentence}.</p>
                            ))}
                        </div>

                        {/* Action CTA */}
                        <div className="space-y-10 pt-4">
                            {session ? (
                                <form action="/api/checkout" method="POST">
                                    <input type="hidden" name="priceId" value={product.id} />
                                    <button
                                        type="submit"
                                        className="btn-primary w-full py-6 text-xs tracking-[0.2em]"
                                    >
                                        Purchase Acquisition
                                    </button>
                                </form>
                            ) : (
                                <Link
                                    href="/login"
                                    className="btn-primary w-full py-6 text-xs tracking-[0.2em]"
                                >
                                    Purchase Acquisition
                                </Link>
                            )}

                            {/* Metadata Chips / Archival Info */}
                            <div className="flex flex-wrap gap-3">
                                <span className="px-5 py-2 bg-secondary-container/50 text-on-secondary-container rounded-full text-[0.6rem] font-label uppercase tracking-widest font-bold">
                                    {product.binding}
                                </span>
                                <span className="px-5 py-2 bg-secondary-container/50 text-on-secondary-container rounded-full text-[0.6rem] font-label uppercase tracking-widest font-bold">
                                    Edition {product.edition}
                                </span>
                                <span className="px-5 py-2 bg-secondary-container/50 text-on-secondary-container rounded-full text-[0.6rem] font-label uppercase tracking-widest font-bold">
                                    {product.pages} Pages
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Return Anchor */}
                <div className="mt-32 border-t border-outline-variant/10 pt-16">
                    <Link href="/" className="font-label text-xs uppercase tracking-[0.3em] text-secondary hover:text-primary transition-colors inline-flex items-center gap-4 group">
                        <span className="w-12 h-[1px] bg-secondary group-hover:bg-primary group-hover:w-16 transition-all duration-500"></span>
                        Return to Archives
                    </Link>
                </div>
            </main>
        </article>
    );
}
