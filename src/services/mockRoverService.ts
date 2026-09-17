import { Pothole, DetectionPayload } from '../types/pothole';
import { RoverTelemetry, RoverActivity } from '../types/rover';
import { INITIAL_POTHOLES, INITIAL_ROVER_TELEMETRY, CAMPUS_CENTER } from './demoData';
import { processRoverDetectionPayload } from './potholeLogic';

type DetectionListener = (pothole: Pothole) => void;
type TelemetryListener = (telemetry: RoverTelemetry) => void;
type SyncListener = (syncedCount: number) => void;

class MockRoverService {
  private potholes: Pothole[] = [...INITIAL_POTHOLES];
  private telemetry: RoverTelemetry = { ...INITIAL_ROVER_TELEMETRY };
  private offlineQueue: DetectionPayload[] = [];
  private detectionListeners: Set<DetectionListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private syncListeners: Set<SyncListener> = new Set();
  private counter = 25;
  private patrolInterval: number | null = null;

  constructor() {
    this.startHeartbeat();
  }

  public getPotholes(): Pothole[] {
    return [...this.potholes];
  }

  public getRoverTelemetry(): RoverTelemetry {
    return { ...this.telemetry };
  }

  public subscribeDetection(listener: DetectionListener): () => void {
    this.detectionListeners.add(listener);
    return () => this.detectionListeners.delete(listener);
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  public subscribeSync(listener: SyncListener): () => void {
    this.syncListeners.add(listener);
    return () => this.syncListeners.delete(listener);
  }

  /**
   * Toggles WiFi connectivity state to simulate rover leaving / entering coverage
   */
  public setWifiConnected(connected: boolean): RoverTelemetry {
    this.telemetry = {
      ...this.telemetry,
      isOnline: connected,
      wifiConnected: connected,
      wifiSignalDbm: connected ? -58 : 0,
      currentActivity: connected 
        ? (this.offlineQueue.length > 0 ? 'WAITING_FOR_WIFI' : 'PATROLLING')
        : 'WAITING_FOR_WIFI'
    };

    if (connected && this.offlineQueue.length > 0) {
      this.flushOfflineQueue();
    }

    this.notifyTelemetry();
    return { ...this.telemetry };
  }

  /**
   * Synchronizes offline stored records upon WiFi reconnection
   */
  public flushOfflineQueue(): void {
    if (this.offlineQueue.length === 0) return;

    const count = this.offlineQueue.length;
    const syncedItems: Pothole[] = [];

    while (this.offlineQueue.length > 0) {
      const raw = this.offlineQueue.shift()!;
      const processed = processRoverDetectionPayload(raw);
      syncedItems.unshift(processed);
    }

    this.potholes = [...syncedItems, ...this.potholes];
    this.telemetry = {
      ...this.telemetry,
      lastSyncTimestamp: new Date().toISOString(),
      unsyncedRecordsCount: 0,
      currentActivity: 'PATROLLING'
    };

    syncedItems.forEach(pothole => {
      this.detectionListeners.forEach(listener => listener(pothole));
    });

    this.syncListeners.forEach(listener => listener(count));
    this.notifyTelemetry();
  }

  /**
   * Simulates a detection triggered by physical hardware or test button
   */
  public simulateDetection(forcedSeverity?: 'minor' | 'major'): Pothole | { offline: boolean; payload: DetectionPayload } {
    const pthId = `PTH-0${this.counter++}`;
    
    // Generate realistic campus coordinate offset (within ~150 meters)
    const latOffset = (Math.random() - 0.5) * 0.0035;
    const lngOffset = (Math.random() - 0.5) * 0.0035;
    const latitude = Number((CAMPUS_CENTER.lat + latOffset).toFixed(6));
    const longitude = Number((CAMPUS_CENTER.lng + lngOffset).toFixed(6));

    let depthCm: number;
    if (forcedSeverity === 'minor') {
      depthCm = Number((1.5 + Math.random() * 3.2).toFixed(1)); // 1.5cm - 4.7cm (<5cm)
    } else if (forcedSeverity === 'major') {
      depthCm = Number((5.2 + Math.random() * 4.5).toFixed(1)); // 5.2cm - 9.7cm (>=5cm)
    } else {
      // 60% minor, 40% major random distribution
      depthCm = Math.random() > 0.4 
        ? Number((1.5 + Math.random() * 3.3).toFixed(1))
        : Number((5.1 + Math.random() * 4.4).toFixed(1));
    }

    const payload: DetectionPayload = {
      rover_id: 'ROVER-01',
      pothole_id: pthId,
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      depth_cm: depthCm,
      confidence: Number((0.89 + Math.random() * 0.09).toFixed(2))
    };

    // Update rover position and telemetry activity
    this.telemetry = {
      ...this.telemetry,
      currentLocation: { latitude, longitude },
      currentActivity: depthCm < 5 ? 'FILLING_POTHOLE' : 'POTHOLE_DETECTED',
      hardware: {
        ...this.telemetry.hardware,
        ultrasonicSensor: {
          ...this.telemetry.hardware.ultrasonicSensor,
          lastMeasuredDepthCm: depthCm
        },
        sandDispenser: {
          ...this.telemetry.hardware.sandDispenser,
          status: depthCm < 5 ? 'DISPENSING' : 'READY',
          hopperCapacityPercent: depthCm < 5 
            ? Math.max(0, this.telemetry.hardware.sandDispenser.hopperCapacityPercent - 3)
            : this.telemetry.hardware.sandDispenser.hopperCapacityPercent,
          totalFillsExecuted: depthCm < 5
            ? this.telemetry.hardware.sandDispenser.totalFillsExecuted + 1
            : this.telemetry.hardware.sandDispenser.totalFillsExecuted
        }
      }
    };
    this.notifyTelemetry();

    // If offline, save into rover local storage buffer
    if (!this.telemetry.wifiConnected) {
      this.offlineQueue.push(payload);
      this.telemetry.unsyncedRecordsCount = this.offlineQueue.length;
      this.notifyTelemetry();

      // Reset activity after short delay
      setTimeout(() => {
        if (!this.telemetry.wifiConnected) {
          this.telemetry.currentActivity = 'WAITING_FOR_WIFI';
          this.notifyTelemetry();
        }
      }, 2500);

      return { offline: true, payload };
    }

    // Process and add to dashboard
    const newPothole = processRoverDetectionPayload(payload);
    this.potholes = [newPothole, ...this.potholes];
    this.telemetry.lastSyncTimestamp = new Date().toISOString();

    // Reset rover activity back to patrol
    setTimeout(() => {
      this.telemetry.currentActivity = 'PATROLLING';
      if (this.telemetry.hardware.sandDispenser.status === 'DISPENSING') {
        this.telemetry.hardware.sandDispenser.status = 'READY';
      }
      this.notifyTelemetry();
    }, 2800);

    this.detectionListeners.forEach(listener => listener(newPothole));
    return newPothole;
  }

  /**
   * Updates status of an existing pothole (e.g. manual inspection, repair)
   */
  public updatePotholeStatus(
    id: string, 
    status: Pothole['status'], 
    options?: { notes?: string; inspectorName?: string; repairMethod?: Pothole['repairMethod'] }
  ): Pothole | null {
    const idx = this.potholes.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const existing = this.potholes[idx];
    const now = new Date().toISOString();
    
    const updated: Pothole = {
      ...existing,
      status,
      inspectionNotes: options?.notes !== undefined ? options.notes : existing.inspectionNotes,
      inspectorName: options?.inspectorName || existing.inspectorName || 'Operator Admin',
      repairMethod: options?.repairMethod || (status === 'REPAIRED' ? 'MANUAL_ASPHALT_PATCH' : existing.repairMethod),
      inspectedAt: (status === 'INSPECTED' || status === 'REPAIRED') ? (existing.inspectedAt || now) : existing.inspectedAt,
      repairedAt: status === 'REPAIRED' ? now : existing.repairedAt,
      timeline: [
        ...(existing.timeline || []),
        {
          timestamp: now,
          title: status === 'REPAIRED' ? 'Marked as Repaired' : `Status Updated to ${status}`,
          description: options?.notes || `Manual action performed by ${options?.inspectorName || 'Operator Admin'}`,
          type: status === 'REPAIRED' ? 'repair' : 'inspect'
        }
      ]
    };

    this.potholes[idx] = updated;
    return updated;
  }

  /**
   * Starts autonomous patrol simulation
   */
  public toggleAutoPatrol(enabled: boolean): boolean {
    if (enabled && !this.patrolInterval) {
      this.patrolInterval = window.setInterval(() => {
        if (this.telemetry.currentActivity === 'PATROLLING') {
          // Micro step movement
          const lat = this.telemetry.currentLocation.latitude + (Math.random() - 0.48) * 0.0003;
          const lng = this.telemetry.currentLocation.longitude + (Math.random() - 0.48) * 0.0003;
          this.telemetry.currentLocation = { latitude: lat, longitude: lng };
          this.notifyTelemetry();

          // 20% chance per 8s interval to find a pothole while cruising
          if (Math.random() < 0.20) {
            this.simulateDetection();
          }
        }
      }, 7000);
      return true;
    } else if (!enabled && this.patrolInterval) {
      clearInterval(this.patrolInterval);
      this.patrolInterval = null;
      return false;
    }
    return Boolean(this.patrolInterval);
  }

  private startHeartbeat(): void {
    setInterval(() => {
      if (this.telemetry.wifiConnected) {
        // Subtle realistic telemetry noise (CPU, battery, temp)
        const pi = this.telemetry.hardware.raspberryPi;
        pi.cpuUsagePercent = Math.min(95, Math.max(15, pi.cpuUsagePercent + Math.floor((Math.random() - 0.5) * 6)));
        pi.tempCelsius = Number((48 + (pi.cpuUsagePercent / 100) * 12 + (Math.random() - 0.5) * 1.5).toFixed(1));
        
        const motor = this.telemetry.hardware.motorDriver;
        motor.batteryVoltageVolts = Number((11.8 - (Date.now() % 100000) * 0.000002).toFixed(2));
        motor.batteryPercentage = Math.round(((motor.batteryVoltageVolts - 10.5) / (12.6 - 10.5)) * 100);

        this.notifyTelemetry();
      }
    }, 4000);
  }

  private notifyTelemetry(): void {
    this.telemetryListeners.forEach(listener => listener({ ...this.telemetry }));
  }
}

export const mockRoverService = new MockRoverService();
