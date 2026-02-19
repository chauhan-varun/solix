import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const { walletAddress } = await req.json();

        if (!walletAddress) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            );
        }

        const nonce = uuidv4();

        // Upsert user with the new nonce
        await prisma.user.upsert({
            where: { walletAddress },
            update: { nonce },
            create: {
                walletAddress,
                name: "Anonymous",
                role: "Consumer", // Default role
                nonce,
            },
        });

        return NextResponse.json({ nonce });
    } catch (error) {
        console.error("Nonce error:", error);
        return NextResponse.json(
            { error: "Failed to generate nonce" },
            { status: 500 }
        );
    }
}
