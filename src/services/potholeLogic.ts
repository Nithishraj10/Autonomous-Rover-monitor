import { PotholeSeverity, PotholeStatus, RepairMethod, DetectionPayload, Pothole, TimelineEvent } from '../types/pothole';

/**
 * Depth threshold in centimeters according to engineering specification:
 * Depth < 5 cm  -> MINOR (Rover automatically dispenses sand, status = FILLED)
 * Depth >= 5 cm -> MAJOR (GPS coordinates logged, status = MANUAL_INSPECTION_REQUIRED)
 */
export const POTHOLE_DEPTH_THRESHOLD_CM = 5.0;

/**
 * Classifies severity based on ultrasonic depth sensor reading
 */
export function classifySeverity(depthCm: number): PotholeSeverity {
  return depthCm < POTHOLE_DEPTH_THRESHOLD_CM ? 'minor' : 'major';
}

/**
 * Determines automated repair and status logic for a newly detected pothole
 */
export function determinePotholeOutcome(depthCm: number): {
  severity: PotholeSeverity;
  status: PotholeStatus;
  repairMethod: RepairMethod;
} {
  const severity = classifySeverity(depthCm);
  
  if (severity === 'minor') {
    return {
      severity: 'minor',
      status: 'FILLED',
      repairMethod: 'AUTOMATIC_SAND_DISPENSING'
    };
  } else {
    return {
      severity: 'major',
      status: 'MANUAL_INSPECTION_REQUIRED',
      repairMethod: 'MANUAL_INSPECTION'
    };
  }
}

/**
 * Converts a raw rover detection payload into a full Pothole domain entity
 */
export function processRoverDetectionPayload(payload: DetectionPayload): Pothole {
  const { severity, status, repairMethod } = determinePotholeOutcome(payload.depth_cm);
  const timeStr = payload.timestamp || new Date().toISOString();
  
  const timeline: TimelineEvent[] = [
    {
      timestamp: timeStr,
      title: 'AI Feature Extraction',
      description: `Camera Module 3 + MobileNetV2/EfficientNet-B0 detected surface depression (${((payload.confidence || 0.92) * 100).toFixed(0)}% confidence).`,
      type: 'detect'
    },
    {
      timestamp: new Date(new Date(timeStr).getTime() + 1000).toISOString(),
      title: 'Ultrasonic Depth Measurement',
      description: `HC-SR04 ultrasonic echo measured depth: ${payload.depth_cm.toFixed(1)} cm.`,
      type: 'measure'
    },
    {
      timestamp: new Date(new Date(timeStr).getTime() + 2000).toISOString(),
      title: `Classified as ${severity.toUpperCase()}`,
      description: severity === 'minor' 
        ? `Depth < ${POTHOLE_DEPTH_THRESHOLD_CM}cm: Qualified for automated sand hopper dispensing.`
        : `Depth ≥ ${POTHOLE_DEPTH_THRESHOLD_CM}cm: Exceeds safe auto-fill threshold. Flagged for manual road team.`,
      type: 'classify'
    },
    {
      timestamp: new Date(new Date(timeStr).getTime() + 3000).toISOString(),
      title: 'GPS Coordinate Lock',
      description: `NEO-6M GPS logged fix at Lat: ${payload.latitude.toFixed(6)}, Lon: ${payload.longitude.toFixed(6)}.`,
      type: 'gps'
    }
  ];

  if (severity === 'minor') {
    timeline.push({
      timestamp: new Date(new Date(timeStr).getTime() + 5000).toISOString(),
      title: 'Automated Sand Dispensed',
      description: 'MG996R servo rotated gate 90° for 3.2s. Cavity filled & leveled.',
      type: 'fill'
    });
  }

  timeline.push({
    timestamp: new Date(new Date(timeStr).getTime() + 6000).toISOString(),
    title: 'Dashboard Synchronized',
    description: 'Telemetry payload transmitted via WiFi link.',
    type: 'sync'
  });

  return {
    id: payload.pothole_id,
    roverId: payload.rover_id || 'ROVER-01',
    timestamp: timeStr,
    latitude: payload.latitude,
    longitude: payload.longitude,
    depth: payload.depth_cm,
    severity,
    confidence: payload.confidence || 0.94,
    status,
    repairMethod,
    imageUrl: payload.image_url,
    timeline,
    isSynced: true
  };
}
