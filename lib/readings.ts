import { getAddress } from 'viem';
import { prisma } from '@/lib/prisma';

export interface ReadingData {
    time: string;
    production: number;
    consumption: number;
}

/** Normalize Ethereum address for consistent DB queries (handles checksum/case) */
function normalizeAddress(addr: string): string {
    try {
        return getAddress(addr);
    } catch {
        return addr.toLowerCase();
    }
}

/**
 * Fetches the last N readings for a specific user to populate the dashboard chart.
 */
export async function getRecentReadings(walletAddress: string, limit: number = 20): Promise<ReadingData[]> {
    try {
        const normalized = normalizeAddress(walletAddress);
        const lower = walletAddress.toLowerCase();
        // Query with OR to handle DB entries stored in different case (checksum vs lowercase)
        const readings = await prisma.meterReading.findMany({
            where: {
                OR: [
                    { walletAddress: normalized },
                    ...(normalized !== lower ? [{ walletAddress: lower }] : []),
                ],
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });

        // Map and reverse so they are in chronological order for the chart
        return readings.reverse().map(r => ({
            time: r.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            production: r.production,
            consumption: r.consumption
        }));
    } catch (error) {
        console.error("Readings fetch failed:", error instanceof Error ? error.message : "Unknown");
        return [];
    }
}

/**
 * Gets live stats for the dashboard cards
 */
export async function getLiveStats(walletAddress: string) {
    try {
        const normalized = normalizeAddress(walletAddress);
        const lower = walletAddress.toLowerCase();
        const latestReading = await prisma.meterReading.findFirst({
            where: {
                OR: [
                    { walletAddress: normalized },
                    ...(normalized !== lower ? [{ walletAddress: lower }] : []),
                ],
            },
            orderBy: { timestamp: 'desc' },
        });

        if (!latestReading) return null;

        return {
            production: latestReading.production,
            consumption: latestReading.consumption,
            surplus: latestReading.surplus
        };
    } catch (error) {
        console.error("Live stats fetch failed:", error instanceof Error ? error.message : "Unknown");
        return null;
    }
}