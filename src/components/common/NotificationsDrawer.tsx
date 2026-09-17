import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Info, Clock, Trash2 } from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { Pothole } from '../../types/pothole';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPotholeById?: (potholeId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPotholeById
}) => {
  const { alertsHistory } = useRover();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">System & Detection Alerts</h3>
                <p className="text-[11px] text-slate-500 font-mono">Real-time IoT telemetry log</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {alertsHistory.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No alerts logged in this session yet.
              </div>
            ) : (
              alertsHistory.map((alert) => {
                const isAlert = alert.type === 'alert';
                const isWarning = alert.type === 'warning';
                const isSuccess = alert.type === 'success';

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      isAlert ? 'bg-amber-50/60 border-amber-200' :
                      isWarning ? 'bg-orange-50/60 border-orange-200' :
                      isSuccess ? 'bg-emerald-50/60 border-emerald-200' :
                      'bg-blue-50/60 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isAlert && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                        {isWarning && <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />}
                        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {!isAlert && !isWarning && !isSuccess && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
                        <span className="text-slate-900">{alert.title}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    {alert.potholeId && onSelectPotholeById && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectPotholeById(alert.potholeId!);
                        }}
                        className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline block"
                      >
                        Inspect {alert.potholeId} Details →
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
