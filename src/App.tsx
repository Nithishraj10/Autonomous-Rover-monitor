import React, { useState } from 'react';
import { 
  Bot, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Clock, 
  X, 
  ArrowRight,
  Eye,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { useRover } from './context/RoverContext';
import { Pothole } from './types/pothole';

// Layout & Views
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { StatCard } from './components/dashboard/StatCard';
import { SimulationControlBar } from './components/dashboard/SimulationControlBar';
import { WorkflowDiagram } from './components/dashboard/WorkflowDiagram';
import { LiveFeed } from './components/dashboard/LiveFeed';
import { CampusMap } from './components/map/CampusMap';
import { PotholeTable } from './components/potholes/PotholeTable';
import { PotholeDetailModal } from './components/potholes/PotholeDetailModal';
import { InspectionQueueView } from './components/inspection/InspectionQueueView';
import { InspectionNotesModal } from './components/inspection/InspectionNotesModal';
import { RoverStatusView } from './components/rover/RoverStatusView';
import { DetectionHistoryView } from './components/history/DetectionHistoryView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';

export function App() {
  const { 
    potholes, 
    stats, 
    telemetry, 
    selectedPothole, 
    setSelectedPothole, 
    latestAlert, 
    dismissAlert,
    setActiveFilter,
    updatePotholeStatus
  } = useRover();

  // Navigation state
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  
  // Quick map focus state
  const [focusedPotholeId, setFocusedPotholeId] = useState<string | null>(null);

  // Inspection modal state
  const [inspectModalPothole, setInspectModalPothole] = useState<Pothole | null>(null);

  const handleSelectPothole = (pothole: Pothole) => {
    setSelectedPothole(pothole);
  };

  const handleViewOnMap = (pothole: Pothole) => {
    setFocusedPotholeId(pothole.id);
    setCurrentView('map');
  };

  const handleOpenInspectionFromModal = (pothole: Pothole) => {
    setInspectModalPothole(pothole);
  };

  if (isLandingPage) {
    return (
      <LandingPage
        onOpenDashboard={() => {
          setIsLandingPage(false);
          setCurrentView('dashboard');
        }}
        onOpenMap={() => {
          setIsLandingPage(false);
          setCurrentView('map');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigateLanding={() => setIsLandingPage(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Floating Real-time Detection Toast Notification */}
      {latestAlert && (
        <div className="fixed top-16 right-4 z-50 max-w-sm w-full animate-slide-down">
          <div className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start justify-between gap-3 ${
            latestAlert.type === 'alert' 
              ? 'bg-amber-900/90 text-white border-amber-500' 
              : latestAlert.type === 'warning'
              ? 'bg-slate-900/95 text-amber-300 border-amber-500'
              : 'bg-slate-900/95 text-white border-emerald-500'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {latestAlert.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {latestAlert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span>{latestAlert.title}</span>
              </div>
              <p className="text-xs text-slate-200 leading-tight">
                {latestAlert.message}
              </p>
              {latestAlert.potholeId && (
                <button
                  onClick={() => {
                    dismissAlert();
                    const target = potholes.find(p => p.id === latestAlert.potholeId);
                    if (target) setSelectedPothole(target);
                  }}
                  className="mt-1 text-[11px] font-bold text-blue-300 hover:text-white underline block"
                >
                  View Pothole Details →
                </button>
              )}
            </div>

            <button
              onClick={dismissAlert}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace with Collapsible Sidebar */}
      <div className="flex flex-1">
        
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          
          {/* VIEW 1: DASHBOARD HOME */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Simulation Quick Bar */}
              <SimulationControlBar />

              {/* 6 Metric Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <StatCard
                  title="Total Potholes"
                  value={stats.total}
                  subtitle="All detected on grid"
                  icon={Layers}
                  variant="blue"
                  onClick={() => {
                    setActiveFilter('all');
                    setCurrentView('potholes');
                  }}
                />

                <StatCard
                  title="Minor Potholes"
                  value={stats.minor}
                  subtitle="Depth < 5.0 cm"
                  icon={CheckCircle2}
                  variant="emerald"
                  onClick={() => {
                    setActiveFilter('minor');
                    setCurrentView('potholes');
                  }}
                />

                <StatCard
                  title="Major Potholes"
                  value={stats.major}
                  subtitle="Depth ≥ 5.0 cm"
                  icon={AlertTriangle}
                  variant="amber"
                  onClick={() => {
                    setActiveFilter('major');
                    setCurrentView('inspection');
                  }}
                />

                <StatCard
                  title="Potholes Filled"
                  value={stats.filled}
                  subtitle="Auto & Repaired"
                  icon={FileCheck}
                  variant="purple"
                  onClick={() => {
                    setActiveFilter('filled');
                    setCurrentView('potholes');
                  }}
                />

                <StatCard
                  title="Inspection Req."
                  value={stats.inspectionRequired}
                  subtitle="Pending field crew"
                  icon={AlertTriangle}
                  variant="rose"
                  onClick={() => {
                    setCurrentView('inspection');
                  }}
                />

                <StatCard
                  title="Rover Status"
                  value={telemetry.isOnline ? 'Online' : 'Offline'}
                  subtitle={telemetry.wifiConnected ? 'WiFi Synced' : 'Buffering'}
                  icon={Bot}
                  variant={telemetry.isOnline ? 'emerald' : 'slate'}
                  pulse={telemetry.isOnline}
                  onClick={() => setCurrentView('rover-status')}
                />
              </div>

              {/* Workflow Pipeline Diagram */}
              <WorkflowDiagram />

              {/* Map & Live Feed Split Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Campus Map */}
                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Campus Patrol Map &amp; Severity Markers</span>
                    </h3>
                    <button
                      onClick={() => setCurrentView('map')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>Full Map View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <CampusMap
                    heightClass="h-[460px]"
                    focusPotholeId={focusedPotholeId}
                    onSelectPothole={handleSelectPothole}
                  />
                </div>

                {/* Right 1 Col: Live Rover Feed */}
                <div className="lg:col-span-1">
                  <LiveFeed
                    onSelectPothole={handleSelectPothole}
                    onViewOnMap={handleViewOnMap}
                  />
                </div>
              </div>

              {/* Recent Detections Preview Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Recent Anomalies Log
                  </h3>
                  <button
                    onClick={() => setCurrentView('potholes')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View All ({stats.total})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <PotholeTable
                  onSelectPothole={handleSelectPothole}
                  onInspectPothole={(p) => setInspectModalPothole(p)}
                />
              </div>

            </div>
          )}

          {/* VIEW 2: LIVE MAP FULL */}
          {currentView === 'map' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Campus Interactive Geolocation Map
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time GPS coordinate plotting with ultrasonic depth classification markers and live rover position.
                  </p>
                </div>
              </div>
              <CampusMap
                heightClass="h-[75vh]"
                focusPotholeId={focusedPotholeId}
                onSelectPothole={handleSelectPothole}
              />
            </div>
          )}

          {/* VIEW 3: POTHOLES TABLE */}
          {currentView === 'potholes' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Pothole Detection &amp; Maintenance Registry
                </h2>
                <p className="text-xs text-slate-500">
                  Search, filter, inspect, and export all recorded road surface anomalies.
                </p>
              </div>
              <PotholeTable
                onSelectPothole={handleSelectPothole}
                onInspectPothole={(p) => setInspectModalPothole(p)}
              />
            </div>
          )}

          {/* VIEW 4: ROVER STATUS */}
          {currentView === 'rover-status' && (
            <div className="animate-fade-in">
              <RoverStatusView />
            </div>
          )}

          {/* VIEW 5: INSPECTION QUEUE */}
          {currentView === 'inspection' && (
            <div className="animate-fade-in">
              <InspectionQueueView
                onOpenMapLocation={handleViewOnMap}
                onSelectPothole={handleSelectPothole}
              />
            </div>
          )}

          {/* VIEW 6: DETECTION HISTORY */}
          {currentView === 'history' && (
            <div className="animate-fade-in">
              <DetectionHistoryView onSelectPothole={handleSelectPothole} />
            </div>
          )}

          {/* VIEW 7: ANALYTICS */}
          {currentView === 'analytics' && (
            <div className="animate-fade-in">
              <AnalyticsView />
            </div>
          )}

          {/* VIEW 8: SETTINGS */}
          {currentView === 'settings' && (
            <div className="animate-fade-in">
              <SettingsView />
            </div>
          )}

        </main>
      </div>

      {/* Pothole Deep Detail Modal */}
      <PotholeDetailModal
        pothole={selectedPothole}
        onClose={() => setSelectedPothole(null)}
        onOpenInspection={handleOpenInspectionFromModal}
      />

      {/* Manual Inspection / Repair Logging Modal */}
      <InspectionNotesModal
        pothole={inspectModalPothole}
        targetAction={inspectModalPothole ? 'INSPECT' : null}
        onClose={() => setInspectModalPothole(null)}
        onSubmit={async (notes, inspectorName) => {
          if (inspectModalPothole) {
            await updatePotholeStatus(inspectModalPothole.id, 'INSPECTED', { notes, inspectorName });
            setInspectModalPothole(null);
          }
        }}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectPotholeById={(id) => {
          const pth = potholes.find(p => p.id === id);
          if (pth) setSelectedPothole(pth);
        }}
      />

    </div>
  );
}
