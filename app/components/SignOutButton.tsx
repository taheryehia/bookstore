'use client';

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    return (
        <button
            onClick={() => {
                if (confirm("Are you sure you want to sign out?")) {
                    signOut({ callbackUrl: "/" });
                }
            }}
            className="font-label text-xs uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors flex items-center gap-2"
        >
            <LogOut size={14} strokeWidth={1.5} />
            <span className="hidden lg:inline">Sign Out</span>
        </button>
    );
}
