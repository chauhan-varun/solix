import { NextResponse } from 'next/server';
import { getAddress } from 'viem';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeAddress(addr: string): string {
    try {
        return getAddress(addr);
    } catch {
        return addr.toLowerCase();
    }
}

export async function POST(request: Request) {
    try {
        const { walletAddress, name, role, meterId } = await request.json();

        if (!walletAddress || !meterId) {
            return NextResponse.json({ error: 'Wallet address and Meter ID are required' }, { status: 400 });
        }

        const normalizedAddress = normalizeAddress(walletAddress);
        const lowerAddress = walletAddress.toLowerCase();

        // Find existing user (may be stored with different casing)
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { walletAddress: normalizedAddress },
                    { walletAddress: lowerAddress },
                ],
            },
        });

        const user = existing
            ? await prisma.user.update({
                  where: { id: existing.id },
                  data: {
                      walletAddress: normalizedAddress, // migrate to normalized
                      name: name || existing.name,
                      role: role || existing.role,
                      meterId: meterId,
                  },
              })
            : await prisma.user.create({
                  data: {
                      walletAddress: normalizedAddress,
                      name: name || 'Anonymous',
                      role: role || 'consumer',
                      meterId: meterId,
                  },
              });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
