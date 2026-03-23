import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});

import { sendVerificationEmail } from "@/lib/email";
import { cleanupExpiredTokens } from "@/lib/tokens";


export async function POST(request: Request) {
    try {
        // Clean up expired tokens in background
        cleanupExpiredTokens();

        const body = await request.json();
        const { email, password, name } = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);


        await prisma.verificationToken.upsert({
            where: { email },
            update: {
                code,
                name,
                password: hashedPassword,
                expiresAt,
            },
            create: {
                email,
                code,
                name,
                password: hashedPassword,
                expiresAt,
            }
        });

        const { success, error: emailError } = await sendVerificationEmail(email, code);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to send verification email. Please check your configuration." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Verification code sent to your email." });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Registration initiating error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
