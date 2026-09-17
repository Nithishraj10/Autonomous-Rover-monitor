export type RoverActivity = 
  | 'PATROLLING' 
  | 'POTHOLE_DETECTED' 
  | 'MEASURING_DEPTH' 
  | 'FILLING_POTHOLE' 
  | 'WAITING_FOR_WIFI' 
  | 'IDLE' 
  | 'RETURNING_TO_BASE';

export interface HardwareStatus {
  raspberryPi: {
    model: 'Raspberry Pi 4 Model B (4GB)';
    status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    cpuUsagePercent: number;
    ramUsagePercent: number;
    tempCelsius: number;
    uptimeSeconds: number;
  };
  camera: {
    model: 'Pi Camera Module 3 (Sony IMX708)';
    status: 'ACTIVE' | 'STANDBY' | 'ERROR';
    fps: number;
    resolution: '1920x1080 @ 30fps';
    aiModel: 'MobileNetV2 + EfficientNet-B0 Hybrid';
    detectionActive: boolean;
  };
  ultrasonicSensor: {
    model: 'HC-SR04 Ultrasonic Depth Sensor';
    status: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE';
    lastMeasuredDepthCm: number;
    sampleRateHz: 10;
    accuracyMm: 3;
  };
  sandDispenser: {
    model: 'MG996R High-Torque Metal Gear Servo';
    status: 'READY' | 'DISPENSING' | 'EMPTY' | 'JAMMED';
    hopperCapacityPercent: number; // 0-100%
    dispensingDurationSec: number;
    totalFillsExecuted: number;
  };
  gpsModule: {
    model: 'NEO-6M / NEO-M8N GPS Module';
    status: 'LOCKED' | 'SEARCHING' | 'NO_FIX';
    satellitesConnected: number;
    hdop: number;
    currentLatitude: number;
    currentLongitude: number;
    altitudeMeters: number;
  };
  motorDriver: {
    model: 'L298N Dual H-Bridge Motor Driver';
    status: 'ACTIVE' | 'STANDBY' | 'OVERHEAT';
    patrolSpeedMps: number;
    batteryVoltageVolts: number;
    batteryPercentage: number;
  };
}

export interface RoverTelemetry {
  roverId: string;
  isOnline: boolean;
  wifiConnected: boolean;
  wifiSsid: string;
  wifiSignalDbm: number; // e.g. -58 dBm
  lastSyncTimestamp: string;
  currentActivity: RoverActivity;
  unsyncedRecordsCount: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  hardware: HardwareStatus;
}
