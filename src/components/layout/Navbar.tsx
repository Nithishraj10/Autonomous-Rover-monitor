import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Wifi, 
  WifiOff, 
  Clock, 
  Bell, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';

interface NavbarProps {
  currentView: string;
  onNavigateLanding: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigateLanding, onOpenNotifications }) => {
  const { telemetry, latestAlert, syncOfflineQueue, alertsHistory } = useRover();
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (telemetry.lastSyncTimestamp) {
        const diff = Math.max(0, Math.floor((Date.now() - new Date(telemetry.lastSyncTimestamp).getTime()) / 1000));
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [telemetry.lastSyncTimestamp]);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateLanding}
            className="flex items-center gap-3 text-left group transition-all"
            title="Return to Project Overview"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Pothole Rover
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  IoT v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Pothole Monitoring & Filling System
              </p>
            </div>
          </button>

          <div className="hidden lg:flex items-center text-xs text-slate-500 pl-4 border-l border-slate-800">
            <span>View:</span>
            <span className="ml-1.5 font-medium text-slate-300 capitalize">{currentView.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Right: Rover Telemetry State & Status indicators */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Rover Connection Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            telemetry.isOnline 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-sm' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              {telemetry.isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${telemetry.isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span>{telemetry.isOnline ? '● Rover Online' : '○ Rover Offline'}</span>
          </div>

          {/* WiFi & Sync Status */}
          <div className="hidden md:flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-slate-300">
            {telemetry.wifiConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-300 font-mono">WiFi Connected ({telemetry.wifiSignalDbm} dBm)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Waiting for connection</span>
              </>
            )}
          </div>

          {/* Last Sync Time */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/50 border border-slate-700/40 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last Sync:</span>
            <span className="font-mono text-slate-200">
              {telemetry.wifiConnected 
                ? (secondsAgo < 5 ? 'Just now' : `${secondsAgo} sec ago`)
                : 'Offline'}
            </span>
          </div>

          {/* Unsynced queue badge if offline detections exist */}
          {telemetry.unsyncedRecordsCount > 0 && (
            <button 
              onClick={syncOfflineQueue}
              className="flex items-center gap-1.5 text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-500/30 transition-colors animate-pulse"
              title="Click to manually synchronize offline records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{telemetry.unsyncedRecordsCount} Pending Sync</span>
            </button>
          )}

          {/* Notification icon */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Detection and System Alerts"
          >
            <Bell className="w-4 h-4" />
            {alertsHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
                {alertsHistory.length > 9 ? '9+' : alertsHistory.length}
              </span>
            )}
          </button>

          {/* Landing page link */}
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Overview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Profile / Admin Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              OP
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <p className="font-medium text-slate-200">Admin Operator</p>
              <p className="text-[10px] text-slate-400">Campus Patrol Dept</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
