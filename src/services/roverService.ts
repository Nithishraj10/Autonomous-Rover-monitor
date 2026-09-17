import { RoverTelemetry } from '../types/rover';
import { mockRoverService } from './mockRoverService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const roverService = {
  /**
   * Retrieves real-time status of the rover
   */
  async getStatus(): Promise<RoverTelemetry> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rover/status`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('Rover API unreachable, reading mock telemetry:', err);
      }
    }
    return Promise.resolve(mockRoverService.getRoverTelemetry());
  },

  /**
   * Toggles WiFi state (for testing offline synchronization workflows)
   */
  toggleWifi(connected: boolean): RoverTelemetry {
    return mockRoverService.setWifiConnected(connected);
  },

  /**
   * Triggers manual synchronization of offline queued packets
   */
  syncOfflineQueue(): void {
    mockRoverService.flushOfflineQueue();
  },

  /**
   * Generates a simulated pothole detection from the rover
   */
  simulateDetection(forcedSeverity?: 'minor' | 'major') {
    return mockRoverService.simulateDetection(forcedSeverity);
  },

  /**
   * Toggles continuous simulated autonomous patrol
   */
  toggleAutoPatrol(enabled: boolean): boolean {
    return mockRoverService.toggleAutoPatrol(enabled);
  }
};
