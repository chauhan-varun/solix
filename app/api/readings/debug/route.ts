import { NextResponse } from 'next/server';
import { getAddress } from 'viem';
import { prisma } from '@/lib/prisma';

/**
 * Debug endpoint to diagnose why production vs consumption graph shows no data.
 * GET /api/readings/debug?address=0x...
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
        let normalizedAddress: string;
        try {
            normalizedAddress = getAddress(address);
        } catch {
            normalizedAddress = address.toLowerCase();
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { walletAddress: normalizedAddress },
                    { walletAddress: address.toLowerCase() },
                ],
            },
        });

        const readingsCount = await prisma.meterReading.count({
            where: {
                OR: [
                    { walletAddress: normalizedAddress },
                    { walletAddress: address.toLowerCase() },
                ],
            },
        });

        const recentReadings = await prisma.meterReading.findMany({
            where: {
                OR: [
                    { walletAddress: normalizedAddress },
                    { walletAddress: address.toLowerCase() },
                ],
            },
            orderBy: { timestamp: 'desc' },
            take: 5,
        });

        const allMeterIds = await prisma.user.findMany({
            where: { meterId: { not: null } },
            select: { meterId: true, walletAddress: true },
        });

        return NextResponse.json({
            query: { address, normalizedAddress },
            user: user
                ? {
                      walletAddress: user.walletAddress,
                      meterId: user.meterId,
                      role: user.role,
                  }
                : null,
            readingsCount,
            recentReadings: recentReadings.map((r) => ({
                timestamp: r.timestamp,
                production: r.production,
                consumption: r.consumption,
            })),
            linkedMeters: allMeterIds,
            hints: {
                noUser: !user && 'No user found. Link your meter first via the dashboard.',
                noMeterId: user && !user.meterId && 'User exists but no meter linked. Link your ESP32 meter ID.',
                noReadings:
                    user && readingsCount === 0
                        ? 'User + meter linked but no readings. Ensure MQTT bridge is running and ESP32 is publishing to solix/meter/<METER_ID>/data.'
                        : undefined,
            },
        });
    } catch (error) {
        console.error('Readings debug error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
