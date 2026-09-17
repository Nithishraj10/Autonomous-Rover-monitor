import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Pothole, PotholeStats } from '../types/pothole';
import { RoverTelemetry } from '../types/rover';
import { potholeService } from '../services/potholeService';
import { roverService } from '../services/roverService';
import { mockRoverService } from '../services/mockRoverService';

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  potholeId?: string;
}

interface RoverContextType {
  potholes: Pothole[];
  filteredPotholes: Pothole[];
  stats: PotholeStats;
  telemetry: RoverTelemetry;
  selectedPothole: Pothole | null;
  inspectingPothole: Pothole | null;
  activeFilter: string;
  searchQuery: string;
  isAutoPatrolling: boolean;
  latestAlert: ToastAlert | null;
  alertsHistory: ToastAlert[];
  isLoading: boolean;
  // Actions
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPothole: (pothole: Pothole | null) => void;
  setInspectingPothole: (pothole: Pothole | null) => void;
  simulateDetection: (forcedSeverity?: 'minor' | 'major') => void;
  toggleWifi: (connected: boolean) => void;
  syncOfflineQueue: () => void;
  toggleAutoPatrol: () => void;
  updatePotholeStatus: (
    id: string, 
    status: Pothole['status'], 
    options?: { notes?: string; inspectorName?: string; repairMethod?: Pothole['repairMethod'] }
  ) => Promise<void>;
  dismissAlert: () => void;
}

const RoverContext = createContext<RoverContextType | undefined>(undefined);

export const RoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [telemetry, setTelemetry] = useState<RoverTelemetry>(mockRoverService.getRoverTelemetry());
  const [selectedPothole, setSelectedPothole] = useState<Pothole | null>(null);
  const [inspectingPothole, setInspectingPothole] = useState<Pothole | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAutoPatrolling, setIsAutoPatrolling] = useState<boolean>(false);
  const [latestAlert, setLatestAlert] = useState<ToastAlert | null>(null);
  const [alertsHistory, setAlertsHistory] = useState<ToastAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize initial data
  useEffect(() => {
    potholeService.getPotholes().then(data => {
      setPotholes(data);
      setIsLoading(false);
    });
  }, []);

  const addAlert = useCallback((title: string, message: string, type: ToastAlert['type'], potholeId?: string) => {
    const alert: ToastAlert = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      potholeId
    };
    setLatestAlert(alert);
    setAlertsHistory(prev => [alert, ...prev.slice(0, 19)]);
  }, []);

  const dismissAlert = useCallback(() => {
    setLatestAlert(null);
  }, []);

  // Subscribe to real-time events from MockRoverService / WebSocket
  useEffect(() => {
    const unsubDetection = mockRoverService.subscribeDetection((newPothole) => {
      setPotholes(prev => {
        const exists = prev.some(p => p.id === newPothole.id);
        if (exists) return prev;
        return [newPothole, ...prev];
      });

      if (newPothole.severity === 'major') {
        addAlert(
          'MAJOR POTHOLE DETECTED',
          `${newPothole.id} (Depth: ${newPothole.depth} cm) requires manual inspection. GPS logged.`,
          'alert',
          newPothole.id
        );
      } else {
        addAlert(
          'NEW POTHOLE DETECTED & FILLED',
          `${newPothole.id} (Depth: ${newPothole.depth} cm) automatically filled with sand dispenser.`,
          'success',
          newPothole.id
        );
      }
    });

    const unsubTelemetry = mockRoverService.subscribeTelemetry((newTelemetry) => {
      setTelemetry(newTelemetry);
    });

    const unsubSync = mockRoverService.subscribeSync((count) => {
      addAlert(
        'ROVER CONNECTION RESTORED',
        `${count} offline detection records synchronized successfully to the cloud dashboard.`,
        'info'
      );
      // Refresh list
      potholeService.getPotholes().then(setPotholes);
    });

    return () => {
      unsubDetection();
      unsubTelemetry();
      unsubSync();
    };
  }, [addAlert]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    return potholeService.calculateStats(potholes);
  }, [potholes]);

  // Filtered dataset
  const filteredPotholes = useMemo(() => {
    return potholes.filter(p => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.id.toLowerCase().includes(q) ||
        p.roverId.toLowerCase().includes(q) ||
        p.latitude.toString().includes(q) ||
        p.longitude.toString().includes(q) ||
        (p.inspectionNotes && p.inspectionNotes.toLowerCase().includes(q)) ||
        p.status.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Filter match
      if (activeFilter === 'all') return true;
      if (activeFilter === 'minor') return p.severity === 'minor';
      if (activeFilter === 'major') return p.severity === 'major';
      if (activeFilter === 'filled') return p.status === 'FILLED';
      if (activeFilter === 'inspection') return p.status === 'MANUAL_INSPECTION_REQUIRED';
      if (activeFilter === 'repaired') return p.status === 'REPAIRED';
      return true;
    });
  }, [potholes, activeFilter, searchQuery]);

  const simulateDetection = useCallback((forcedSeverity?: 'minor' | 'major') => {
    const res = roverService.simulateDetection(forcedSeverity);
    if (res && 'offline' in res && res.offline) {
      addAlert(
        'OFFLINE DETECTION BUFFERED',
        `Rover is offline. ${res.payload.pothole_id} (${res.payload.depth_cm}cm) stored in local Pi storage. Will sync when WiFi reconnects.`,
        'warning'
      );
    }
  }, [addAlert]);

  const toggleWifi = useCallback((connected: boolean) => {
    const updated = roverService.toggleWifi(connected);
    if (!connected) {
      addAlert(
        'ROVER OFFLINE',
        'Rover lost WiFi connection. Patrol continuing; detections will be stored in onboard memory.',
        'warning'
      );
    }
    setTelemetry(updated);
  }, [addAlert]);

  const syncOfflineQueue = useCallback(() => {
    roverService.syncOfflineQueue();
  }, []);

  const toggleAutoPatrol = useCallback(() => {
    setIsAutoPatrolling(prev => {
      const next = !prev;
      roverService.toggleAutoPatrol(next);
      return next;
    });
  }, []);

  const updatePotholeStatus = useCallback(async (
    id: string, 
    status: Pothole['status'], 
    options?: { notes?: string; inspectorName?: string; repairMethod?: Pothole['repairMethod'] }
  ) => {
    const updated = await potholeService.updateStatus(id, status, options);
    if (updated) {
      setPotholes(prev => prev.map(p => p.id === id ? updated : p));
      if (selectedPothole && selectedPothole.id === id) {
        setSelectedPothole(updated);
      }
      addAlert(
        'STATUS UPDATED',
        `${id} status changed to ${status.replace(/_/g, ' ')}.`,
        'success'
      );
    }
  }, [selectedPothole, addAlert]);

  return (
    <RoverContext.Provider
      value={{
        potholes,
        filteredPotholes,
        stats,
        telemetry,
        selectedPothole,
        inspectingPothole,
        activeFilter,
        searchQuery,
        isAutoPatrolling,
        latestAlert,
        alertsHistory,
        isLoading,
        setActiveFilter,
        setSearchQuery,
        setSelectedPothole,
        setInspectingPothole,
        simulateDetection,
        toggleWifi,
        syncOfflineQueue,
        toggleAutoPatrol,
        updatePotholeStatus,
        dismissAlert
      }}
    >
      {children}
    </RoverContext.Provider>
  );
};

export const useRover = () => {
  const context = useContext(RoverContext);
  if (!context) {
    throw new Error('useRover must be used within a RoverProvider');
  }
  return context;
};
