import { prisma } from '@/lib/prisma';
import prismaConfig from '@/prisma.config';

export interface ReadingData {
    time: string;
    production: number;
    consumption: number;
}

/**
 * Fetches the last N readings for a specific user to populate the dashboard chart.
 */
export async function getRecentReadings(walletAddress: string, limit: number = 20): Promise<ReadingData[]> {
    try {
        const readings = await prisma.meterReading.findMany({
            where: { walletAddress },
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
        console.error("Error fetching readings:", error);
        return [];
    }
}

/**
 * Gets live stats for the dashboard cards
 */
export async function getLiveStats(walletAddress: string) {
    try {
        const latestReading = await prisma.meterReading.findFirst({
            where: { walletAddress },
            orderBy: { timestamp: 'desc' },
        });

        if (!latestReading) return null;

        return {
            production: latestReading.production,
            consumption: latestReading.consumption,
            surplus: latestReading.surplus
        };
    } catch (error) {
        console.error("Error fetching live stats:", error);
        return null;
    }
}