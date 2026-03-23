'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Package } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (isAuthPage) return null;

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-[20px] transition-colors duration-300 border-b border-outline-variant/10">
            <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto w-full">
                <Link href="/" className="text-2xl font-headline italic text-primary hover:opacity-80 transition-opacity">
                    The Literary Atelier
                </Link>

                <div className="hidden md:flex items-center space-x-12 font-headline font-medium tracking-tight">
                    <Link href="/" className={`${pathname === '/' ? 'text-primary border-b-2 border-primary' : 'text-secondary'} pb-1 hover:text-primary transition-colors`}>Collections</Link>
                    <Link href="/authors" className="text-secondary hover:text-primary transition-colors">Authors</Link>
                    <Link href="/journal" className="text-secondary hover:text-primary transition-colors">Journal</Link>
                </div>

                <div className="flex items-center space-x-6 text-primary">
                    <Link href="/orders" className="hover:opacity-70 transition-opacity scale-100 active:scale-90 duration-200">
                        <ShoppingBag size={22} strokeWidth={1.5} />
                    </Link>

                    {session?.user ? (
                        <Link href="/profile" className="hover:opacity-70 transition-opacity scale-100 active:scale-90 duration-200 flex items-center gap-2">
                            <User size={22} strokeWidth={1.5} />
                            <span className="hidden lg:inline font-label text-[10px] uppercase tracking-widest text-secondary truncate max-w-[80px]">
                                {session.user.name || session.user.email}
                            </span>
                        </Link>
                    ) : (
                        <Link href="/login" className="hover:opacity-70 transition-opacity scale-100 active:scale-90 duration-200">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
