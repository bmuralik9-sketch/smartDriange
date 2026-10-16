/*
 * ============================================================================
 * SMART DRAINAGE MANAGEMENT SYSTEM - ESP32 IoT EDGE NODE
 * ============================================================================
 * 
 * Hardware Description:
 *  - Microcontroller: ESP32 NodeMCU / DevKit V1
 *  - Water Level Sensor: HC-SR04 Ultrasonic Sensor (or Submersible Hydrostatic)
 *  - Water Flow Sensor: YF-S201 Hall-Effect Flow Sensor (Pulse Interrupt)
 *  - Rain Sensor: FC-37 / YL-83 Resistive Rain Detection Module
 *  - Telemetry: Wi-Fi 802.11 b/g/n -> REST API (HTTP POST JSON)
 * 
 * Purpose:
 *  Continuous real-time telemetry of municipal drainage canals.
 *  Detects water stoppage, slow flow, blockages, and surges during storms.
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // ArduinoJson v6 or v7

// ======================== CONFIGURATION ========================
// Wi-Fi Credentials
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Central Municipal Backend Server Endpoint
// Change to your server IP or domain name:
const char* SERVER_URL    = "http://192.168.1.100:5000/api/sensors/data";

// Node Identity Configuration
const char* SENSOR_ID     = "ESP32-DRAIN-001";
const char* DRAIN_ID      = "DRAIN-001";
const float DRAIN_DEPTH_CM = 200.0; // Total depth of the drain canal (cm)

// Telemetry Interval (Milliseconds)
const unsigned long TRANSMIT_INTERVAL = 10000; // Send telemetry every 10 seconds

// ======================== PIN ASSIGNMENTS ========================
// Ultrasonic HC-SR04 Pins
const int PIN_TRIG = 5;
const int PIN_ECHO = 18;

// Flow Sensor YF-S201 (Interrupt Pin)
const int PIN_FLOW = 19;

// Rain Sensor Analog/Digital Pin
const int PIN_RAIN_ANALOG = 34;

// Status Indicator LED
const int PIN_LED_STATUS = 2;

// ======================== GLOBAL VARIABLES ========================
volatile unsigned long flowPulseCount = 0;
unsigned long lastTransmitTime = 0;
unsigned long lastPulseTime = 0;

// Interrupt Service Routine for Flow Sensor
void IRAM_ATTR pulseCounterISR() {
  flowPulseCount++;
}

// ======================== SETUP ========================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=======================================================");
  Serial.println("  SMART DRAINAGE IOT NODE INITIALIZING (ESP32)");
  Serial.println("=======================================================");

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_FLOW, INPUT_PULLUP);
  pinMode(PIN_RAIN_ANALOG, INPUT);
  pinMode(PIN_LED_STATUS, OUTPUT);

  // Attach interrupt for water flow rate meter
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW), pulseCounterISR, RISING);

  // Connect to Local Municipal / Cellular Gateway Wi-Fi
  connectWiFi();
}

// ======================== MAIN LOOP ========================
void loop() {
  // Check Wi-Fi Liveness
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ Wi-Fi lost! Attempting reconnect...");
    connectWiFi();
  }

  // Transmit Telemetry at Scheduled Cadence
  unsigned long currentMillis = millis();
  if (currentMillis - lastTransmitTime >= TRANSMIT_INTERVAL) {
    lastTransmitTime = currentMillis;

    // 1. Read Ultrasonic Distance & Calculate Water Level %
    float distanceCm = measureDistanceCm();
    // Invert distance: when distance is small, water level is near the top (100%)
    float waterDepth = constrain(DRAIN_DEPTH_CM - distanceCm, 0.0, DRAIN_DEPTH_CM);
    float waterLevelPercent = (waterDepth / DRAIN_DEPTH_CM) * 100.0;

    // 2. Calculate Flow Rate (Liters/Minute)
    // Calibration factor for YF-S201: pulses / 7.5 = Q (L/min)
    noInterrupts();
    unsigned long pulses = flowPulseCount;
    flowPulseCount = 0;
    interrupts();

    float flowRateLMin = ((float)pulses / 7.5) * (60000.0 / TRANSMIT_INTERVAL);
    if (flowRateLMin < 0.1) flowRateLMin = 0.0;

    // 3. Read Rain Sensor
    int rawRain = analogRead(PIN_RAIN_ANALOG);
    // Convert 0-4095 reading to simulated mm precipitation scale (0 - 80 mm)
    float rainfallMm = map(constrain(rawRain, 0, 4095), 4095, 0, 0, 80);

    // 4. Read Signal Strength (RSSI) and Battery
    int rssi = WiFi.RSSI();
    int batteryPercent = 94; // If using battery ADC divider: read from battery pin

    // 5. Send Telemetry to Municipal API
    sendSensorTelemetry(waterLevelPercent, flowRateLMin, rainfallMm, rssi, batteryPercent);
  }

  delay(100);
}

// ======================== HELPER FUNCTIONS ========================

// Ultrasonic measurement with timeout protection
float measureDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout (~5 meters max)
  if (duration == 0) {
    return DRAIN_DEPTH_CM; // Default to empty if no echo received
  }
  return (duration * 0.0343) / 2.0;
}

// Wi-Fi Connection Routine
void connectWiFi() {
  Serial.print("Connecting to Wi-Fi SSID: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    digitalWrite(PIN_LED_STATUS, !digitalRead(PIN_LED_STATUS));
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(PIN_LED_STATUS, HIGH);
    Serial.println("\n✅ Wi-Fi Connected!");
    Serial.print("📡 ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    digitalWrite(PIN_LED_STATUS, LOW);
    Serial.println("\n❌ Wi-Fi Connection Timeout! Will retry in background loop.");
  }
}

// HTTP POST Telemetry Serialization & Dispatch
void sendSensorTelemetry(float waterLevel, float flowRate, float rainfall, int rssi, int battery) {
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  // Construct JSON Payload
  StaticJsonDocument<256> doc;
  doc["sensorId"]       = SENSOR_ID;
  doc["drainId"]        = DRAIN_ID;
  doc["waterLevel"]     = round(waterLevel);
  doc["flowRate"]       = round(flowRate * 10) / 10.0;
  doc["rainfall"]       = round(rainfall);
  doc["temperature"]    = 28.0;
  doc["signalStrength"] = rssi;
  doc["battery"]        = battery;

  String requestBody;
  serializeJson(doc, requestBody);

  Serial.println("\n-------------------------------------------");
  Serial.print("📤 Transmitting to: ");
  Serial.println(SERVER_URL);
  Serial.println("Payload: " + requestBody);

  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("📥 HTTP Response %d: %s\n", httpResponseCode, response.c_str());
  } else {
    Serial.printf("❌ Error on HTTP POST: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}
