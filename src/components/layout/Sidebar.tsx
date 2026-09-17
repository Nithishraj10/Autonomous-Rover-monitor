import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Bot, 
  ClipboardCheck, 
  History, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Radio,
  Server,
  Activity,
  Cpu
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';

export type NavView = 
  | 'dashboard' 
  | 'map' 
  | 'potholes' 
  | 'rover-status' 
  | 'inspection' 
  | 'history' 
  | 'analytics' 
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse
}) => {
  const { stats, telemetry } = useRover();

  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map' as NavView, label: 'Live Map', icon: MapPin },
    { id: 'potholes' as NavView, label: 'Potholes', icon: AlertTriangle, badge: stats.total },
    { id: 'rover-status' as NavView, label: 'Rover Status', icon: Bot, pulse: telemetry.isOnline },
    { 
      id: 'inspection' as NavView, 
      label: 'Inspection Queue', 
      icon: ClipboardCheck, 
      badge: stats.inspectionRequired, 
      badgeColor: 'bg-amber-500 text-slate-950 font-bold' 
    },
    { id: 'history' as NavView, label: 'Detection History', icon: History },
    { id: 'analytics' as NavView, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`sticky top-[57px] h-[calc(100vh-57px)] bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-all duration-300 z-20 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="p-3 space-y-1">
        {/* Collapse toggle button */}
        <div className={`flex items-center pb-3 border-b border-slate-800/80 mb-2 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!isCollapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  {item.pulse && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-slate-100 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700">
                    {item.label}
                    {item.badge !== undefined && ` (${item.badge})`}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!isCollapsed ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              <span>System Status</span>
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Server className="w-3 h-3 text-slate-400" />
                  Backend Engine
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Radio className="w-3 h-3 text-slate-400" />
                  Rover Radio
                </span>
                <span className={`flex items-center gap-1 ${telemetry.wifiConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${telemetry.wifiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {telemetry.wifiConnected ? 'Synced' : 'Buffering'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="flex items-center gap-1 text-[10px]">
                  <Cpu className="w-3 h-3 text-slate-400" />
                  RPi4 Temp
                </span>
                <span className="text-slate-200">{telemetry.hardware.raspberryPi.tempCelsius}°C</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" title="Backend Online" />
            <div className={`w-3 h-3 rounded-full ${telemetry.wifiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} title={telemetry.wifiConnected ? "Rover WiFi Connected" : "Rover Offline / Buffering"} />
          </div>
        )}
      </div>
    </aside>
  );
};
