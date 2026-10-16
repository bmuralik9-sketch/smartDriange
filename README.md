# 🌊 Smart Drainage Management System
> **IoT + AI-Assisted Urban Stormwater Drainage Monitoring & Emergency Response Platform**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-19.2-blue.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/vite-8.3-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4.3-38B2AC.svg)](https://tailwindcss.com)
[![Socket.IO](https://img.shields.io/badge/socket.io-4.7-010101.svg)](https://socket.io)
[![Hardware](https://img.shields.io/badge/IoT-ESP32-E7352C.svg)](https://espressif.com)

---

## 📌 Project Overview

**Smart Drainage Management System** is an enterprise-grade municipal platform designed for city civic authorities, public works departments, and sanitation boards. It monitors urban drainage canals, roadside culverts, water levels, rainfall, and hydrodynamic flow rates using **ESP32-based IoT sensors** and automated rule-based blockage detection algorithms.

### 🌟 Core Capabilities

1. **Stoppage & Slowdown Detection**: Detects when stormwater flow in a canal decelerates or stops entirely.
2. **Rule-Based Blockage Identification**:
   - $\text{Water Level} > 75\% \land \text{Flow Rate} < \text{Threshold} \implies \text{Possible Blockage}$
   - $\text{Water Level} > 90\% \land \text{Flow Rate} \approx 0 \implies \text{CRITICAL EMERGENCY}$
3. **Continuous Hydrodynamic Telemetry**: Real-time water depth (%) and discharge ($L/\text{min}$) graphs.
4. **Rainfall & Watershed Analysis**: 1h, 6h, 24h precipitation tracking with Doppler weather station metrics.
5. **Road Waterlogging & Traffic Tracker**: Correlates choked drains with road water depth ($cm$) and vehicular congestion.
6. **Automated Worker Mobilization**: Auto-dispatches the nearest municipal sanitation crew with GPS coordinates and task assignments.
7. **Interactive GIS Leaflet Map**: High-performance dark-matter GIS map with live canal polylines, water-flow directions, and color-coded status pins.
8. **Live WebSocket Broadcasts**: Socket.IO guarantees sub-second emergency alarms and live dashboard KPI updates.
9. **Built-in Hardware Simulator**: Interactive simulation controls to inject blockage spikes, random sensor perturbations, and test HTTP packet ingestion without requiring physical hardware.

---

## 🏗️ System Architecture & Workflow

```text
       ATMOSPHERIC PRECIPITATION (Rain Radar)
                         │
                         ▼
        ROADWAY SURFACE WATER PONDING (Road Flooding)
                         │
                         ▼
          MUNICIPAL CANALS & BOX CULVERTS (Drains)
                         │
                         ▼
         ESP32 IoT EDGE SENSORS (Ultrasonic + Flow)
                         │
        (HTTP POST JSON every 10s / Wi-Fi)
                         ▼
            NODE.JS / EXPRESS REST API GATEWAY
                         │
                         ▼
          DUAL-ENGINE DATABASE (MongoDB / Mock Store)
                         │
                         ▼
      SMART DETECTION ENGINE & AI RISK SCORER (0-100)
                         │
                         ▼
          SOCKET.IO HIGH-PRIORITY BROADCAST
                         │
                         ▼
           MUNICIPAL COMMAND CONSOLE & ALARM
                         │
                         ▼
         FIELD WORKER DISPATCH & DE-SILTING
                         │
                         ▼
          NORMAL DRAINAGE FLOW RESTORED (Resolved)
```

---

## 💻 Technology Stack

### Frontend
- **Framework**: React.js 19 + Vite
- **Styling**: Tailwind CSS v4 (Glassmorphism, custom status glow animations, dark/light themes)
- **GIS Mapping**: Leaflet & React-Leaflet with custom SVG status pins and flow polylines
- **Data Visualization**: Recharts (multi-line telemetry, area curves, bar charts, donuts)
- **Icons**: Lucide React
- **Real-Time Client**: Socket.IO Client

### Backend
- **Runtime**: Node.js v24+
- **Server Framework**: Express.js
- **WebSocket Engine**: Socket.IO
- **Database Layer**: MongoDB via Mongoose with **Dual-Engine Auto-Fallback** (seamlessly transitions to a resilient in-memory & file-backed store if MongoDB daemon is absent)
- **Detection Engine**: Hydrodynamic cross-correlation rule engine + AI Risk Predictor

### IoT Hardware
- **Edge Microcontroller**: ESP32 DevKit V1
- **Level Sensor**: HC-SR04 Ultrasonic Distance Sensor
- **Flow Sensor**: YF-S201 Hall-Effect Flow Meter (Pulse Interrupt)
- **Rain Sensor**: FC-37 / YL-83 Rain Sensor Module
- **Communication Protocol**: Wi-Fi 802.11 b/g/n & HTTP REST (JSON)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Optional: MongoDB (running locally or MongoDB Atlas URI)

### 1. Clone & Setup Workspace
```bash
# Navigate to workspace
cd "c:\Users\bmura\Desktop\csp project"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_drainage
USE_MOCK_DB=false
JWT_SECRET=super_secret_municipal_key_2026
```
> **Note**: If MongoDB is not installed on your system, the server will automatically log a message and switch to the embedded resilient store without crashing.

### 3. Start the Backend Server
```bash
cd backend
npm start
# Server will run at http://localhost:5000
# Socket.IO active on port 5000
```

### 4. Start the Frontend Application
In a new terminal window:
```bash
cd frontend
npm run dev
# Vite will launch the app at http://localhost:5173
```
Open `http://localhost:5173` in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & uptime |
| `GET` | `/api/drains` | List all 20 monitored drainage canals |
| `GET` | `/api/drains/:id` | Get drain details with 24h telemetry history |
| `GET` | `/api/drains/canals`| Get canal polyline geometry and flow routes |
| `GET` | `/api/sensors` | List connected ESP32 sensor edge nodes |
| `POST` | `/api/sensors/data` | **ESP32 Ingestion Endpoint** (evaluates blockages & alerts) |
| `GET` | `/api/sensors/readings`| Query time-series telemetry |
| `GET` | `/api/alerts` | List municipal alerts (filters: status, type, risk) |
| `PUT` | `/api/alerts/:id` | Update alert status (Acknowledge, Assign, Resolve) |
| `GET` | `/api/workers` | Sanitation worker roster and active task logs |
| `PUT` | `/api/workers/:id` | Update worker status / re-dispatch |
| `GET` | `/api/rainfall` | Precipitation rates and automated weather stations |
| `GET` | `/api/roads/flooding`| Waterlogged roads and traffic congestion levels |
| `GET` | `/api/analytics` | Aggregated KPIs and 8 municipal charts |
| `GET` | `/api/ai/predict` | AI Drain Risk Scores (0-100) and recommendation vectors |
| `POST`| `/api/simulation/trigger` | Trigger simulated blockage spike or random telemetry |
| `POST`| `/api/simulation/reset` | Reset state to baseline demo data |

---

## ⚡ ESP32 Hardware Integration

The complete Arduino sketch is located at `esp32/smart_drainage_sensor.ino`.

### Pin Configuration
| ESP32 Pin | Sensor Component |
|---|---|
| `GPIO 5` | HC-SR04 Trigger |
| `GPIO 18` | HC-SR04 Echo |
| `GPIO 19` | YF-S201 Flow Sensor (Interrupt) |
| `GPIO 34` | Rain Sensor Analog Input |
| `GPIO 2` | Status Indicator LED |

### Sample JSON Telemetry Payload
```json
POST /api/sensors/data
Content-Type: application/json

{
  "sensorId": "ESP32-DRAIN-001",
  "drainId": "DRAIN-001",
  "waterLevel": 92,
  "flowRate": 0.5,
  "rainfall": 45,
  "temperature": 28,
  "battery": 94,
  "signalStrength": -65
}
```

---

## 🧪 Simulation Controls

The platform includes a dedicated **Simulation Control Bar** at the top of the screen:
- **SIMULATE SENSOR UPDATE**: Injects real-time random perturbations across the 20 sensor nodes.
- **🚨 INJECT BLOCKAGE SPIKE**: Instantly surges water level to 94%, drops flow to 0.4 L/min, generates a Critical Alert, triggers an audible emergency popup, and auto-dispatches a sanitation worker.
- **AUTO-SIMULATING (10s)**: Automatically executes continuous background telemetry pulses.
- **RESET**: Restores the municipal dataset to initial baseline conditions.

---

## 🛡️ License
Released under the MIT License. Developed for municipal smart-city flood resilience.
