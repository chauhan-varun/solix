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
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- CONFIGURATION ---
const char* ssid = "varun";
const char* password = "ahwn1234";

// Your laptop's local IP address (e.g., 192.168.1.105)
const char* serverUrl = "http://103.94.67.27/api/meter";

// Meter Unique ID and API Key (from .env)
const char* meterId = "METER_001_HACK";
const char* apiKey = "esp32-meter-key-2024";

// Interval in milliseconds (5 seconds)
unsigned long interval = 5000;
unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastTime >= interval) {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      // Start the HTTP request
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("x-api-key", apiKey);

      // --- MOCK DATA GENERATION ---
      // We simulate a day cycle based on uptime (uptime in seconds)
      float uptimeSecs = millis() / 1000.0;
      
      // Solar Production (Bell curve peak, simulate a shorter cycle for demo)
      // Peaks every 2 minutes for demo purposes instead of 24h
      float cyclePos = fmod(uptimeSecs, 120.0); 
      float production = 0;
      if (cyclePos < 60.0) {
        // Sine wave peak at 30s
        production = 4000.0 * sin((cyclePos / 60.0) * PI);
      } else {
        production = 0; // Night
      }

      // Home Consumption (Random fluctuations)
      float consumption = 800.0 + random(-200, 500);

      // JSON Payload
      StaticJsonDocument<200> doc;
      doc["meterId"] = meterId;
      doc["production"] = production;
      doc["consumption"] = consumption;

      String requestBody;
      serializeJson(doc, requestBody);

      // Send the POST request
      int httpResponseCode = http.POST(requestBody);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        Serial.println("Response: " + response);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      // Free resources
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = currentTime;
  }
}
