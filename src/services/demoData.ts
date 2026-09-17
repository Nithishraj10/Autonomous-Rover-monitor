import { Pothole } from '../types/pothole';
import { RoverTelemetry } from '../types/rover';

export const CAMPUS_CENTER = {
  lat: 8.1832,
  lng: 77.4119
};

export const INITIAL_POTHOLES: Pothole[] = [
  {
    id: 'PTH-024',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T10:42:00.000Z',
    latitude: 8.1832,
    longitude: 77.4119,
    depth: 7.4,
    severity: 'major',
    confidence: 0.94,
    status: 'MANUAL_INSPECTION_REQUIRED',
    repairMethod: 'MANUAL_INSPECTION',
    isSynced: true,
    timeline: [
      { timestamp: '2026-09-16T10:42:01.000Z', title: 'Pothole detected', description: 'Pi Camera 3 + MobileNetV2 matched depression pattern', type: 'detect' },
      { timestamp: '2026-09-16T10:42:02.000Z', title: 'Depth measured: 7.4 cm', description: 'HC-SR04 ultrasonic echo pulse width 430µs', type: 'measure' },
      { timestamp: '2026-09-16T10:42:03.000Z', title: 'Classified as Major', description: 'Depth ≥ 5.0cm. Flagged for road maintenance crew', type: 'classify' },
      { timestamp: '2026-09-16T10:42:05.000Z', title: 'GPS coordinates recorded', description: '8.1832° N, 77.4119° E (HDOP 0.8)', type: 'gps' },
      { timestamp: '2026-09-16T10:42:08.000Z', title: 'Dashboard updated', description: 'Transmitted over campus WiFi gateway', type: 'sync' }
    ]
  },
  {
    id: 'PTH-023',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T10:38:00.000Z',
    latitude: 8.1829,
    longitude: 77.4114,
    depth: 3.2,
    severity: 'minor',
    confidence: 0.96,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true,
    timeline: [
      { timestamp: '2026-09-16T10:38:01.000Z', title: 'Pothole detected', description: 'Surface fissure detected on West Walkway', type: 'detect' },
      { timestamp: '2026-09-16T10:38:02.000Z', title: 'Depth measured: 3.2 cm', description: 'HC-SR04 verified Minor depth (<5cm)', type: 'measure' },
      { timestamp: '2026-09-16T10:38:03.000Z', title: 'Classified as Minor', description: 'Authorized automated sand dispenser trigger', type: 'classify' },
      { timestamp: '2026-09-16T10:38:06.000Z', title: 'Automated Sand Dispensed', description: 'MG996R servo released 180g fine aggregate filler', type: 'fill' },
      { timestamp: '2026-09-16T10:38:08.000Z', title: 'Dashboard updated', description: 'Status marked FILLED', type: 'sync' }
    ]
  },
  {
    id: 'PTH-022',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T10:25:00.000Z',
    latitude: 8.1841,
    longitude: 77.4128,
    depth: 8.6,
    severity: 'major',
    confidence: 0.92,
    status: 'MANUAL_INSPECTION_REQUIRED',
    repairMethod: 'MANUAL_INSPECTION',
    isSynced: true,
    timeline: [
      { timestamp: '2026-09-16T10:25:01.000Z', title: 'Pothole detected', description: 'Large structural pothole near Engineering Block', type: 'detect' },
      { timestamp: '2026-09-16T10:25:02.000Z', title: 'Depth measured: 8.6 cm', description: 'Ultrasonic depth measurement confirms deep cavity', type: 'measure' },
      { timestamp: '2026-09-16T10:25:03.000Z', title: 'Classified as Major', description: 'Manual asphalt patch required', type: 'classify' }
    ]
  },
  {
    id: 'PTH-021',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T10:14:00.000Z',
    latitude: 8.1818,
    longitude: 77.4108,
    depth: 2.7,
    severity: 'minor',
    confidence: 0.89,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-020',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T09:55:00.000Z',
    latitude: 8.1848,
    longitude: 77.4135,
    depth: 6.2,
    severity: 'major',
    confidence: 0.95,
    status: 'MANUAL_INSPECTION_REQUIRED',
    repairMethod: 'MANUAL_INSPECTION',
    isSynced: true
  },
  {
    id: 'PTH-019',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T09:40:00.000Z',
    latitude: 8.1823,
    longitude: 77.4121,
    depth: 4.1,
    severity: 'minor',
    confidence: 0.93,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-018',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T09:18:00.000Z',
    latitude: 8.1837,
    longitude: 77.4111,
    depth: 5.9,
    severity: 'major',
    confidence: 0.91,
    status: 'INSPECTED',
    repairMethod: 'MANUAL_INSPECTION',
    inspectionNotes: 'Inspected by Campus Facility Team. Scheduled for hot-mix bitumen repair on Friday.',
    inspectedAt: '2026-09-16T10:00:00.000Z',
    inspectorName: 'Eng. R. Sharma',
    isSynced: true
  },
  {
    id: 'PTH-017',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T08:50:00.000Z',
    latitude: 8.1812,
    longitude: 77.4126,
    depth: 9.1,
    severity: 'major',
    confidence: 0.97,
    status: 'REPAIRED',
    repairMethod: 'MANUAL_ASPHALT_PATCH',
    inspectionNotes: 'Cold patch applied and compacted with plate compactor.',
    inspectedAt: '2026-09-16T09:00:00.000Z',
    repairedAt: '2026-09-16T09:30:00.000Z',
    inspectorName: 'K. Patel',
    isSynced: true
  },
  {
    id: 'PTH-016',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T08:32:00.000Z',
    latitude: 8.1825,
    longitude: 77.4139,
    depth: 3.8,
    severity: 'minor',
    confidence: 0.94,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-015',
    roverId: 'ROVER-01',
    timestamp: '2026-09-16T08:15:00.000Z',
    latitude: 8.1845,
    longitude: 77.4105,
    depth: 2.1,
    severity: 'minor',
    confidence: 0.91,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-014',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T16:45:00.000Z',
    latitude: 8.1839,
    longitude: 77.4122,
    depth: 7.9,
    severity: 'major',
    confidence: 0.95,
    status: 'MANUAL_INSPECTION_REQUIRED',
    repairMethod: 'MANUAL_INSPECTION',
    isSynced: true
  },
  {
    id: 'PTH-013',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T16:10:00.000Z',
    latitude: 8.1821,
    longitude: 77.4116,
    depth: 3.5,
    severity: 'minor',
    confidence: 0.97,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-012',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T15:30:00.000Z',
    latitude: 8.1852,
    longitude: 77.4118,
    depth: 6.8,
    severity: 'major',
    confidence: 0.93,
    status: 'MANUAL_INSPECTION_REQUIRED',
    repairMethod: 'MANUAL_INSPECTION',
    isSynced: true
  },
  {
    id: 'PTH-011',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T14:48:00.000Z',
    latitude: 8.1815,
    longitude: 77.4132,
    depth: 1.9,
    severity: 'minor',
    confidence: 0.88,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-010',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T14:12:00.000Z',
    latitude: 8.1828,
    longitude: 77.4102,
    depth: 3.4,
    severity: 'minor',
    confidence: 0.92,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-009',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T11:20:00.000Z',
    latitude: 8.1843,
    longitude: 77.4141,
    depth: 5.5,
    severity: 'major',
    confidence: 0.90,
    status: 'REPAIRED',
    repairMethod: 'MANUAL_ASPHALT_PATCH',
    inspectionNotes: 'Crushed stone base and cold bitumen mix applied.',
    inspectedAt: '2026-09-15T12:00:00.000Z',
    repairedAt: '2026-09-15T13:30:00.000Z',
    inspectorName: 'A. Joseph',
    isSynced: true
  },
  {
    id: 'PTH-008',
    roverId: 'ROVER-01',
    timestamp: '2026-09-15T10:45:00.000Z',
    latitude: 8.1819,
    longitude: 77.4124,
    depth: 4.6,
    severity: 'minor',
    confidence: 0.95,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-007',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T17:10:00.000Z',
    latitude: 8.1834,
    longitude: 77.4131,
    depth: 2.8,
    severity: 'minor',
    confidence: 0.93,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-006',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T16:20:00.000Z',
    latitude: 8.1847,
    longitude: 77.4112,
    depth: 7.1,
    severity: 'major',
    confidence: 0.96,
    status: 'REPAIRED',
    repairMethod: 'MANUAL_ASPHALT_PATCH',
    inspectionNotes: 'Completed during Monday campus maintenance round.',
    inspectedAt: '2026-09-14T17:00:00.000Z',
    repairedAt: '2026-09-15T09:00:00.000Z',
    inspectorName: 'Eng. R. Sharma',
    isSynced: true
  },
  {
    id: 'PTH-005',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T15:05:00.000Z',
    latitude: 8.1822,
    longitude: 77.4109,
    depth: 3.1,
    severity: 'minor',
    confidence: 0.94,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-004',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T14:15:00.000Z',
    latitude: 8.1836,
    longitude: 77.4125,
    depth: 2.4,
    severity: 'minor',
    confidence: 0.91,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-003',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T11:30:00.000Z',
    latitude: 8.1816,
    longitude: 77.4118,
    depth: 3.9,
    severity: 'minor',
    confidence: 0.89,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  },
  {
    id: 'PTH-002',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T10:05:00.000Z',
    latitude: 8.1850,
    longitude: 77.4129,
    depth: 8.2,
    severity: 'major',
    confidence: 0.98,
    status: 'MANUAL_INSPECTION_REQUIRED',
    repairMethod: 'MANUAL_INSPECTION',
    isSynced: true
  },
  {
    id: 'PTH-001',
    roverId: 'ROVER-01',
    timestamp: '2026-09-14T09:15:00.000Z',
    latitude: 8.1827,
    longitude: 77.4115,
    depth: 4.3,
    severity: 'minor',
    confidence: 0.92,
    status: 'FILLED',
    repairMethod: 'AUTOMATIC_SAND_DISPENSING',
    isSynced: true
  }
];

