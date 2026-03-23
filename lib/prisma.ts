import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Brute-force fix for Node's SSL chain issues in Vercel/Supabase environments
if (process.env.NODE_ENV === "production") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
    let connectionString =
        process.env.POSTGRES_URL_NON_POOLING ||
        process.env.POSTGRES_PRISMA_URL;

    if (!connectionString) {
        throw new Error("Database connection string is missing.");
    }

    // Clean connection string and force sslmode=no-verify for double protection
    if (connectionString.includes("sslmode=")) {
        connectionString = connectionString.replace(/sslmode=[^&]*/, "sslmode=no-verify");
    } else {
        const separator = connectionString.includes("?") ? "&" : "?";
        connectionString += `${separator}sslmode=no-verify`;
    }

    // Initialize the PG pool with loose SSL checking to bypass the self-signed cert error
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const adapter = new PrismaPg(pool as any);

    return new PrismaClient({
        adapter: adapter as any, // Explicitly tell Prisma to use the 'pg' driver
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
