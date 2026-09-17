import React from 'react';
import { 
  Radio, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  ArrowUpRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { Pothole } from '../../types/pothole';

interface LiveFeedProps {
  onSelectPothole: (pothole: Pothole) => void;
  onViewOnMap: (pothole: Pothole) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ onSelectPothole, onViewOnMap }) => {
  const { potholes, telemetry } = useRover();
  
  // Show most recent 6 detections
  const recentDetections = potholes.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Live Rover Feed
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Activity: <span className="font-semibold text-blue-600">{telemetry.currentActivity}</span>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
          Stream Active
        </span>
      </div>

      {/* Feed List */}
      <div className="p-3 space-y-2.5 overflow-y-auto max-h-[480px]">
        {recentDetections.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No detections recorded yet. Click "Simulate Detection" to test.
          </div>
        ) : (
          recentDetections.map((pothole, index) => {
            const isMajor = pothole.severity === 'major';
            const isFirst = index === 0;

            return (
              <div
                key={pothole.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 relative ${
                  isFirst ? 'animate-fade-in ring-1 ring-blue-400/50' : ''
                } ${
                  isMajor 
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300' 
                    : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {pothole.id}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isMajor 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {isMajor ? 'Major Pothole' : 'Minor Pothole'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(pothole.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2.5 font-mono">
                  <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-sans">Depth</span>
                    <span className="font-bold text-slate-800">{pothole.depth.toFixed(1)} cm</span>
                  </div>
                  <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-sans">GPS Fix</span>
                    <span className="truncate block">{pothole.latitude.toFixed(4)}, {pothole.longitude.toFixed(4)}</span>
                  </div>
                </div>

                {/* Status indicator badge */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isMajor ? (
                      <span className="text-amber-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        ● Manual Inspection Required
                      </span>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ● Automatically Filled
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewOnMap(pothole)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>Map</span>
                    </button>
                    <button
                      onClick={() => onSelectPothole(pothole)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
