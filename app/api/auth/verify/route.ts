import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMessage } from "viem";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "energy-trading-jwt-secret-change-in-production"
);

export async function POST(req: NextRequest) {
    try {
        const { walletAddress, signature } = await req.json();

        if (!walletAddress || !signature) {
            return NextResponse.json(
                { error: "Address and signature are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { walletAddress },
        });

        if (!user || !user.nonce) {
            return NextResponse.json(
                { error: "Nonce not found for this address" },
                { status: 404 }
            );
        }

        const message = `Sign this message to login to P2P Energy Grid: ${user.nonce}`;

        const isValid = await verifyMessage({
            address: walletAddress as `0x${string}`,
            message,
            signature,
        });

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        // Clear nonce after successful verification
        await prisma.user.update({
            where: { walletAddress },
            data: { nonce: null },
        });

        // Create JWT
        const token = await new SignJWT({
            sub: walletAddress,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        const response = NextResponse.json({ success: true, user });

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json(
            { error: "Verification failed" },
            { status: 500 }
        );
    }
}
