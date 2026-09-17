export type PotholeSeverity = 'minor' | 'major';

export type PotholeStatus = 
  | 'FILLED' 
  | 'MANUAL_INSPECTION_REQUIRED' 
  | 'INSPECTED' 
  | 'REPAIRED';

export type RepairMethod = 
  | 'AUTOMATIC_SAND_DISPENSING' 
  | 'MANUAL_INSPECTION' 
  | 'MANUAL_ASPHALT_PATCH' 
  | 'NONE';

export interface TimelineEvent {
  timestamp: string;
  title: string;
  description: string;
  type: 'detect' | 'measure' | 'classify' | 'gps' | 'fill' | 'sync' | 'inspect' | 'repair';
}

export interface Pothole {
  id: string; // e.g. "PTH-024"
  roverId: string; // e.g. "ROVER-01"
  timestamp: string; // ISO string
  latitude: number;
  longitude: number;
  depth: number; // in cm, e.g. 7.4
  severity: PotholeSeverity; // 'minor' | 'major'
  confidence: number; // e.g. 0.94 (MobileNetV2 + EfficientNet-B0 hybrid AI)
  status: PotholeStatus;
  repairMethod: RepairMethod;
  imageUrl?: string;
  inspectionNotes?: string;
  inspectedAt?: string;
  repairedAt?: string;
  inspectorName?: string;
  timeline?: TimelineEvent[];
  isSynced: boolean;
}

export interface DetectionPayload {
  rover_id: string;
  pothole_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth_cm: number;
  severity?: 'minor' | 'major';
  confidence?: number;
  image_url?: string;
}

export interface PotholeStats {
  total: number;
  minor: number;
  major: number;
  filled: number;
  inspectionRequired: number;
  repaired: number;
  avgDepth: number;
}
