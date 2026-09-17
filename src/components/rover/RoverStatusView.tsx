import React from 'react';
import { 
  Bot, 
  Wifi, 
  WifiOff, 
  Camera, 
  Waves, 
  Cpu, 
  Zap, 
  Navigation, 
  Layers, 
  Gauge, 
  Thermometer, 
  Battery, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useRover } from '../../context/RoverContext';
import { SimulationControlBar } from '../dashboard/SimulationControlBar';

export const RoverStatusView: React.FC = () => {
  const { telemetry, syncOfflineQueue } = useRover();
  const hw = telemetry.hardware;

  return (
    <div className="space-y-6">
      
      {/* Simulation & Test Control Bar */}
      <SimulationControlBar />

      {/* Main Telemetry Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Bot className="w-9 h-9 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black tracking-tight font-mono">
                  {telemetry.roverId}
                </h2>
                <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full border ${
                  telemetry.isOnline 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {telemetry.isOnline ? '● ONLINE' : '○ OFFLINE'}
                </span>
                <span className="text-xs uppercase font-mono bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/30">
                  {telemetry.currentActivity}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Autonomous Campus Patrol Rover Unit 1</span>
                <span>•</span>
                <span className="text-slate-300 font-mono">FW: v2.4.1-pi4</span>
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">WiFi Link</span>
              <span className={`font-bold flex items-center gap-1.5 mt-0.5 ${telemetry.wifiConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                {telemetry.wifiConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {telemetry.wifiConnected ? `${telemetry.wifiSignalDbm} dBm` : 'Buffering'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">GPS Fix</span>
              <span className="font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
                <Navigation className="w-3.5 h-3.5" />
                {hw.gpsModule.status} ({hw.gpsModule.satellitesConnected} Sats)
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">Battery</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Battery className="w-3.5 h-3.5" />
                {hw.motorDriver.batteryVoltageVolts}V ({hw.motorDriver.batteryPercentage}%)
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-sans block uppercase">Pi Temp</span>
              <span className="font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                <Thermometer className="w-3.5 h-3.5" />
                {hw.raspberryPi.tempCelsius}°C
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Hardware Modules Grid (All 6 core modules from engineering specs) */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>Embedded Hardware Subsystems</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Module 1: Raspberry Pi 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Central Computing</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{hw.raspberryPi.model}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {hw.raspberryPi.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">CPU Usage:</span>
                <span className="font-bold text-slate-800">{hw.raspberryPi.cpuUsagePercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${hw.raspberryPi.cpuUsagePercent}%` }} />
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">RAM Usage:</span>
                <span className="font-bold text-slate-800">{hw.raspberryPi.ramUsagePercent}% (1.76 / 4 GB)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${hw.raspberryPi.ramUsagePercent}%` }} />
              </div>

              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-sans">Uptime:</span>
                <span className="text-slate-700">{Math.floor(hw.raspberryPi.uptimeSeconds / 3600)}h {Math.floor((hw.raspberryPi.uptimeSeconds % 3600) / 60)}m</span>
              </div>
            </div>
          </div>

          {/* Module 2: Pi Camera Module 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Vision & AI Inference</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{hw.camera.model}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {hw.camera.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Stream Mode:</span>
                <span className="font-bold text-slate-800">{hw.camera.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Frame Rate:</span>
                <span className="font-bold text-emerald-600">{hw.camera.fps} FPS Locked</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">CNN Backbone:</span>
                <span className="font-bold text-blue-600 text-[11px]">MobileNetV2 + EffNet</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-sans">Inference Pipeline:</span>
                <span className="text-emerald-700 font-semibold">Edge TensorFlow Lite</span>
              </div>
            </div>
          </div>

          {/* Module 3: HC-SR04 Ultrasonic Sensor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Depth Measurement</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{hw.ultrasonicSensor.model}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {hw.ultrasonicSensor.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Last Depth Pulse:</span>
                <span className="font-bold text-slate-800">{hw.ultrasonicSensor.lastMeasuredDepthCm.toFixed(1)} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Echo Sampling Rate:</span>
                <span className="font-bold text-slate-800">{hw.ultrasonicSensor.sampleRateHz} Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Measurement Precision:</span>
                <span className="font-bold text-cyan-700">±{hw.ultrasonicSensor.accuracyMm} mm</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-sans">Threshold Rule:</span>
                <span className="text-slate-800 font-bold">&lt; 5cm (Minor) / ≥ 5cm (Major)</span>
              </div>
            </div>
          </div>

          {/* Module 4: MG996R Servo Sand Dispenser */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Automated Sand Dispenser</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{hw.sandDispenser.model}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hw.sandDispenser.status === 'DISPENSING' ? 'bg-blue-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {hw.sandDispenser.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Sand Hopper Level:</span>
                <span className="font-bold text-slate-800">{hw.sandDispenser.hopperCapacityPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${hw.sandDispenser.hopperCapacityPercent}%` }} />
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Servo Stroke Duration:</span>
                <span className="font-bold text-slate-800">{hw.sandDispenser.dispensingDurationSec}s (90° Gate)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-sans">Total Auto-Fills Done:</span>
                <span className="font-bold text-emerald-600">{hw.sandDispenser.totalFillsExecuted} events</span>
              </div>
            </div>
          </div>

          {/* Module 5: GPS NEO Module */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">GPS Geolocation</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{hw.gpsModule.model}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {hw.gpsModule.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Latitude:</span>
                <span className="font-bold text-slate-800">{telemetry.currentLocation.latitude.toFixed(6)}° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Longitude:</span>
                <span className="font-bold text-slate-800">{telemetry.currentLocation.longitude.toFixed(6)}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">HDOP Dilution:</span>
                <span className="font-bold text-emerald-600">{hw.gpsModule.hdop} (High Precision)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-sans">Altitude:</span>
                <span className="text-slate-800 font-bold">{hw.gpsModule.altitudeMeters}m MSL</span>
              </div>
            </div>
          </div>

          {/* Module 6: L298N Motor Driver */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Locomotion & Powertrain</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{hw.motorDriver.model}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {hw.motorDriver.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Patrol Speed:</span>
                <span className="font-bold text-slate-800">{hw.motorDriver.patrolSpeedMps} m/s (2.3 km/h)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Motor PWM Duty:</span>
                <span className="font-bold text-blue-600">65% (Differential Drive)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">LiPo Voltage:</span>
                <span className="font-bold text-emerald-600">{hw.motorDriver.batteryVoltageVolts} V (3S 2200mAh)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-sans">Thermal Protection:</span>
                <span className="text-emerald-700 font-semibold">Normal (34°C)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
