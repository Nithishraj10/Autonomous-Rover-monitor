import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Layers, 
  Waves, 
  CheckCircle2, 
  AlertTriangle, 
  Bot, 
  Calendar 
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';

export const AnalyticsView: React.FC = () => {
  const { potholes, stats } = useRover();

  // Depth Distribution Groups
  const depthGroups = [
    { range: '< 3.0 cm', count: potholes.filter(p => p.depth < 3.0).length, color: 'bg-emerald-400', label: 'Shallow Minor' },
    { range: '3.0 - 4.9 cm', count: potholes.filter(p => p.depth >= 3.0 && p.depth < 5.0).length, color: 'bg-emerald-600', label: 'Standard Minor (Auto-Fill)' },
    { range: '5.0 - 7.0 cm', count: potholes.filter(p => p.depth >= 5.0 && p.depth < 7.0).length, color: 'bg-amber-500', label: 'Major (Manual Inspection)' },
    { range: '> 7.0 cm', count: potholes.filter(p => p.depth >= 7.0).length, color: 'bg-rose-500', label: 'Severe Major (Deep Crater)' },
  ];

  const maxDepthCount = Math.max(1, ...depthGroups.map(d => d.count));

  // Daily Trend Grouping
  const daysMap: Record<string, { total: number; minor: number; major: number }> = {};
  potholes.forEach(p => {
    const day = new Date(p.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (!daysMap[day]) {
      daysMap[day] = { total: 0, minor: 0, major: 0 };
    }
    daysMap[day].total++;
    if (p.severity === 'minor') daysMap[day].minor++;
    else daysMap[day].major++;
  });

  const dailyEntries = Object.entries(daysMap).slice(-7);
  const maxDayTotal = Math.max(1, ...dailyEntries.map(([_, v]) => v.total));

  // Minor vs Major Percentage
  const minorPercent = stats.total > 0 ? Math.round((stats.minor / stats.total) * 100) : 0;
  const majorPercent = stats.total > 0 ? 100 - minorPercent : 0;

  // Filled vs Pending Inspection Percentage
  const filledPercent = stats.total > 0 ? Math.round((stats.filled / stats.total) * 100) : 0;
  const inspectionPercent = stats.total > 0 ? Math.round((stats.inspectionRequired / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Pothole Telemetry & Repair Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Quantitative data insights from campus patrol runs, ultrasonic depth distribution, and resolution performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Avg Depth:</span>
          <strong className="text-slate-900">{stats.avgDepth} cm</strong>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Total Anomalies</span>
          <div className="font-mono text-3xl font-extrabold text-slate-900">{stats.total}</div>
          <span className="text-[11px] text-emerald-600 font-medium">100% geo-mapped</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Minor Auto-Filled</span>
          <div className="font-mono text-3xl font-extrabold text-emerald-600">{stats.minor}</div>
          <span className="text-[11px] text-slate-500">{minorPercent}% of all detections</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Major Triage</span>
          <div className="font-mono text-3xl font-extrabold text-amber-600">{stats.major}</div>
          <span className="text-[11px] text-slate-500">{majorPercent}% requires road crew</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Repairs Resolved</span>
          <div className="font-mono text-3xl font-extrabold text-blue-600">{stats.filled}</div>
          <span className="text-[11px] text-slate-500">{filledPercent}% surface resolved</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Potholes Detected Per Day */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Detections Per Day</h3>
              <p className="text-xs text-slate-500">Breakdown of Minor and Major potholes recorded daily</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {dailyEntries.map(([day, val]) => {
              const heightPercent = Math.round((val.total / maxDayTotal) * 100);
              const minorHeight = val.total > 0 ? (val.minor / val.total) * 100 : 0;
              const majorHeight = val.total > 0 ? (val.major / val.total) * 100 : 0;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val.total}
                  </div>
                  
                  {/* Stacked bar */}
                  <div 
                    className="w-full max-w-[36px] bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end transition-all hover:brightness-110 shadow-sm"
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                  >
                    <div className="bg-amber-500 w-full" style={{ height: `${majorHeight}%` }} title={`Major: ${val.major}`} />
                    <div className="bg-emerald-500 w-full" style={{ height: `${minorHeight}%` }} title={`Minor: ${val.minor}`} />
                  </div>

                  <span className="text-[11px] font-medium text-slate-500 truncate">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-emerald-500" /> Minor (&lt;5cm)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-amber-500" /> Major (≥5cm)
            </span>
          </div>
        </div>

        {/* Chart 2: Ultrasonic Depth Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Depth Distribution Histogram</h3>
              <p className="text-xs text-slate-500">HC-SR04 ultrasonic sensor range classification</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">Threshold 5.0cm</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {depthGroups.map(group => {
              const pct = stats.total > 0 ? Math.round((group.count / stats.total) * 100) : 0;

              return (
                <div key={group.range} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{group.range} ({group.label})</span>
                    <span className="font-mono text-slate-600">{group.count} potholes ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${group.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(5, (group.count / maxDepthCount) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-sans mt-3">
            💡 <strong>Engineering Note:</strong> Detections beneath 5.0 cm are leveled autonomously on-site via the MG996R servo-driven sand hopper.
          </div>
        </div>

        {/* Chart 3: Minor vs Major Severity Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Severity Classification Split</h3>
            <p className="text-xs text-slate-500">Ratio of minor depressions to major hazards</p>
          </div>

          <div className="flex items-center gap-6 py-4">
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-700">Minor Severity ({stats.minor})</span>
                  <span className="font-mono font-bold text-emerald-700">{minorPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${minorPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-700">Major Severity ({stats.major})</span>
                  <span className="font-mono font-bold text-amber-700">{majorPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${majorPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Repair Status Resolution Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Repair Status Breakdown</h3>
            <p className="text-xs text-slate-500">Filled vs Inspection Required vs Manual Repaired</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Auto-Filled</span>
              <span className="font-mono font-extrabold text-2xl text-emerald-600 block mt-1">{stats.minor}</span>
              <span className="text-[10px] text-emerald-700">By Sand Hopper</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Inspection Req.</span>
              <span className="font-mono font-extrabold text-2xl text-amber-600 block mt-1">{stats.inspectionRequired}</span>
              <span className="text-[10px] text-amber-700">Pending Field Team</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Manual Repaired</span>
              <span className="font-mono font-extrabold text-2xl text-blue-600 block mt-1">{stats.repaired}</span>
              <span className="text-[10px] text-blue-700">Cold Bitumen / Patch</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
