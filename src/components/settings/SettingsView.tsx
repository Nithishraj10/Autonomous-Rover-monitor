import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Radio, 
  Cpu, 
  Database, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  Bot,
  Sliders
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';

export const SettingsView: React.FC = () => {
  const { telemetry } = useRover();
  
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.105:8000');
  const [wsUrl, setWsUrl] = useState('ws://192.168.1.105:8000/ws/telemetry');
  const [threshold, setThreshold] = useState(5.0);
  const [servoDuration, setServoDuration] = useState(3.2);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              IoT System Settings & Hardware Integration
            </h2>
            <p className="text-xs text-slate-500">
              Configure Raspberry Pi 4 network endpoints, REST API connectors, ultrasonic depth thresholds, and servo parameters.
            </p>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Settings successfully updated in runtime context.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Backend API Endpoints */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Server className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Raspberry Pi 4 REST & WebSocket Endpoints
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                REST API Base URL (VITE_API_BASE_URL)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="e.g. http://192.168.1.105:8000"
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Endpoints: <code>/api/rover/status</code>, <code>/api/potholes</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WebSocket Real-time Telemetry URL
              </label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="e.g. ws://192.168.1.105:8000/ws/telemetry"
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Direct live broadcast of ultrasonic pulses and GPS locks.
              </p>
            </div>
          </div>
        </div>

        {/* Hardware Decision Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Autonomous Decision Logic & Actuator Tuning
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Severity Depth Threshold (cm)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="15.0"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value) || 5.0)}
                  className="w-28 px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500 font-sans">
                  Current: <strong className="text-slate-900">&lt; {threshold} cm</strong> (Minor Auto-Fill)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Detections ≥ {threshold} cm trigger high-priority manual inspection flags.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                MG996R Servo Sand Gate Open Duration (seconds)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10.0"
                  value={servoDuration}
                  onChange={(e) => setServoDuration(parseFloat(e.target.value) || 3.2)}
                  className="w-28 px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-500 font-sans">
                  Dispenses approx. <strong className="text-slate-900">{Math.round(servoDuration * 55)}g</strong> sand mix.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rover Identity & Wireless Config */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Radio className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Rover Identity & Campus Network
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-sans text-[10px] block uppercase">Assigned Rover ID</span>
              <span className="font-bold text-slate-900 text-sm">{telemetry.roverId}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-sans text-[10px] block uppercase">Patrol SSID</span>
              <span className="font-bold text-slate-900 text-sm">{telemetry.wifiSsid}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-sans text-[10px] block uppercase">Offline Sync Buffer</span>
              <span className="font-bold text-emerald-600 text-sm">Active (SQLite / RAM)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
