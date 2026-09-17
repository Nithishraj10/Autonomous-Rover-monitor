import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { Pothole } from '../../types/pothole';

interface PotholeTableProps {
  onSelectPothole: (pothole: Pothole) => void;
  onInspectPothole?: (pothole: Pothole) => void;
}

export const PotholeTable: React.FC<PotholeTableProps> = ({ onSelectPothole, onInspectPothole }) => {
  const { filteredPotholes, activeFilter, setActiveFilter, searchQuery, setSearchQuery } = useRover();
  
  // Sort State
  const [sortField, setSortField] = useState<'timestamp' | 'depth' | 'id'>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Sorting
  const sortedPotholes = useMemo(() => {
    return [...filteredPotholes].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      
      if (sortField === 'timestamp') {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredPotholes, sortField, sortAsc]);

  // Paginated chunk
  const totalPages = Math.max(1, Math.ceil(sortedPotholes.length / itemsPerPage));
  const paginatedItems = sortedPotholes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: 'timestamp' | 'depth' | 'id') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Pothole ID', 'Timestamp', 'Severity', 'Depth (cm)', 'Latitude', 'Longitude', 'Rover ID', 'Status', 'Repair Method', 'Inspector Notes'];
    const rows = filteredPotholes.map(p => [
      p.id,
      p.timestamp,
      p.severity,
      p.depth,
      p.latitude,
      p.longitude,
      p.roverId,
      p.status,
      p.repairMethod,
      `"${(p.inspectionNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pothole_patrol_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Top Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, coordinates, status, or rover..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>

        {/* Filter Pills & Export */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs">
            {['all', 'minor', 'major', 'filled', 'inspection', 'repaired'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => {
                  setActiveFilter(filterKey);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all capitalize ${
                  activeFilter === filterKey
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filterKey === 'inspection' ? 'Inspection' : filterKey}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                onClick={() => toggleSort('id')}
              >
                <div className="flex items-center gap-1">
                  <span>Pothole ID</span>
                  {sortField === 'id' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                onClick={() => toggleSort('timestamp')}
              >
                <div className="flex items-center gap-1">
                  <span>Detected Time</span>
                  {sortField === 'timestamp' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-4">Severity</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                onClick={() => toggleSort('depth')}
              >
                <div className="flex items-center gap-1">
                  <span>Depth</span>
                  {sortField === 'depth' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-4">Coordinates</th>
              <th className="py-3 px-4">Rover</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No pothole records match your search or filter criteria.
                </td>
              </tr>
            ) : (
              paginatedItems.map((pothole) => {
                const isMajor = pothole.severity === 'major';
                const isFilled = pothole.status === 'FILLED';
                const isRepaired = pothole.status === 'REPAIRED';
                const isInspected = pothole.status === 'INSPECTED';

                return (
                  <tr 
                    key={pothole.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {pothole.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                      <div>{new Date(pothole.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-[11px] text-slate-400">{new Date(pothole.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isMajor 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {isMajor ? <AlertTriangle className="w-3 h-3 text-amber-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {pothole.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {pothole.depth.toFixed(1)} cm
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600">
                      {pothole.latitude.toFixed(4)}° N, {pothole.longitude.toFixed(4)}° E
                    </td>
                    <td className="py-3 px-4 font-semibold text-xs text-blue-600 font-mono">
                      {pothole.roverId}
                    </td>
                    <td className="py-3 px-4">
                      {isFilled && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Filled
                        </span>
                      )}
                      {pothole.status === 'MANUAL_INSPECTION_REQUIRED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Inspection Required
                        </span>
                      )}
                      {isInspected && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          Inspected
                        </span>
                      )}
                      {isRepaired && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          Repaired
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pothole.status === 'MANUAL_INSPECTION_REQUIRED' && onInspectPothole && (
                          <button
                            onClick={() => onInspectPothole(pothole)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                          >
                            Inspect
                          </button>
                        )}
                        <button
                          onClick={() => onSelectPothole(pothole)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs text-slate-600">
        <div>
          Showing <span className="font-semibold text-slate-900">{paginatedItems.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{sortedPotholes.length}</span> records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
