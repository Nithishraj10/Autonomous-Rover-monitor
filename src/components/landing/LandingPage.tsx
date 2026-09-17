import React from 'react';
import { 
  Bot, 
  MapPin, 
  Layers, 
  Cpu, 
  Camera, 
  Waves, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  LayoutDashboard, 
  Sparkles,
  ShieldCheck,
  Radio,
  ExternalLink,
  ChevronRight,
  Activity
} from 'lucide-react';
import { WorkflowDiagram } from '../dashboard/WorkflowDiagram';
import { useRover } from '../../context/RoverContext';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenMap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDashboard, onOpenMap }) => {
  const { stats, telemetry } = useRover();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">Pothole Rover</span>
              <span className="text-xs text-slate-400 block font-sans">Engineering IoT Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ROVER-01 Online ({stats.total} Potholes Mapped)</span>
            </div>

            <button
              onClick={onOpenDashboard}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Enter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Robotics & Campus Ground Maintenance
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase max-w-4xl mx-auto leading-tight">
          Autonomous Pothole Mapping &amp; Automated Filling System
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed font-light">
          An autonomous robotic platform designed to detect road depressions, classify severity via ultrasonic depth profiling, automatically repair minor hazards, and stream real-time geospatial telemetry to an administrative IoT dashboard.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            onClick={onOpenDashboard}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 group active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open IoT Dashboard</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenMap}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 active:scale-95 shadow-md"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>View Campus Live Map</span>
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 text-left">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Detected</span>
            <div className="font-mono text-2xl font-bold text-white mt-1">{stats.total} Potholes</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Auto-Filled</span>
            <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">{stats.filled} Minor</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Inspection Queue</span>
            <div className="font-mono text-2xl font-bold text-amber-400 mt-1">{stats.inspectionRequired} Major</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Active Unit</span>
            <div className="font-mono text-2xl font-bold text-blue-400 mt-1">{telemetry.roverId}</div>
          </div>
        </div>
      </section>

      {/* System Architecture Flow Diagram */}
      <section className="bg-slate-900/50 border-y border-slate-800/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Autonomous Operation Cycle
            </h2>
            <p className="text-2xl font-bold text-white mt-1">
              End-to-End Robotics Decision Flow
            </p>
          </div>

          <WorkflowDiagram />
        </div>
      </section>

      {/* Hardware Architecture Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Embedded Hardware & AI Stack
          </h2>
          <p className="text-2xl font-bold text-white mt-1">
            Real Hardware Components of ROVER-01
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Raspberry Pi 4 (4GB)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Central computing hub executing real-time image processing, ultrasonic pulse timing, WiFi packet management, and offline SQL telemetry caching.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Pi Camera Module 3</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-resolution Sony IMX708 sensor powering MobileNetV2 + EfficientNet-B0 hybrid CNN feature extraction for rapid pothole contour identification.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">HC-SR04 Ultrasonic Sensor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Performs millimeter-accurate depth profiling to classify potholes into Minor (&lt;5.0 cm) or Major (≥5.0 cm) severity classes.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">MG996R Servo Sand Hopper</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-torque metal gear servo regulating automated sand dispensing for instant on-site leveling of minor potholes.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">GPS Neo Module</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logs precise latitude and longitude coordinates with sub-meter precision to accurately pinpoint anomalies on campus maps.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">L298N Motor Driver</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual H-bridge motor driver providing precise PWM speed control and autonomous differential steering across rugged campus terrains.
            </p>
          </div>

        </div>
      </section>

      {/* About Project Section */}
      <section className="bg-slate-900/60 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-left space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            About the Project
          </h2>
          <h3 className="text-2xl font-bold text-white">
            Smart Campus Infrastructure & Automated Road Quality Assurance
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The project addresses potholes and uneven surfaces in playground and campus areas. The rover autonomously patrols designated zones, detects potholes using computer vision, measures depth using ultrasonic sensing, automatically fills minor potholes with sand, and logs major pothole coordinates for manual inspection by maintenance teams.
          </p>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Autonomous Pothole Mapping & Automated Filling System • Engineering Demonstration Platform</p>
      </footer>

    </div>
  );
};
