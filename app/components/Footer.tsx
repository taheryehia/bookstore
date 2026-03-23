import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-surface-dim text-primary w-full mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full space-y-8 md:space-y-0">
                <div className="flex flex-col items-center md:items-start space-y-2">
                    <span className="font-serif text-xl text-primary">The Literary Atelier</span>
                    <p className="font-body text-sm tracking-wide text-secondary">
                        © {new Date().getFullYear()} The Literary Atelier. Curated for the discerning reader.
                    </p>
                </div>
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                    <Link href="#" className="font-body text-sm tracking-wide text-secondary hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="font-body text-sm tracking-wide text-secondary hover:text-primary transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="#" className="font-body text-sm tracking-wide text-secondary hover:text-primary transition-colors">
                        Shipping & Returns
                    </Link>
                    <Link href="#" className="font-body text-sm tracking-wide text-secondary hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
