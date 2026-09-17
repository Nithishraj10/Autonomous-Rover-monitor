import { Pothole, PotholeStats } from '../types/pothole';
import { mockRoverService } from './mockRoverService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const potholeService = {
  /**
   * Fetches all pothole records (from backend API or local mock engine)
   */
  async getPotholes(): Promise<Pothole[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/potholes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('API unavailable, falling back to mock dataset:', err);
      }
    }
    return Promise.resolve(mockRoverService.getPotholes());
  },

  /**
   * Fetches a specific pothole by ID
   */
  async getPotholeById(id: string): Promise<Pothole | null> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/potholes/${id}`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API error, using mock:', err);
      }
    }
    const all = mockRoverService.getPotholes();
    return Promise.resolve(all.find(p => p.id === id) || null);
  },

  /**
   * Updates status of a pothole (e.g. manual inspection, repair complete)
   */
  async updateStatus(
    id: string, 
    status: Pothole['status'], 
    options?: { notes?: string; inspectorName?: string; repairMethod?: Pothole['repairMethod'] }
  ): Promise<Pothole | null> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/potholes/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, ...options })
        });
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API update failed, updating local mock:', err);
      }
    }
    return Promise.resolve(mockRoverService.updatePotholeStatus(id, status, options));
  },

  /**
   * Calculates dynamic metrics from pothole list
   */
  calculateStats(potholes: Pothole[]): PotholeStats {
    const total = potholes.length;
    const minor = potholes.filter(p => p.severity === 'minor').length;
    const major = potholes.filter(p => p.severity === 'major').length;
    const filled = potholes.filter(p => p.status === 'FILLED' || p.status === 'REPAIRED').length;
    const inspectionRequired = potholes.filter(p => p.status === 'MANUAL_INSPECTION_REQUIRED').length;
    const repaired = potholes.filter(p => p.status === 'REPAIRED').length;
    const totalDepth = potholes.reduce((acc, curr) => acc + curr.depth, 0);
    const avgDepth = total > 0 ? Number((totalDepth / total).toFixed(1)) : 0;

    return {
      total,
      minor,
      major,
      filled,
      inspectionRequired,
      repaired,
      avgDepth
    };
  }
};
