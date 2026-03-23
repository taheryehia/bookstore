'use client';
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const verified = searchParams.get("verified");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                throw new Error("Invalid credentials");
            }

            router.push("/orders");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex-grow flex items-center justify-center px-6 py-16 relative min-h-[80vh]">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-surface-container-low -z-10"></div>

            <div className="max-w-md w-full">
                <div className="text-center mb-12">
                    <h1 className="font-headline italic text-4xl text-primary tracking-tight">The Literary Atelier</h1>
                    <p className="font-label text-secondary text-[0.7rem] uppercase tracking-[0.2em] mt-3">Curating the written word</p>
                </div>

                <div className="bg-surface-container-lowest shadow-ambient p-10 md:p-14 border-none relative rounded-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/10"></div>

                    <header className="mb-10 text-left">
                        <h2 className="font-headline text-2xl text-primary mb-2">Welcome back</h2>
                        <p className="text-secondary text-sm">Continue your literary journey.</p>
                    </header>

                    {(registered || verified) && (
                        <div className="mb-6 bg-green-50 p-4 border border-green-200 text-green-800 text-sm font-body italic rounded-lg text-center animate-scale-in">
                            {verified ? "Email verified successfully. Please sign in." : "Account created successfully. Please sign in."}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-error-container p-4 border border-error/20 text-error text-sm font-body rounded-lg text-center animate-scale-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <label className="block font-label text-[0.65rem] uppercase tracking-widest text-secondary mb-1" htmlFor="email">Email Address</label>
                            <input
                                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-colors duration-300 placeholder:text-outline-variant/50 text-on-surface"
                                id="email"
                                name="email"
                                placeholder="reader@atelier.com"
                                type="email"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="flex justify-between items-end mb-1">
                                <label className="block font-label text-[0.65rem] uppercase tracking-widest text-secondary" htmlFor="password">Password</label>
                                <Link className="font-label text-[0.6rem] uppercase tracking-wider text-secondary hover:text-primary transition-colors" href="#">Forgot?</Link>
                            </div>
                            <input
                                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-colors duration-300 placeholder:text-outline-variant/50 text-on-surface"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                required
                            />
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                disabled={loading}
                                className="btn-primary w-full"
                                type="submit"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? "Signing In..." : "Sign In"}
                            </button>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                                <span className="font-label text-[0.6rem] uppercase tracking-widest text-outline">Or</span>
                                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                            </div>

                            <button
                                onClick={() => signIn("google", { callbackUrl: "/orders" })}
                                className="w-full py-4 bg-transparent border border-outline-variant/30 text-primary font-body font-medium flex items-center justify-center gap-3 rounded-md hover:bg-surface-container-high transition-colors active:scale-[0.99]"
                                type="button"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="text-sm tracking-wide">Sign in with Google</span>
                            </button>
                        </div>
                    </form>

                    <footer className="mt-12 text-center text-left-md">
                        <p className="text-secondary text-sm">
                            Don't have an account? {' '}
                            <Link className="text-primary font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity" href="/register">Register</Link>
                        </p>
                    </footer>
                </div>

                <div className="mt-12 text-center opacity-40">
                    <p className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-secondary">Est. 2024 — London / Paris / New York</p>
                </div>
            </div>
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-outline" size={32} />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
