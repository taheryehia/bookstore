'use client';

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Pencil, X, Check, ShieldAlert, Mail, Loader2, RefreshCw, ArrowRight, Edit3, LogOut } from "lucide-react";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (session?.user) {
            setUserName(session.user.name || "");
            setUserEmail(session.user.email || "");
        }
    }, [session]);

    const [showVerify, setShowVerify] = useState(false);
    const [tempEmail, setTempEmail] = useState("");
    const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const verifyRefs = useRef<(HTMLInputElement | null)[]>([]);

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        if (data.password === "") delete data.password;

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const updatedUser = await res.json();
            if (!res.ok) throw new Error(updatedUser.error || "Failed to update profile");

            if (updatedUser.emailVerificationPending) {
                setTempEmail(data.email as string);
                setShowVerify(true);
                setIsEditing(false);
            } else {
                setUserName(updatedUser.name);
                await update({ name: updatedUser.name });
                setMessage("Profile updated successfully.");
                setIsEditing(false);
            }
        } catch (err: any) {
            setError(err.message || "Update failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyEmail(e: React.FormEvent) {
        e.preventDefault();
        setVerifying(true);
        setError("");
        const fullCode = verifyCode.join('');
        try {
            const res = await fetch("/api/profile/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: tempEmail, code: fullCode }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Verification failed");
            setUserEmail(tempEmail);
            await update({ email: tempEmail, name: result.name || session?.user?.name });
            setMessage("Email updated and verified successfully.");
            setShowVerify(false);
            setVerifyCode(['', '', '', '', '', '']);
        } catch (err: any) {
            setError(err.message || "Incorrect verification code.");
        } finally {
            setVerifying(false);
        }
    }

    async function handleResendCode() {
        setResending(true);
        setError("");
        try {
            const res = await fetch("/api/register/resend", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: tempEmail }),
            });
            if (!res.ok) throw new Error("Failed to resend");
            setMessage("Verification code resent.");
        } catch (err) {
            setError("Resend failed. Try again soon.");
        } finally {
            setResending(false);
        }
    }

    async function handleDeleteAccount() {
        if (!confirm("CRITICAL: This will permanently delete your account and all order history. This cannot be undone. Proceed?")) return;
        try {
            const res = await fetch("/api/profile", { method: "DELETE" });
            if (res.ok) await signOut({ callbackUrl: "/" });
        } catch (err) { alert("Failed to delete account."); }
    }

    function handleVerifyCodeChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...verifyCode];
        newCode[index] = value.slice(-1);
        setVerifyCode(newCode);
        if (value && index < 5) verifyRefs.current[index + 1]?.focus();
    }

    if (!session) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-secondary font-headline italic bg-background">
            Authenticating your provenance...
        </div>
    );

    return (
        <main className="min-h-screen pt-32 pb-48 px-6 flex flex-col items-center justify-center bg-background">
            <div className="w-full max-w-2xl bg-surface-container-lowest shadow-ambient rounded-sm overflow-hidden relative border border-outline-variant/10 animate-fade-in-up">
                {!showVerify ? (
                    <>
                        {/* Header Section */}
                        <div className="p-10 md:p-14 flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-headline text-3xl md:text-4xl text-primary tracking-tight font-light">Account Details</h1>
                                <p className="font-body text-secondary text-sm tracking-wide">Review or modify your records.</p>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center space-x-2 px-4 py-2 font-label text-[0.7rem] font-bold uppercase tracking-[0.15em] transition-all rounded-md group ${isEditing ? 'text-error hover:bg-error/5' : 'text-primary hover:bg-surface-container-low'}`}
                            >
                                {isEditing ? (
                                    <>
                                        <X size={16} />
                                        <span>CANCEL</span>
                                    </>
                                ) : (
                                    <>
                                        <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
                                        <span>EDIT</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Profile Content */}
                        <div className="px-10 md:px-14 pb-14">
                            <form onSubmit={handleUpdate} className="space-y-12">
                                {message && (
                                    <div className="p-4 bg-green-50 text-green-800 text-[0.7rem] uppercase tracking-widest font-bold border border-green-100 flex items-center gap-3 animate-slide-up rounded-md mb-8">
                                        <Check size={14} /> {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="p-4 bg-error-container/30 text-error text-[0.7rem] uppercase tracking-widest font-bold border border-error/5 flex items-center gap-3 animate-slide-up rounded-md mb-8">
                                        <ShieldAlert size={14} /> {error}
                                    </div>
                                )}

                                {/* Data Field: Name */}
                                <div className="relative group">
                                    <label className="block font-label text-[0.7rem] font-bold uppercase tracking-[0.2em] text-on-secondary-container mb-3">NAME</label>
                                    {isEditing ? (
                                        <input
                                            name="name"
                                            type="text"
                                            defaultValue={userName}
                                            className="w-full bg-transparent border-0 border-b border-primary py-3 px-0 focus:ring-0 font-headline text-xl text-primary"
                                            required
                                        />
                                    ) : (
                                        <div className="text-xl font-headline text-primary border-b border-outline-variant/30 pb-4 group-hover:border-primary transition-colors">
                                            {userName}
                                        </div>
                                    )}
                                </div>

                                {/* Data Field: Email */}
                                <div className="relative group">
                                    <label className="block font-label text-[0.7rem] font-bold uppercase tracking-[0.2em] text-on-secondary-container mb-3">EMAIL ADDRESS</label>
                                    {isEditing ? (
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={userEmail}
                                            className="w-full bg-transparent border-0 border-b border-primary py-3 px-0 focus:ring-0 font-headline text-xl text-primary"
                                            required
                                        />
                                    ) : (
                                        <div className="text-xl font-headline text-primary border-b border-outline-variant/30 pb-4 group-hover:border-primary transition-colors">
                                            {userEmail}
                                        </div>
                                    )}
                                </div>

                                {/* Password (only during editing) */}
                                {isEditing && (
                                    <div className="relative group animate-scale-in">
                                        <label className="block font-label text-[0.7rem] font-bold uppercase tracking-[0.2em] text-on-secondary-container mb-3">UPDATE AUTHORIZATION (PASSWORD)</label>
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            className="w-full bg-transparent border-0 border-b border-primary py-3 px-0 focus:ring-0 font-headline text-xl text-primary placeholder:text-outline-variant/30"
                                            minLength={6}
                                        />
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="pt-8">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full py-5 flex items-center justify-center gap-3"
                                        >
                                            {loading && <Loader2 className="animate-spin" size={16} />}
                                            {loading ? "SYNCING..." : "APPLY CHANGES"}
                                        </button>
                                    </div>
                                )}
                            </form>

                            {!isEditing && (
                                <div className="pt-12 opacity-10 flex justify-center">
                                    <div className="h-[1px] w-12 bg-primary"></div>
                                </div>
                            )}
                        </div>

                        {/* Session Management */}
                        {!isEditing && (
                            <div className="p-10 md:p-14 border-t border-outline-variant/10">
                                <div className="flex flex-col space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <LogOut className="text-secondary" size={20} />
                                        <h2 className="font-label text-[0.75rem] font-bold uppercase tracking-[0.15em] text-secondary">SESSION MANAGEMENT</h2>
                                    </div>
                                    <p className="font-body text-sm text-secondary leading-relaxed max-w-md">
                                        Disconnect your current session from this device. You will need to re-authenticate to access your archive.
                                    </p>
                                    <button
                                        onClick={() => {
                                            if (confirm("Are you sure you want to sign out?")) {
                                                signOut({ callbackUrl: "/" });
                                            }
                                        }}
                                        className="w-full md:w-max px-8 py-4 bg-transparent border border-outline-variant/30 text-secondary font-label text-[0.7rem] font-bold uppercase tracking-[0.15em] rounded-md hover:bg-error hover:border-error hover:text-white transition-all duration-300 group"
                                    >
                                        <span className="flex items-center gap-2 justify-center">
                                            SIGN OUT
                                            <LogOut size={14} className="opacity-70 group-hover:-translate-x-1 group-hover:opacity-100 transition-all" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone */}
                        {!isEditing && (
                            <div className="bg-error-container/10 p-10 md:p-14 border-t border-error/5">
                                <div className="flex flex-col space-y-6">

                                    <div className="flex items-center space-x-3">
                                        <ShieldAlert className="text-error" size={20} />
                                        <h2 className="font-label text-[0.75rem] font-bold uppercase tracking-[0.15em] text-error">DANGER ZONE</h2>
                                    </div>
                                    <p className="font-body text-sm text-secondary leading-relaxed max-w-md">
                                        Permanent erasure of your identity and purchase history. This process is irreversible and all digital assets will be lost.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full md:w-max px-8 py-4 bg-transparent border border-error/30 text-error font-label text-[0.7rem] font-bold uppercase tracking-[0.15em] rounded-md hover:bg-error hover:text-white transition-all duration-300"
                                    >
                                        DELETE ACCOUNT PERMANENTLY
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-10 md:p-14 animate-fade-in text-center">
                        <button
                            onClick={() => setShowVerify(false)}
                            className="flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-12"
                        >
                            <ArrowRight size={14} className="rotate-180" /> Back
                        </button>

                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-on-primary rounded-full mb-8 shadow-ambient">
                            <Mail size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-headline text-primary mb-3">Verify email update</h2>
                        <p className="text-secondary text-sm mb-12 leading-relaxed max-w-xs mx-auto italic font-body">
                            Confirm ownership of <span className="font-bold underline underline-offset-4">{tempEmail}</span> by entering the code provided via dispatch.
                        </p>

                        <form onSubmit={handleVerifyEmail} className="space-y-12">
                            <div className="flex justify-center gap-4">
                                {verifyCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { (verifyRefs.current[index] = el) }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleVerifyCodeChange(index, e.target.value)}
                                        className="w-12 h-16 text-center text-3xl font-headline border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-all bg-transparent text-primary"
                                        required
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={verifying}
                                className="btn-primary w-full py-5"
                            >
                                {verifying ? <Loader2 className="animate-spin inline mr-2" size={16} /> : "VERIFY & UPDATE"}
                            </button>
                        </form>

                        <div className="mt-16 pt-12 border-t border-outline-variant/10">
                            <p className="font-label text-xs text-outline uppercase tracking-widest mb-6">Unreceived transmission?</p>
                            <button
                                onClick={handleResendCode}
                                disabled={resending}
                                className="font-label text-xs font-bold uppercase tracking-widest text-primary hover:opacity-60 transition-opacity inline-flex items-center gap-3"
                            >
                                {resending && <RefreshCw size={12} className="animate-spin" />}
                                Resend verification code
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Secondary Info (Editorial Space) */}
            <div className="mt-20 text-center max-w-sm animate-fade-in stagger-2">
                <p className="font-body text-base italic text-secondary leading-relaxed">
                    "A library is not a luxury but one of the necessities of life."
                </p>
                <div className="h-[1px] w-8 bg-primary/20 mx-auto my-4"></div>
                <p className="font-label text-[0.65rem] uppercase tracking-widest text-on-secondary-container">Henry Ward Beecher</p>
            </div>
        </main>
    );
}