export const INITIAL_ROVER_TELEMETRY: RoverTelemetry = {
  roverId: 'ROVER-01',
  isOnline: true,
  wifiConnected: true,
  wifiSsid: 'CAMPUS-IOT-SECURE',
  wifiSignalDbm: -56,
  lastSyncTimestamp: new Date().toISOString(),
  currentActivity: 'PATROLLING',
  unsyncedRecordsCount: 0,
  currentLocation: {
    latitude: 8.1832,
    longitude: 77.4119
  },
  hardware: {
    raspberryPi: {
      model: 'Raspberry Pi 4 Model B (4GB)',
      status: 'ONLINE',
      cpuUsagePercent: 28,
      ramUsagePercent: 44,
      tempCelsius: 48.5,
      uptimeSeconds: 14250
    },
    camera: {
      model: 'Pi Camera Module 3 (Sony IMX708)',
      status: 'ACTIVE',
      fps: 30,
      resolution: '1920x1080 @ 30fps',
      aiModel: 'MobileNetV2 + EfficientNet-B0 Hybrid',
      detectionActive: true
    },
    ultrasonicSensor: {
      model: 'HC-SR04 Ultrasonic Depth Sensor',
      status: 'ACTIVE',
      lastMeasuredDepthCm: 0.0,
      sampleRateHz: 10,
      accuracyMm: 3
    },
    sandDispenser: {
      model: 'MG996R High-Torque Metal Gear Servo',
      status: 'READY',
      hopperCapacityPercent: 78,
      dispensingDurationSec: 3.2,
      totalFillsExecuted: 16
    },
    gpsModule: {
      model: 'NEO-6M / NEO-M8N GPS Module',
      status: 'LOCKED',
      satellitesConnected: 9,
      hdop: 0.82,
      currentLatitude: 8.1832,
      currentLongitude: 77.4119,
      altitudeMeters: 42.5
    },
    motorDriver: {
      model: 'L298N Dual H-Bridge Motor Driver',
      status: 'ACTIVE',
      patrolSpeedMps: 0.65,
      batteryVoltageVolts: 11.8,
      batteryPercentage: 84
    }
  }
};
