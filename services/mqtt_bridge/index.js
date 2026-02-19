import mqtt from 'mqtt';
import { MongoClient } from 'mongodb';

const mqttUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/solix';

async function run() {
    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection('readings');

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

            const reading = {
                meterId,
                ...payload,
                timestamp: new Date()
            };

            await collection.insertOne(reading);
            console.log(`Saved reading for ${meterId}`);
        } catch (e) {
            console.error('Error processing message:', e.message);
        }
    });
}

run().catch(console.error);
