import React, { useState } from 'react';
import { X, ClipboardCheck, Wrench, CheckCircle } from 'lucide-react';
import { Pothole } from '../../types/pothole';

interface InspectionNotesModalProps {
  pothole: Pothole | null;
  targetAction: 'INSPECT' | 'REPAIR' | null;
  onClose: () => void;
  onSubmit: (notes: string, inspectorName: string, repairMethod: Pothole['repairMethod']) => void;
}

export const InspectionNotesModal: React.FC<InspectionNotesModalProps> = ({
  pothole,
  targetAction,
  onClose,
  onSubmit
}) => {
  const [notes, setNotes] = useState('');
  const [inspectorName, setInspectorName] = useState('Campus Ops Eng');
  const [repairMethod, setRepairMethod] = useState<Pothole['repairMethod']>(
    targetAction === 'REPAIR' ? 'MANUAL_ASPHALT_PATCH' : 'MANUAL_INSPECTION'
  );

  if (!pothole || !targetAction) return null;

  const isRepair = targetAction === 'REPAIR';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(notes, inspectorName, repairMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isRepair ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
              {isRepair ? <Wrench className="w-5 h-5" /> : <ClipboardCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isRepair ? `Mark Pothole as Repaired (${pothole.id})` : `Inspection Log for ${pothole.id}`}
              </h3>
              <p className="text-xs text-slate-500">
                Depth: {pothole.depth} cm | GPS: {pothole.latitude.toFixed(4)}° N, {pothole.longitude.toFixed(4)}° E
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspector / Engineer Name
            </label>
            <input
              type="text"
              required
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Eng. R. Sharma"
            />
          </div>

          {isRepair && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Repair Method Used
              </label>
              <select
                value={repairMethod}
                onChange={(e) => setRepairMethod(e.target.value as Pothole['repairMethod'])}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="MANUAL_ASPHALT_PATCH">Manual Asphalt Patch / Cold Bitumen</option>
                <option value="MANUAL_INSPECTION">Structural Base Compacted</option>
                <option value="AUTOMATIC_SAND_DISPENSING">Fine Aggregate Leveling</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Notes / Observations (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRepair ? "e.g. Cold mix applied and compacted. Surface leveled." : "e.g. Visual verification confirmed severe edge cracking. Scheduled for Friday repair."}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 ${
                isRepair ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isRepair ? <CheckCircle className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
              <span>{isRepair ? 'Confirm Repaired' : 'Save Inspection'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
