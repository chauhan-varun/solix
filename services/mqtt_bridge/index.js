import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';

const mqttUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const prisma = new PrismaClient();

async function run() {
    console.log('Starting MQTT Bridge...');

    const mqttClient = mqtt.connect(mqttUrl);

    mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        mqttClient.subscribe('solix/meter/+/data', (err) => {
            if (!err) {
                console.log('Subscribed to meter data topics');
            }
        });
    });

    mqttClient.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            const meterId = topic.split('/')[2];

            // In our system, we need a walletAddress to link the reading to a user.
            // For now, we assume the meterId is unique and linked to a user.
            // We find the user first or use a default if not found.
            const user = await prisma.user.findFirst({
                where: { meterId: meterId }
            });

            if (!user) {
                console.warn(`No user found for meterId: ${meterId}. Reading ignored.`);
                return;
            }

            const reading = await prisma.meterReading.create({
                data: {
                    meterId,
                    walletAddress: user.walletAddress,
                    production: payload.production || 0,
                    consumption: payload.consumption || 0,
                    surplus: Math.max(0, (payload.production || 0) - (payload.consumption || 0)),
                    timestamp: new Date()
                }
            });

            console.log(`Saved reading for ${meterId} (User: ${user.walletAddress})`);
        } catch (e) {
            console.error('Error processing message:', e.message);
        }
    });
}

run().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
