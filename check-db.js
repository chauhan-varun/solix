const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();

    console.log('--- Database Check ---');
    const userCount = await prisma.user.count();
    console.log('Users in DB:', userCount);

    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`- User: ${u.walletAddress}, MeterID: ${u.meterId}`));

    const readingCount = await prisma.meterReading.count();
    console.log('Total Meter Readings:', readingCount);

    const recentReadings = await prisma.meterReading.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' }
    });
    console.log('Recent 5 Readings:');
    recentReadings.forEach(r => console.log(`- Meter: ${r.meterId}, Prod: ${r.production}, Cons: ${r.consumption}, Time: ${r.timestamp}`));

    await prisma.$disconnect();
}

main().catch(console.error);
