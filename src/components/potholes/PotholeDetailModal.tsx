import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Bot, 
  Cpu, 
  Waves, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Hammer, 
  Sparkles, 
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Pothole } from '../../types/pothole';

interface PotholeDetailModalProps {
  pothole: Pothole | null;
  onClose: () => void;
  onOpenInspection?: (pothole: Pothole) => void;
}

export const PotholeDetailModal: React.FC<PotholeDetailModalProps> = ({
  pothole,
  onClose,
  onOpenInspection
}) => {
  if (!pothole) return null;

  const isMajor = pothole.severity === 'major';
  const isFilled = pothole.status === 'FILLED';
  const isRepaired = pothole.status === 'REPAIRED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isMajor ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isMajor ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono text-slate-900">
                  {pothole.id}
                </h3>
                <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                  isMajor ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                }`}>
                  {pothole.severity.toUpperCase()} SEVERITY
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Logged by <span className="font-semibold text-blue-600 font-mono">{pothole.roverId}</span> on {new Date(pothole.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Measured Depth</span>
              <div className="flex items-baseline gap-1 font-mono font-extrabold text-xl text-slate-900">
                {pothole.depth.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">cm</span>
              </div>
              <span className="text-[10px] text-slate-400">HC-SR04 ultrasonic echo</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">AI Confidence</span>
              <div className="flex items-baseline gap-1 font-mono font-extrabold text-xl text-blue-600">
                {((pothole.confidence || 0.94) * 100).toFixed(0)} <span className="text-xs font-normal font-sans">%</span>
              </div>
              <span className="text-[10px] text-slate-400">MobileNet + EfficientNet</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Current Status</span>
              <div className="font-semibold text-xs text-slate-800 truncate">
                {pothole.status.replace(/_/g, ' ')}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isFilled ? 'Automated' : isRepaired ? 'Manual Repair' : 'Triage Queue'}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Repair Method</span>
              <div className="font-semibold text-xs text-slate-800 truncate" title={pothole.repairMethod}>
                {pothole.repairMethod === 'AUTOMATIC_SAND_DISPENSING' ? 'Sand Dispenser' :
                 pothole.repairMethod === 'MANUAL_ASPHALT_PATCH' ? 'Asphalt Patch' : 'Manual Review'}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isMajor ? 'MG996R Bypassed' : 'MG996R Triggered'}
              </span>
            </div>
          </div>

          {/* GPS Location Details */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase">GPS Satellite Fix</p>
                <p className="font-mono text-sm font-bold text-blue-950">
                  {pothole.latitude.toFixed(6)}° N, {pothole.longitude.toFixed(6)}° E
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              <span>Campus Grid Sector 4</span>
            </div>
          </div>

          {/* AI Vision & Depth Sensor Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Camera Sensor Capture Placeholder */}
            <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col justify-between h-48 relative overflow-hidden">
              <div className="flex items-center justify-between z-10 text-xs">
                <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Pi Camera 3 Detection Frame
                </span>
                <span className="bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  1080p Sony IMX708
                </span>
              </div>

              {/* Simulated camera bounding box */}
              <div className="absolute inset-x-8 inset-y-12 border-2 border-dashed border-cyan-400/70 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-10 bg-black/40 rounded-full border border-amber-400 mx-auto flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      {pothole.depth} cm
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono block mt-1">
                    AI Fissure / Crater Class: {pothole.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="z-10 text-[10px] text-slate-400 flex justify-between font-mono">
                <span>Model: MobileNetV2 + EffNet-B0</span>
                <span>Conf: {((pothole.confidence || 0.94) * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Ultrasonic Depth Profile Gauge */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Waves className="w-4 h-4 text-cyan-600" />
                    HC-SR04 Ultrasonic Profile
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Threshold: 5.0 cm
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Depth Reading:</span>
                    <span className="font-mono font-bold text-slate-900">{pothole.depth.toFixed(1)} cm</span>
                  </div>

                  {/* Visual gauge bar */}
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-500 ${isMajor ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (pothole.depth / 10) * 100)}%` }}
                    />
                    {/* 5cm line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-rose-600" title="5cm Threshold" />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0 cm (Flat)</span>
                    <span className="text-rose-600 font-bold">5.0 cm Limit</span>
                    <span>10.0+ cm</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 bg-white p-2 rounded-lg border border-slate-200">
                {isMajor 
                  ? '⚠️ Depth exceeds 5.0 cm limit. Automatic sand filling suppressed for road integrity.' 
                  : '✅ Depth is within 5.0 cm range. Successfully filled via MG996R servo dispenser.'}
              </p>
            </div>

          </div>

          {/* Inspection / Field Notes (if any) */}
          {pothole.inspectionNotes && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Field Inspection & Repair Notes:</span>
              </div>
              <p className="text-xs text-slate-700 font-sans italic bg-white p-3 rounded-lg border border-slate-200">
                "{pothole.inspectionNotes}"
              </p>
              <div className="text-[11px] text-slate-500 flex justify-between font-mono pt-1">
                <span>Inspector: {pothole.inspectorName || 'Operator'}</span>
                {pothole.inspectedAt && <span>Date: {new Date(pothole.inspectedAt).toLocaleString()}</span>}
              </div>
            </div>
          )}

          {/* Detection Event Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Event Timeline</span>
            </h4>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
              {pothole.timeline && pothole.timeline.length > 0 ? (
                pothole.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-bold text-slate-900">{event.title}</p>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{event.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Standard real-time telemetry events recorded.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>

          {isMajor && pothole.status === 'MANUAL_INSPECTION_REQUIRED' && onOpenInspection && (
            <button
              onClick={() => {
                onClose();
                onOpenInspection(pothole);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Proceed to Manual Inspection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
