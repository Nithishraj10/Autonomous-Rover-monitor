import React from 'react';
import { 
  Bot, 
  Camera, 
  Waves, 
  Split, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';

export const WorkflowDiagram: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Autonomous Detection & Repair Pipeline
            </h4>
            <p className="text-xs text-slate-500">
              End-to-end hardware workflow from camera detection to automated dispensing or manual triage.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Threshold: 5.0 cm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center text-xs">
        
        {/* Step 1: Patrol */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800">1. Autonomous Patrol</span>
          <span className="text-[10px] text-slate-500">L298N & NEO-6M GPS</span>
        </div>

        {/* Step 2: Camera Detection */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1.5">
            <Camera className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800">2. AI Vision Scan</span>
          <span className="text-[10px] text-slate-500">Pi Cam 3 + MobileNet</span>
        </div>

        {/* Step 3: Ultrasonic Measurement */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-1.5">
            <Waves className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800">3. Depth Sensing</span>
          <span className="text-[10px] text-slate-500">HC-SR04 Ultrasonic</span>
        </div>

        {/* Step 4 & 5: Dual Branch Logic */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          {/* Minor Branch */}
          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px] mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>MINOR (&lt;5cm)</span>
            </div>
            <p className="text-[10px] text-emerald-800 font-medium leading-tight">
              MG996R Servo Sand Hopper
            </p>
            <span className="mt-1 px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-mono text-[9px] font-semibold">
              STATUS: FILLED
            </span>
          </div>

          {/* Major Branch */}
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-center flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-700 font-bold text-[11px] mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>MAJOR (≥5cm)</span>
            </div>
            <p className="text-[10px] text-amber-800 font-medium leading-tight">
              Exact GPS Pin & Alert
            </p>
            <span className="mt-1 px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono text-[9px] font-semibold">
              INSPECTION REQ.
            </span>
          </div>
        </div>

        {/* Step 6: Dashboard Sync */}
        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="font-semibold text-blue-900">4. Live IoT Cloud</span>
          <span className="text-[10px] text-blue-700 font-mono">Map + Telemetry</span>
        </div>

      </div>
    </div>
  );
};
