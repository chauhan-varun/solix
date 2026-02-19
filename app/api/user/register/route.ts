import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { walletAddress, name, role, meterId } = await request.json();

        if (!walletAddress || !meterId) {
            return NextResponse.json({ error: 'Wallet address and Meter ID are required' }, { status: 400 });
        }

        const user = await prisma.user.upsert({
            where: { walletAddress },
            update: {
                name: name || 'Anonymous',
                role: role || 'consumer',
                meterId: meterId,
            },
            create: {
                walletAddress,
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
