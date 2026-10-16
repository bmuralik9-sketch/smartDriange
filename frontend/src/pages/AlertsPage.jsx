import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  UserCheck,
  Filter,
  Search,
  ShieldCheck,
  CheckCheck,
  Compass
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";
import { api } from "../services/api";

export function AlertsPage({
  alerts = [],
  workers = [],
  onRefresh,
  onAssignWorker,
  onNavigate
}) {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      await api.updateAlert(alertId, { status: newStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update alert status:", err);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.alertId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "open" && alert.status !== "Resolved") ||
      alert.status.toLowerCase() === selectedTab.toLowerCase();

    const matchesSeverity =
      selectedSeverity === "all" ||
      alert.type.toLowerCase() === selectedSeverity.toLowerCase() ||
      alert.riskLevel?.toLowerCase() === selectedSeverity.toLowerCase();

    return matchesSearch && matchesTab && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Municipal Drainage Alerts &amp; Emergency Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time incident dispatch, worker assignment, and triage for storm canal blockages.
          </p>
        </div>

        {/* Unresolved Count Badge */}
        <div className="flex items-center gap-2">
          <span className="ent-badge ent-badge-danger text-xs font-medium">
            {alerts.filter((a) => a.status !== "Resolved").length} Active Incidents
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 ent-card">
        
        {/* Status Tabs */}
        <div className="ent-segmented">
          {[
            { id: "all", label: "All Alerts" },
            { id: "open", label: "Open Incidents" },
            { id: "new", label: "New" },
            { id: "acknowledged", label: "Acknowledged" },
            { id: "assigned", label: "Assigned" },
            { id: "in progress", label: "In Progress" },
            { id: "resolved", label: "Resolved" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`ent-segmented-btn capitalize ${selectedTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Severity Filter & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="ent-input text-xs py-1.5"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="warning">Warning</option>
            <option value="information">Information</option>
          </select>

          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ent-input w-full pl-8 py-1.5 text-xs"
            />
          </div>
        </div>

      </div>

      {/* Alerts Grid List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center ent-card text-slate-500">
            <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-sm text-slate-800">No Matching Drainage Incidents</p>
            <p className="text-xs text-slate-500 mt-1">All conduits operating within acceptable hydraulic tolerance</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = alert.status === "Resolved";
            const isCritical = alert.type === "CRITICAL" || alert.riskLevel === "CRITICAL";

            return (
              <div
                key={alert.alertId}
                className={`p-4 ent-card transition ${
                  isResolved
                    ? "opacity-60 bg-slate-50/50"
                    : isCritical
                    ? "border-red-200 bg-red-50/20"
                    : "hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Alert Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={alert.type || alert.riskLevel} />
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        {alert.alertId}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-blue-600 font-mono font-medium">
                        Drain: {alert.drainId}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <StatusBadge status={alert.status} size="sm" />
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{alert.location}</h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    {/* Telemetry snippet if present */}
                    {(alert.waterLevel !== undefined || alert.flowRate !== undefined) && (
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                        {alert.waterLevel !== undefined && (
                          <span>Water Level: <strong className="text-red-600">{alert.waterLevel}%</strong></span>
                        )}
                        {alert.flowRate !== undefined && (
                          <span>Flow: <strong className="text-amber-700">{alert.flowRate} L/m</strong></span>
                        )}
                        <span>Sensor: <strong>{alert.sensorId || "ESP32-NODE"}</strong></span>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 pt-0.5">
                      Assigned Personnel:{" "}
                      <span className="font-semibold text-slate-800">
                        {alert.assignedWorker || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {!isResolved && alert.status === "New" && (
                      <button
                        onClick={() => handleUpdateStatus(alert.alertId, "Acknowledged")}
                        className="ent-btn ent-btn-secondary text-xs"
                      >
                        Acknowledge
                      </button>
                    )}

                    {!isResolved && (
                      <button
                        onClick={() => onAssignWorker(alert)}
                        className="ent-btn ent-btn-primary text-xs flex items-center gap-1.5"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Assign</span>
                      </button>
                    )}

                    <button
                      onClick={() => onNavigate("map")}
                      className="ent-btn ent-btn-secondary text-xs flex items-center gap-1"
                    >
                      <Compass className="h-3.5 w-3.5 text-slate-500" />
                      <span>Map</span>
                    </button>

                    {!isResolved ? (
                      <button
                        onClick={() => handleUpdateStatus(alert.alertId, "Resolved")}
                        className="ent-btn ent-btn-success text-xs flex items-center gap-1.5"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Resolved
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
