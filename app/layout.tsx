import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Providers } from "./components/Providers";

const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-noto-serif", weight: ["400", "700"], style: ["normal", "italic"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
    metadataBase: process.env.NEXT_PUBLIC_URL ? new URL(process.env.NEXT_PUBLIC_URL) : undefined,
    title: "Sign In | The Literary Atelier",
    description: "Curated for the discerning reader.",
    openGraph: {
        title: "Sign In | The Literary Atelier",
        description: "Curated for the discerning reader.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${notoSerif.variable} ${manrope.variable} font-body antialiased bg-background text-on-surface flex flex-col min-h-screen selection:bg-primary selection:text-on-primary`}>
                <Providers>
                    <Header />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}