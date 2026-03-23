import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";
import { cleanupExpiredTokens } from "@/lib/tokens";

const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
});

export async function PUT(request: Request) {
    // Clean up expired tokens in background
    cleanupExpiredTokens();

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, email, password } = updateProfileSchema.parse(body);
        const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });

        let emailVerificationPending = false;
        if (email && email !== currentUser?.email) {
            // Check if email taken
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }

            // Start verification
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            await prisma.verificationToken.upsert({
                where: { email },
                update: {
                    code,
                    userId: session.user.id,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                },
                create: {
                    email,
                    code,
                    userId: session.user.id,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                }
            });

            await sendVerificationEmail(email, code);
            emailVerificationPending = true;
        }

        const data: any = {};
        if (name) data.name = name;
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json({ ...userWithoutPassword, emailVerificationPending });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
