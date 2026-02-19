import { NextResponse } from "next/server";
import { publicClient } from "@/lib/blockchain-client";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface GridStatus {
    producer: string;
    totalSupply: bigint;
    pricePerUnit: bigint;
    lastUpdated: bigint;
}

export async function GET() {
    try {
        if (!CONTRACT_ADDRESS) {
            return NextResponse.json({ error: "Contract address not configured" }, { status: 500 });
        }

        const gridStatus = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: EnergyTradingABI.abi,
            functionName: "getGridStatus",
        }) as GridStatus;

        return NextResponse.json({
            producer: gridStatus.producer,
            totalSupply: gridStatus.totalSupply.toString(),
            pricePerUnit: gridStatus.pricePerUnit.toString(),
            lastUpdated: gridStatus.lastUpdated.toString(),
        });
    } catch (error) {
        console.error("Grid API error:", error);
        return NextResponse.json({ error: "Failed to fetch grid status" }, { status: 500 });
    }
}
