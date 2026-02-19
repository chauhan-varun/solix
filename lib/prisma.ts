import { PrismaClient } from "../generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.warn("[Prisma] DATABASE_URL is not set. Database operations will fail.");
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: { url: DATABASE_URL ?? "mongodb://localhost:27017/solix" },
        },
        log: process.env.DEBUG_PRISMA ? ["query"] : [],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
