import { products } from "@/lib/products";
import { ProductGrid } from "@/app/components/ProductGrid";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-0 overflow-hidden">
                <div className="max-w-screen-2xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-5 z-10 pt-16">
                        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-6 block">Volume IV · Autumn 2024</span>
                        <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl text-primary leading-[1.1] -tracking-[0.03em] mb-8">
                            The Quiet <br />Art of <br /><span className="italic">Curation.</span>
                        </h1>
                        <p className="font-body text-lg text-secondary max-w-md mb-10 leading-relaxed">
                            A sanctuary for those who seek the tactile resonance of a printed page. Hand-selected editions for the discerning collector.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#archive" className="btn-primary">
                                Explore Catalog
                            </Link>
                            <Link href="/about" className="border border-outline-variant/30 text-primary px-8 py-4 rounded-md font-body font-bold text-sm tracking-wide uppercase hover:bg-surface-container-low transition-colors flex items-center justify-center">
                                The Journal
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-7 relative flex justify-end items-end">
                        <div className="relative w-full max-w-2xl aspect-[4/5] overflow-hidden rounded-sm shadow-2xl transition-all duration-700 hover:shadow-primary/5 translate-x-12 lg:translate-x-24 z-20">
                            <Image
                                className="w-full h-full object-cover"
                                src="/images/hero.webp"
                                alt="Elegant library space"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />
                            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
                        </div>
                        {/* Asymmetric Decorative Element */}
                        <div className="absolute bottom-0 -left-12 w-64 h-80 bg-surface-container-high z-10 rounded-sm shadow-sm md:block"></div>
                    </div>
                </div>
            </section>

            {/* Curated Selection Section */}
            <section id="archive" className="py-32 bg-surface-container-low scroll-mt-20">
                <div className="max-w-screen-2xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-4">
                        <div>
                            <h2 className="font-headline text-4xl text-primary -tracking-tight">Curated Selection</h2>
                            <p className="font-body text-secondary mt-2 italic">Refined titles for your personal archive.</p>
                        </div>
                        <Link className="font-label text-xs uppercase tracking-widest text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all" href="#">
                            View All Collections
                        </Link>
                    </div>

                    <ProductGrid products={products} />
                </div>
            </section>

            {/* Newsletter / Callout */}
            <section className="py-32 px-8 bg-background">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-12 h-[1px] bg-primary mx-auto mb-10"></div>
                    <h2 className="font-headline text-3xl md:text-5xl text-primary mb-8 leading-tight">Join the Slow-Digital Movement.</h2>
                    <p className="font-body text-secondary mb-12 max-w-xl mx-auto text-lg">
                        Receive a monthly curated list of rare finds, author interviews, and essays on the art of reading.
                    </p>
                    <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                        <input className="flex-grow bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary font-body text-sm py-4 px-0 placeholder:text-outline-variant transition-colors" placeholder="Email Address" type="email" />
                        <button className="font-label text-xs uppercase tracking-widest text-primary font-bold hover:opacity-70 transition-opacity" type="submit">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
}