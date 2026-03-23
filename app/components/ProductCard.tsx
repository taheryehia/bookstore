import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductCardProps {
    product: Product;
    index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
    return (
        <Link
            href={`/product/${product.slug}`}
            className="group cursor-pointer block animate-fade-in-up"
            style={{ animationDelay: `${index * 0.15}s` }}
        >
            <div className="aspect-[2/3] mb-8 bg-surface-container-highest overflow-hidden transition-all duration-500 group-hover:-translate-y-2 rounded-sm relative shadow-sm">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center font-headline italic text-primary/30">
                        {product.title[0]}
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-secondary-container">
                    {product.category} · {product.edition}
                </span>
                <h3 className="font-headline text-xl text-primary leading-tight group-hover:text-primary/70 transition-colors">
                    {product.title}
                </h3>
                <p className="font-body text-sm text-secondary">
                    {product.author}
                </p>
                <p className="font-body text-sm font-bold text-primary mt-4">
                    ${(product.price / 100).toFixed(2)}
                </p>
            </div>
        </Link>
    );
}
