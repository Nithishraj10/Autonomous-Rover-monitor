import React, { useState } from 'react';
import { 
  History, 
  Calendar, 
  Search, 
  Filter, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Eye, 
  Clock,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { Pothole } from '../../types/pothole';

interface DetectionHistoryViewProps {
  onSelectPothole: (pothole: Pothole) => void;
}

export const DetectionHistoryView: React.FC<DetectionHistoryViewProps> = ({ onSelectPothole }) => {
  const { potholes } = useRover();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'minor' | 'major'>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  const filtered = potholes.filter(p => {
    const matchesSearch = !searchTerm || 
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.inspectionNotes && p.inspectionNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'all' || p.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Rover Patrol & Detection History
            </h2>
            <p className="text-xs text-slate-500">
              Chronological log of all road anomalies detected, ultrasonic depth readings, and automatic/manual interventions.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'timeline' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            Visual Timeline
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            Audit Table
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-semibold mr-1">Severity:</span>
          {(['all', 'minor', 'major'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'timeline' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="relative pl-8 border-l-2 border-blue-200 space-y-8">
            {filtered.map((pothole) => {
              const isMajor = pothole.severity === 'major';
              const isFilled = pothole.status === 'FILLED';
              const isRepaired = pothole.status === 'REPAIRED';

              return (
                <div key={pothole.id} className="relative group">
                  {/* Timeline node icon */}
                  <span className={`absolute -left-[45px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white ${
                    isMajor ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}>
                    {isMajor ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  </span>

                  {/* Log card */}
                  <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{pothole.id}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          isMajor ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {pothole.severity} Severity ({pothole.depth.toFixed(1)} cm)
                        </span>
                        <span className="text-xs text-blue-600 font-mono font-semibold">
                          {pothole.roverId}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(pothole.timestamp).toLocaleDateString()} at {new Date(pothole.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-mono mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-sans block">GPS Fix</span>
                        <span>{pothole.latitude.toFixed(5)}° N, {pothole.longitude.toFixed(5)}° E</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-sans block">Intervention</span>
                        <span className="font-sans font-medium text-slate-800">
                          {pothole.repairMethod.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-sans block">Status</span>
                        <span className={`font-semibold ${isFilled ? 'text-emerald-700' : isRepaired ? 'text-blue-700' : 'text-amber-700'}`}>
                          {pothole.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {pothole.inspectionNotes && (
                      <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mb-3">
                        "{pothole.inspectionNotes}" — <span className="font-semibold">{pothole.inspectorName || 'Inspector'}</span>
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => onSelectPothole(pothole)}
                        className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Log Details</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase text-[10px]">
                <th className="p-3">ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Depth</th>
                <th className="p-3">GPS Location</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{p.id}</td>
                  <td className="p-3 text-slate-600">{new Date(p.timestamp).toLocaleString()}</td>
                  <td className="p-3 uppercase font-bold text-[10px]">{p.severity}</td>
                  <td className="p-3 font-bold">{p.depth} cm</td>
                  <td className="p-3">{p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}</td>
                  <td className="p-3 font-sans font-semibold text-slate-800">{p.status}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectPothole(p)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
