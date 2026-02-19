import { NextResponse } from 'next/server';
import { getRecentReadings, getLiveStats } from '@/lib/readings';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
        const history = await getRecentReadings(address);
        const live = await getLiveStats(address);

        return NextResponse.json({ history, live });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
