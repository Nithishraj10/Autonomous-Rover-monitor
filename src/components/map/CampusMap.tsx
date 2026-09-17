import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  Search, 
  Layers, 
  MapPin, 
  Maximize2, 
  Compass, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Crosshair,
  RefreshCw
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { Pothole } from '../../types/pothole';
import { CAMPUS_CENTER } from '../../services/demoData';

interface CampusMapProps {
  heightClass?: string;
  focusPotholeId?: string | null;
  onSelectPothole?: (pothole: Pothole) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  heightClass = 'h-[580px]',
  focusPotholeId,
  onSelectPothole
}) => {
  const { filteredPotholes, telemetry, activeFilter, setActiveFilter, searchQuery, setSearchQuery } = useRover();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const roverMarkerRef = useRef<L.Marker | null>(null);
  const [mapLayerType, setMapLayerType] = useState<'streets' | 'satellite'>('streets');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
        zoom: 17,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Rover Campus Grid',
        maxZoom: 19
      }).addTo(map);

      // Markers LayerGroup
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when filteredPotholes changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    filteredPotholes.forEach((pothole) => {
      const isMajor = pothole.severity === 'major';
      const isRepaired = pothole.status === 'REPAIRED';
      const isInspected = pothole.status === 'INSPECTED';

      // Pick marker color and icon
      let bgColor = 'bg-emerald-500';
      let ringColor = 'border-white';
      let markerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

      if (isRepaired) {
        bgColor = 'bg-blue-600';
        markerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      } else if (isInspected) {
        bgColor = 'bg-purple-600';
      } else if (isMajor) {
        bgColor = 'bg-rose-500 animate-pulse';
        ringColor = 'border-amber-300';
        markerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="w-8 h-8 rounded-full ${bgColor} border-2 ${ringColor} shadow-lg flex items-center justify-center text-white cursor-pointer transform hover:scale-125 transition-transform">
            ${markerIconSvg}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([pothole.latitude, pothole.longitude], { icon: customIcon });

      // Custom popup HTML
      const popupHtml = `
        <div class="p-3.5 min-w-[240px] text-slate-900 font-sans">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span class="font-mono font-bold text-sm text-slate-900">${pothole.id}</span>
            <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              isMajor ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }">
              ${pothole.severity.toUpperCase()}
            </span>
          </div>

          <div class="space-y-1.5 text-xs text-slate-600 mb-3 font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400 font-sans">Depth:</span>
              <span class="font-bold text-slate-900">${pothole.depth.toFixed(1)} cm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400 font-sans">Coordinates:</span>
              <span>${pothole.latitude.toFixed(4)}° N, ${pothole.longitude.toFixed(4)}° E</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400 font-sans">Detected:</span>
              <span>${new Date(pothole.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400 font-sans">Rover:</span>
              <span class="font-semibold text-blue-600">${pothole.roverId}</span>
            </div>
            <div class="flex justify-between pt-1 border-t border-slate-100 font-sans">
              <span class="text-slate-400">Status:</span>
              <span class="font-semibold text-[11px] ${
                pothole.status === 'FILLED' ? 'text-emerald-600' :
                pothole.status === 'REPAIRED' ? 'text-blue-600' : 'text-amber-600'
              }">${pothole.status.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <button 
            id="popup-btn-${pothole.id}" 
            class="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1"
          >
            <span>View Details</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${pothole.id}`);
        if (btn && onSelectPothole) {
          btn.onclick = () => onSelectPothole(pothole);
        }
      });

      layer.addLayer(marker);
    });

    // Update or add Rover Live Location Pin
    if (telemetry.currentLocation) {
      const roverIcon = L.divIcon({
        className: 'rover-live-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-blue-400 opacity-60"></span>
            <div class="w-9 h-9 rounded-2xl bg-slate-900 border-2 border-cyan-400 shadow-xl flex items-center justify-center text-cyan-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      if (!roverMarkerRef.current) {
        roverMarkerRef.current = L.marker(
          [telemetry.currentLocation.latitude, telemetry.currentLocation.longitude],
          { icon: roverIcon, zIndexOffset: 2000 }
        ).addTo(mapInstanceRef.current);
        roverMarkerRef.current.bindTooltip('<b>ROVER-01 (Active Patrol)</b>', { direction: 'top' });
      } else {
        roverMarkerRef.current.setLatLng([telemetry.currentLocation.latitude, telemetry.currentLocation.longitude]);
      }
    }

  }, [filteredPotholes, telemetry.currentLocation, onSelectPothole]);

  // Focus on specific pothole if prop changes
  useEffect(() => {
    if (focusPotholeId && mapInstanceRef.current) {
      const target = filteredPotholes.find(p => p.id === focusPotholeId);
      if (target) {
        mapInstanceRef.current.setView([target.latitude, target.longitude], 19, { animate: true });
      }
    }
  }, [focusPotholeId, filteredPotholes]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], 17, { animate: true });
    }
  };

  const centerOnRover = () => {
    if (mapInstanceRef.current && telemetry.currentLocation) {
      mapInstanceRef.current.setView(
        [telemetry.currentLocation.latitude, telemetry.currentLocation.longitude],
        19,
        { animate: true }
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
      
      {/* Map Control Toolbar */}
      <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Potholes' },
            { id: 'minor', label: 'Minor (<5cm)' },
            { id: 'major', label: 'Major (≥5cm)' },
            { id: 'filled', label: 'Filled' },
            { id: 'inspection', label: 'Inspection Req.' },
            { id: 'repaired', label: 'Repaired' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Coordinates / ID */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID / Coord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={centerOnRover}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium flex items-center gap-1 shadow-sm"
            title="Locate Rover"
          >
            <Crosshair className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Rover</span>
          </button>

          <button
            onClick={resetView}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium shadow-sm"
            title="Reset Campus View"
          >
            <Compass className="w-4 h-4 text-slate-600" />
          </button>
        </div>

      </div>

      {/* Map Element */}
      <div className={`w-full ${heightClass} relative z-0`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-[500] bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200/80 shadow-md text-xs space-y-1.5 pointer-events-auto">
          <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
            Map Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span className="text-slate-600">Minor (&lt;5cm) - Auto Filled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-white animate-pulse" />
            <span className="text-slate-600">Major (≥5cm) - Inspection Req.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
            <span className="text-slate-600">Major - Repaired</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
            <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-cyan-400 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <span className="font-medium text-slate-800">ROVER-01 (Live Position)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
