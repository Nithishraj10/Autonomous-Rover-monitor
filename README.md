# Autonomous Pothole Mapping & Automated Filling System

An IoT robotics monitoring dashboard for autonomous patrol rovers designed to detect potholes, measure cavity depth via ultrasonic sensing, automatically fill minor potholes with sand, and map major hazards to a cloud control room for manual inspection.

![IoT Dashboard](https://img.shields.io/badge/System-Autonomous%20Pothole%20Rover-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet)

---

## 🤖 System Architecture & Hardware Stack

- **Raspberry Pi 4 (4GB)**: Central computing hub & onboard detection logger.
- **Pi Camera Module 3 (Sony IMX708)**: High-resolution image capture with hybrid **MobileNetV2 + EfficientNet-B0** feature extraction.
- **HC-SR04 Ultrasonic Sensor**: Precise millimeter depth profiling.
- **MG996R Servo Motor**: Automated sand dispenser mechanism for minor pothole leveling.
- **GPS NEO Module**: Sub-meter latitude and longitude geolocation tagging.
- **L298N Dual H-Bridge Motor Driver**: Autonomous chassis locomotion & differential steering.

---

## ⚡ Decision Logic

```
ROVER PATROLS
      ↓
CAMERA DETECTS POTHOLE
      ↓
ULTRASONIC SENSOR MEASURES DEPTH
      ↓
SEVERITY CLASSIFICATION
      ↓
      ┌───────────────┐
      │               │
   MINOR            MAJOR
(Depth < 5cm)    (Depth ≥ 5cm)
      │               │
      ↓               ↓
AUTO FILL       GPS COORDINATE
(MG996R Servo)  (NEO-6M Module)
      │               │
      ↓               ↓
   FILLED       MANUAL INSPECTION
      │               │
      └───────┬───────┘
              ↓
      IoT WEB DASHBOARD
              ↓
  MAP + ALERTS + TELEMETRY LOG
```

---

## 🌟 Dashboard Features

- **Live Overview KPI Cards**: Real-time counters for total detections, minor (<5cm), major (≥5cm), filled, and pending inspection.
- **Interactive Campus Map**: Leaflet map centered on campus coordinates (`8.1832° N, 77.4119° E`) with custom markers and live rover position tracking.
- **Real-Time Live Feed**: Animated stream of newly detected potholes and dispenser telemetry.
- **Hardware Simulation Test Bench**: One-click simulation for minor auto-fill, major alerts, WiFi drop/restore, and offline queue synchronization.
- **Manual Inspection Triage Queue**: Dedicated queue for major potholes with inspection notes and repair confirmations.
- **Deep Detail Modal**: Ultrasonic depth bar gauges, AI confidence metrics, GPS fix, and timestamped detection timelines.
- **Rover Hardware Diagnostics**: Live monitoring of Raspberry Pi 4 CPU/RAM/temperature, battery voltage, and sensor states.
- **Analytics View**: Visual charts showing daily detection frequency, depth distribution histograms, and repair resolution metrics.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/akhilneeraj33/Autonomous-pothole-mapping.git
cd Autonomous-pothole-mapping

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 📡 Backend / Hardware Integration

The frontend uses service abstraction layer (`/src/services/`):
- `potholeService.ts`
- `roverService.ts`
- `mockRoverService.ts`

Set your Raspberry Pi server endpoint in `.env`:
```env
VITE_API_BASE_URL=http://<RASPBERRY_PI_IP>:8000
```
