import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get("x-api-key");
        const { meterId, production, consumption } = await req.json();

        if (apiKey !== process.env.METER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!meterId || production === undefined || consumption === undefined) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const prodNum = parseFloat(production);
        const consNum = parseFloat(consumption);
        const surplus = Math.max(0, prodNum - consNum);

        // Find user by meterId
        const user = await prisma.user.findFirst({
            where: { meterId },
        });

        if (!user) {
            return NextResponse.json({ error: "Meter not linked to any user" }, { status: 404 });
        }

        const reading = await prisma.meterReading.create({
            data: {
                meterId,
                walletAddress: user.walletAddress,
                production: prodNum,
                consumption: consNum,
                surplus: surplus,
            },
        });

        return NextResponse.json({ success: true, reading });
    } catch (error) {
        console.error("Meter API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET latest reading for a user
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const walletAddress = searchParams.get("walletAddress");

        if (!walletAddress) {
            return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
        }

        const reading = await prisma.meterReading.findFirst({
            where: { walletAddress },
            orderBy: { timestamp: "desc" },
        });

        return NextResponse.json(reading || null);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reading" }, { status: 500 });
    }
}
