import React from 'react';
import { 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  AlertOctagon, 
  SlidersHorizontal 
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';

export const SimulationControlBar: React.FC = () => {
  const { 
    telemetry, 
    simulateDetection, 
    toggleWifi, 
    syncOfflineQueue, 
    isAutoPatrolling, 
    toggleAutoPatrol 
  } = useRover();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title & Explainer */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm tracking-tight text-white">
                Rover Hardware Simulation & Test Bench
              </h3>
              <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Demo Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Test detection feeds, ultrasonic 5.0cm threshold logic, and offline buffering without physical rover.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Quick Random Detection */}
          <button
            onClick={() => simulateDetection()}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30"
            title="Generate a realistic pothole detection with ultrasonic measurement"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Simulate Detection</span>
          </button>

          {/* Force Minor Auto-fill */}
          <button
            onClick={() => simulateDetection('minor')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium rounded-xl transition-all"
            title="Trigger detection with depth < 5.0 cm (Minor -> Auto Sand Dispense -> Filled)"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Minor (&lt;5cm Auto-Fill)</span>
          </button>

          {/* Force Major Inspection Alert */}
          <button
            onClick={() => simulateDetection('major')}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 text-xs font-medium rounded-xl transition-all"
            title="Trigger detection with depth ≥ 5.0 cm (Major -> GPS Log -> Inspection Required)"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Major (≥5cm Alert)</span>
          </button>

          <div className="h-6 w-px bg-slate-700 hidden sm:block" />

          {/* WiFi Toggle */}
          <button
            onClick={() => toggleWifi(!telemetry.wifiConnected)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
              telemetry.wifiConnected
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                : 'bg-amber-950/80 hover:bg-amber-900 border-amber-500 text-amber-300 animate-pulse'
            }`}
            title={telemetry.wifiConnected ? "Simulate losing WiFi signal" : "Restore WiFi signal"}
          >
            {telemetry.wifiConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
                <span>Simulate WiFi Drop</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Restore WiFi</span>
              </>
            )}
          </button>

          {/* Manual Sync if offline records present */}
          {telemetry.unsyncedRecordsCount > 0 && (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sync {telemetry.unsyncedRecordsCount} Records</span>
            </button>
          )}

          {/* Auto Patrol Loop Toggle */}
          <button
            onClick={toggleAutoPatrol}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
              isAutoPatrolling
                ? 'bg-purple-900/60 border-purple-500 text-purple-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Toggle autonomous background patrol simulation"
          >
            {isAutoPatrolling ? (
              <>
                <Square className="w-3.5 h-3.5 text-purple-400" />
                <span>Stop Auto-Patrol</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-purple-400" />
                <span>Auto-Patrol Mode</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
