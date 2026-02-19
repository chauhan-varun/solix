/**
 * ⚡ Solix Smart Meter
 * ESP32 Smart Meter for P2P Energy Trading
 * 
 * Sends mock solar production and home consumption data to the Next.js platform.
 * 
 * Dependencies:
 * - ArduinoJSON
 * - HTTPClient
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- CONFIGURATION ---
const char* ssid = "aivar";
const char* password = "ahwn1234";

// MQTT Broker Address (Oracle Server IP or Local IP)
const char* mqttServer = "141.148.214.59"; // Update this to your MQTT broker IP
const int mqttPort = 1883;

// Meter Unique ID
const char* meterId = "METER_001_HACK";
const char* mqttTopic = "solix/meter/METER_001_HACK/data";

WiFiClient espClient;
PubSubClient client(espClient);

// Interval in milliseconds (5 seconds)
unsigned long interval = 5000;
unsigned long lastTime = 0;

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(meterId)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentTime = millis();
  if (currentTime - lastTime >= interval) {
    lastTime = currentTime;

    // --- MOCK DATA GENERATION ---
    float uptimeSecs = millis() / 1000.0;
    float cyclePos = fmod(uptimeSecs, 120.0); 
    float production = 0;
    if (cyclePos < 60.0) {
      production = 4000.0 * sin((cyclePos / 60.0) * PI);
    } else {
      production = 0;
    }

    float consumption = 800.0 + random(-200, 500);

    // JSON Payload
    StaticJsonDocument<200> doc;
    doc["production"] = production;
    doc["consumption"] = consumption;

    char buffer[256];
    serializeJson(doc, buffer);

    Serial.print("Publishing message: ");
    Serial.println(buffer);
    client.publish(mqttTopic, buffer);
  }
}
