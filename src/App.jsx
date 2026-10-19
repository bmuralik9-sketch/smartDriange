import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/layout/Navbar";
import { SimulationBar } from "./components/simulation/SimulationBar";
import { EmergencyModal } from "./components/common/EmergencyModal";
import { AssignWorkerModal } from "./components/common/AssignWorkerModal";
import { SocketProvider, useSocket } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { Dashboard } from "./pages/Dashboard";
import { LiveMapPage } from "./pages/LiveMapPage";
import { DrainsPage } from "./pages/DrainsPage";
import { SensorsPage } from "./pages/SensorsPage";
import { AlertsPage } from "./pages/AlertsPage";
import { RainfallPage } from "./pages/RainfallPage";
import { RoadFloodingPage } from "./pages/RoadFloodingPage";
import { WorkersPage } from "./pages/WorkersPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { PredictionPage } from "./pages/PredictionPage";
import { CitizenPortal } from "./pages/CitizenPortal";
import { WorkerPortal } from "./pages/WorkerPortal";
import { ComplaintsAdminPage } from "./pages/ComplaintsAdminPage";

// API
import { api } from "./services/api";

function AppContent() {
  const { currentUser } = useAuth();
  const [activePage, setActivePage] = useState(() => {
    if (currentUser?.role === "citizen") return "citizen";
    if (currentUser?.role === "worker") return "worker";
    return "dashboard";
  });

  const [drains, setDrains] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [roads, setRoads] = useState([]);
  const [rainfall, setRainfall] = useState({});
  const [canals, setCanals] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeAlertForModal, setActiveAlertForModal] = useState(null);
  const [workerAssignAlert, setWorkerAssignAlert] = useState(null);

  const { socket, latestEvent, isLiveMonitoringActive } = useSocket();

  // Load all initial data from backend API
  const loadInitialData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [drainsRes, sensorsRes, alertsRes, workersRes, roadsRes, rainRes, canalsRes, complaintsRes] =
        await Promise.all([
          api.getDrains(),
          api.getSensors(),
          api.getAlerts(),
          api.getWorkers(),
          api.getRoadFlooding(),
          api.getRainfall(),
          api.getCanals(),
          api.getComplaints()
        ]);

      setDrains(drainsRes.data || []);
      setSensors(sensorsRes.data || []);
      setAlerts(alertsRes.data || []);
      setWorkers(workersRes.data || []);
      setRoads(roadsRes.data || []);
      setRainfall(rainRes.data || {});
      setCanals(canalsRes.data || []);
      setComplaints(complaintsRes.data || []);
    } catch (err) {
      console.error("Failed to load initial municipal data:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadInitialData(false);
    }
  }, [currentUser, loadInitialData]);

  // Synchronize default page when switching role
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "citizen") setActivePage("citizen");
    else if (currentUser.role === "worker") setActivePage("worker");
    else setActivePage("dashboard");
  }, [currentUser?.role]);

  // LIVE MONITORING FIX: Automatic resilient background polling (every 3.5s)
  useEffect(() => {
    if (!currentUser || !isLiveMonitoringActive) return;
    const interval = setInterval(() => {
      loadInitialData(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentUser, isLiveMonitoringActive, loadInitialData]);

  // Handle real-time WebSocket events
  useEffect(() => {
    if (!latestEvent) return;

    const { type, data } = latestEvent;

    if (type === "alert_new") {
      setAlerts((prev) => [data, ...prev.filter((a) => a.alertId !== data.alertId)]);
      if (data.type === "CRITICAL" || data.riskLevel === "CRITICAL" || data.message?.includes("Blockage")) {
        setActiveAlertForModal(data);
      }
    } else if (type === "alert_update") {
      setAlerts((prev) => prev.map((a) => (a.alertId === data.alertId ? data : a)));
    } else if (type === "complaint_new") {
      setComplaints((prev) => [data, ...prev.filter((c) => c.complaintId !== data.complaintId)]);
    } else if (type === "complaint_update") {
      setComplaints((prev) => prev.map((c) => (c.complaintId === data.complaintId ? data : c)));
    } else if (type === "drain_update") {
      setDrains((prev) => prev.map((d) => (d.drainId === data.drainId ? data : d)));
    } else if (type === "sensor_update") {
      setSensors((prev) => prev.map((s) => (s.sensorId === data.sensorId ? data : s)));
    } else if (type === "worker_update") {
      setWorkers((prev) => prev.map((w) => (w.workerId === data.workerId ? data : w)));
    } else if (type === "road_update") {
      setRoads((prev) => prev.map((r) => (r.roadId === data.roadId ? data : r)));
    } else if (type === "rainfall_update") {
      setRainfall(data);
    } else if (type === "system_reset") {
      loadInitialData(false);
    }
  }, [latestEvent, loadInitialData]);

  // Alert Action Handlers
  const handleAcknowledgeAlert = async (alert) => {
    try {
      await api.updateAlert(alert.alertId, { status: "Acknowledged" });
      loadInitialData(true);
      setActiveAlertForModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAlert = async (alert) => {
    try {
      await api.updateAlert(alert.alertId, { status: "Resolved" });
      loadInitialData(true);
      setActiveAlertForModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAssignModal = (alert) => {
    setActiveAlertForModal(null);
    setWorkerAssignAlert(alert);
  };

  const handleConfirmWorkerAssign = async (alert, workerName) => {
    try {
      await api.updateAlert(alert.alertId, {
        status: "Assigned",
        assignedWorker: workerName
      });
      loadInitialData(true);
      setWorkerAssignAlert(null);
    } catch (err) {
      console.error(err);
    }
  };

  // MANDATORY LOGIN GATE: Show Flipkart-Style Login Page on Startup if not authenticated
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          if (user?.role === "citizen") setActivePage("citizen");
          else if (user?.role === "worker") setActivePage("worker");
          else setActivePage("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white pb-4">
      
      {/* Real-Time Simulation Trigger Bar */}
      <SimulationBar onSimulationRun={() => loadInitialData(true)} />

      {/* Main Header / Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        alerts={alerts}
        complaints={complaints}
        onOpenAlert={setActiveAlertForModal}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {loading ? (
          <div className="flex h-96 items-center justify-center font-mono text-sm text-[#2874F0]">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#2874F0] animate-ping" />
              Loading AP Capital Drainage Telemetry (Vijayawada • Guntur • Mangalagiri)...
            </span>
          </div>
        ) : (
          <>
            {/* Citizen Specific Portal */}
            {activePage === "citizen" && (
              <CitizenPortal
                drains={drains}
                complaints={complaints}
                onRefresh={() => loadInitialData(true)}
              />
            )}

            {/* Worker Specific Portal */}
            {activePage === "worker" && (
              <WorkerPortal
                alerts={alerts}
                complaints={complaints}
                drains={drains}
                onRefresh={() => loadInitialData(true)}
                onNavigate={setActivePage}
              />
            )}

            {/* Government Complaints Triage */}
            {activePage === "complaints" && (
              <ComplaintsAdminPage
                complaints={complaints}
                workers={workers}
                onRefresh={() => loadInitialData(true)}
              />
            )}

            {activePage === "home" && (
              <HomePage onEnterDashboard={(page) => setActivePage(page || "dashboard")} />
            )}

            {activePage === "dashboard" && (
              <Dashboard
                drains={drains}
                sensors={sensors}
                alerts={alerts}
                workers={workers}
                roads={roads}
                rainfall={rainfall}
                onNavigate={setActivePage}
                onOpenAlert={setActiveAlertForModal}
              />
            )}

            {activePage === "map" && (
              <LiveMapPage
                drains={drains}
                sensors={sensors}
                canals={canals}
                roads={roads}
                rainfall={rainfall}
                onAssignWorker={handleOpenAssignModal}
                onOpenAlert={setActiveAlertForModal}
              />
            )}

            {activePage === "drains" && (
              <DrainsPage
                drains={drains}
                sensors={sensors}
                onAssignWorker={handleOpenAssignModal}
                onNavigate={setActivePage}
              />
            )}

            {activePage === "sensors" && (
              <SensorsPage
                sensors={sensors}
                drains={drains}
                onRefresh={() => loadInitialData(true)}
              />
            )}

            {activePage === "alerts" && (
              <AlertsPage
                alerts={alerts}
                workers={workers}
                onRefresh={() => loadInitialData(true)}
                onAssignWorker={handleOpenAssignModal}
                onNavigate={setActivePage}
              />
            )}

            {activePage === "rainfall" && (
              <RainfallPage
                rainfall={rainfall}
                onRefresh={() => loadInitialData(true)}
              />
            )}

            {activePage === "roads" && (
              <RoadFloodingPage roads={roads} onNavigate={setActivePage} />
            )}

            {activePage === "workers" && (
              <WorkersPage workers={workers} onRefresh={() => loadInitialData(true)} />
            )}

            {activePage === "analytics" && (
              <AnalyticsPage />
            )}

            {activePage === "prediction" && (
              <PredictionPage />
            )}
          </>
        )}
      </main>

      {/* Emergency Modal for Critical Blockages */}
      <EmergencyModal
        alert={activeAlertForModal}
        onClose={() => setActiveAlertForModal(null)}
        onAcknowledge={handleAcknowledgeAlert}
        onAssignWorker={handleOpenAssignModal}
        onViewMap={() => {
          setActiveAlertForModal(null);
          setActivePage("map");
        }}
        onResolve={handleResolveAlert}
      />

      {/* Assign Sanitation Worker Modal */}
      <AssignWorkerModal
        isOpen={!!workerAssignAlert}
        onClose={() => setWorkerAssignAlert(null)}
        alert={workerAssignAlert}
        workers={workers}
        onAssign={handleConfirmWorkerAssign}
      />

      {/* Enterprise Municipal Footer */}
      <footer className="w-full px-3 sm:px-6 my-4 mt-auto">
        <div className="max-w-7xl mx-auto p-3.5 ent-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">SMART DRAINAGE</span>
            <span className="ent-badge ent-badge-neutral text-[10px]">ENTERPRISE CONSOLE</span>
            <span className="text-slate-300">•</span>
            <span>Andhra Pradesh Capital Region (Vijayawada • Guntur • Mangalagiri • Tadepalli)</span>
          </div>
          <span className="ent-badge ent-badge-info text-xs">
            Signed in as: <strong className="text-blue-900 ml-1">{currentUser?.role?.toUpperCase()}</strong> ({currentUser?.name})
          </span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
