import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Eye, 
  Filter, 
  Bot, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { Pothole } from '../../types/pothole';
import { InspectionNotesModal } from './InspectionNotesModal';

interface InspectionQueueViewProps {
  onOpenMapLocation: (pothole: Pothole) => void;
  onSelectPothole: (pothole: Pothole) => void;
}

export const InspectionQueueView: React.FC<InspectionQueueViewProps> = ({
  onOpenMapLocation,
  onSelectPothole
}) => {
  const { potholes, updatePotholeStatus } = useRover();
  
  // Filter for Major severity potholes only
  const majorPotholes = potholes.filter(p => p.severity === 'major');
  
  // Sub-filter tabs
  const [subFilter, setSubFilter] = useState<'pending' | 'inspected' | 'repaired' | 'all'>('pending');
  
  // Modal target state
  const [modalTarget, setModalTarget] = useState<{
    pothole: Pothole;
    action: 'INSPECT' | 'REPAIR';
  } | null>(null);

  const displayedPotholes = majorPotholes.filter(p => {
    if (subFilter === 'pending') return p.status === 'MANUAL_INSPECTION_REQUIRED';
    if (subFilter === 'inspected') return p.status === 'INSPECTED';
    if (subFilter === 'repaired') return p.status === 'REPAIRED';
    return true;
  });

  const pendingCount = majorPotholes.filter(p => p.status === 'MANUAL_INSPECTION_REQUIRED').length;
  const inspectedCount = majorPotholes.filter(p => p.status === 'INSPECTED').length;
  const repairedCount = majorPotholes.filter(p => p.status === 'REPAIRED').length;

  const handleModalSubmit = async (notes: string, inspectorName: string, repairMethod: Pothole['repairMethod']) => {
    if (!modalTarget) return;
    const { pothole, action } = modalTarget;
    
    if (action === 'INSPECT') {
      await updatePotholeStatus(pothole.id, 'INSPECTED', { notes, inspectorName });
    } else if (action === 'REPAIR') {
      await updatePotholeStatus(pothole.id, 'REPAIRED', { notes, inspectorName, repairMethod });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-2xl p-6 text-slate-950 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-950/20 backdrop-blur-sm rounded-2xl text-slate-950">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                  Manual Inspection Required
                </h2>
                <span className="bg-slate-950 text-amber-400 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {pendingCount} Major Potholes
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-amber-950/80 mt-1">
                Ultrasonic depth exceeds the 5.0 cm automated sand dispensing limit. Field verification and road crew dispatch required.
              </p>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2 bg-slate-950/10 p-2 rounded-xl backdrop-blur-sm">
            <div className="text-center px-3 py-1 bg-white/70 rounded-lg">
              <span className="block font-mono text-lg font-bold text-slate-900">{pendingCount}</span>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Pending</span>
            </div>
            <div className="text-center px-3 py-1 bg-white/70 rounded-lg">
              <span className="block font-mono text-lg font-bold text-purple-900">{inspectedCount}</span>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Inspected</span>
            </div>
            <div className="text-center px-3 py-1 bg-white/70 rounded-lg">
              <span className="block font-mono text-lg font-bold text-blue-900">{repairedCount}</span>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">Repaired</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'pending', label: `Pending Triage (${pendingCount})` },
          { id: 'inspected', label: `Inspected (${inspectedCount})` },
          { id: 'repaired', label: `Repaired (${repairedCount})` },
          { id: 'all', label: `All Major (${majorPotholes.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              subFilter === tab.id
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inspection Cards Grid */}
      {displayedPotholes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Potholes in This Queue</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All major potholes for this filter state have been processed, or none have been logged yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPotholes.map((pothole) => {
            const isPending = pothole.status === 'MANUAL_INSPECTION_REQUIRED';
            const isInspected = pothole.status === 'INSPECTED';
            const isRepaired = pothole.status === 'REPAIRED';

            return (
              <div
                key={pothole.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isPending ? 'border-amber-300 ring-1 ring-amber-200' :
                  isInspected ? 'border-purple-200 bg-purple-50/20' : 'border-blue-200 bg-blue-50/20'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-slate-900">{pothole.id}</span>
                        <span className="text-[10px] uppercase font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                          MAJOR
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-blue-600" />
                        Rover: <strong className="font-mono text-slate-700">{pothole.roverId}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-xl text-amber-600">
                        {pothole.depth.toFixed(1)} <span className="text-xs font-normal text-slate-500">cm</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Ultrasonic Depth
                      </span>
                    </div>
                  </div>

                  {/* GPS & Detected Time */}
                  <div className="space-y-2 text-xs text-slate-600 font-mono mb-4">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 font-sans block text-[10px]">GPS Coordinates:</span>
                        <span className="font-semibold text-slate-800">{pothole.latitude.toFixed(4)}° N, {pothole.longitude.toFixed(4)}° E</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 font-sans block text-[10px]">Detection Timestamp:</span>
                        <span>{new Date(pothole.timestamp).toLocaleDateString()} at {new Date(pothole.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="mb-4">
                    <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                      isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      isInspected ? 'bg-purple-50 text-purple-800 border-purple-200' :
                      'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      <span>Status:</span>
                      <span className="uppercase tracking-tight font-bold font-mono">
                        {pothole.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    
                    {pothole.inspectionNotes && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200 mt-2">
                        "{pothole.inspectionNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenMapLocation(pothole)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Open Location</span>
                    </button>

                    <button
                      onClick={() => onSelectPothole(pothole)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>

                  {/* Inspection & Repair Execution */}
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setModalTarget({ pothole, action: 'INSPECT' })}
                        className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>Mark Inspected</span>
                      </button>

                      <button
                        onClick={() => setModalTarget({ pothole, action: 'REPAIR' })}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Mark Repaired</span>
                      </button>
                    </div>
                  )}

                  {isInspected && (
                    <button
                      onClick={() => setModalTarget({ pothole, action: 'REPAIR' })}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Complete Repair (Mark Repaired)</span>
                    </button>
                  )}

                  {isRepaired && (
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Repaired on {pothole.repairedAt ? new Date(pothole.repairedAt).toLocaleDateString() : 'Record'}</span>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal for inspection notes & repair logging */}
      <InspectionNotesModal
        pothole={modalTarget?.pothole || null}
        targetAction={modalTarget?.action || null}
        onClose={() => setModalTarget(null)}
        onSubmit={handleModalSubmit}
      />

    </div>
  );
};
