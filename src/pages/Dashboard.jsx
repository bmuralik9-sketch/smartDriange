import React, { useState, useEffect } from "react";
import {
  Layers,
  Cpu,
  AlertTriangle,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Droplets,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { useSocket } from "../context/SocketContext";

export function Dashboard({
  drains = [],
  sensors = [],
  alerts = [],
  workers = [],
  roads = [],
  rainfall = {},
  onNavigate,
  onOpenAlert
}) {
  const { isConnected } = useSocket();

  // Compute live KPIs
  const totalDrains = drains.length;
  const blockedDrains = drains.filter((d) => d.status === "blocked").length;
  const warningDrains = drains.filter((d) => d.status === "slow" || d.status === "warning").length;
  
  const activeSensors = sensors.filter((s) => s.status !== "offline").length;
  const totalSensors = sensors.length;

  const criticalAlerts = alerts.filter(
    (a) => (a.riskLevel === "CRITICAL" || a.type === "CRITICAL") && a.status !== "Resolved"
  ).length;

  const waterloggingRoads = roads.filter(
    (r) => r.floodRisk === "CRITICAL" || r.floodRisk === "HIGH" || r.waterDepthCm > 10
  ).length;

  const activeWorkers = workers.filter((w) => w.status === "available" || w.status === "busy").length;
  const totalWorkers = workers.length;

  // Unresolved high/critical alert for emergency banner
  const activeCriticalAlert = alerts.find(
    (a) => (a.riskLevel === "CRITICAL" || a.type === "CRITICAL") && a.status !== "Resolved"
  );

  // Time-series mock data for quick overview chart
  const telemetryTrend = [
    { time: "08:00", avgLevel: 35, avgFlow: 24, rain: 8 },
    { time: "10:00", avgLevel: 42, avgFlow: 21, rain: 15 },
    { time: "12:00", avgLevel: 58, avgFlow: 18, rain: 28 },
    { time: "14:00", avgLevel: 74, avgFlow: 14, rain: 42 },
    { time: "16:00", avgLevel: 82, avgFlow: 9, rain: 52 },
    { time: "18:00", avgLevel: 68, avgFlow: 16, rain: 38 },
    { time: "Current", avgLevel: 64, avgFlow: 15.2, rain: rainfall.currentMm || 34.5 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Drainage Command Console
            </h1>
            <span className="ent-badge ent-badge-success text-xs">
              {isConnected ? "System Live & Streaming" : "Connecting"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time urban storm canal telemetry, blockage detection, and sanitation crew dispatch across Andhra Pradesh Capital Region.
          </p>
        </div>

        {/* Quick Map Action */}
        <button
          onClick={() => onNavigate("map")}
          className="ent-btn ent-btn-primary text-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Compass className="h-4 w-4" />
          <span>Open Live Map</span>
        </button>
      </div>

      {/* 6 High-Priority Municipal Enterprise KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Total Drains */}
        <StatCard
          title="Total Drains"
          value={totalDrains}
          subtitle={`${drains.filter((d) => d.status === "normal").length} Normal Flow`}
          icon={Layers}
          variant="normal"
          onClick={() => onNavigate("drains")}
        />

        {/* 2. Active Sensors */}
        <StatCard
          title="Active Sensors"
          value={`${activeSensors} / ${totalSensors}`}
          subtitle={`${totalSensors - activeSensors} Device Offline`}
          icon={Cpu}
          variant={activeSensors === totalSensors ? "normal" : "warning"}
          onClick={() => onNavigate("sensors")}
        />

        {/* 3. Blocked Drains */}
        <StatCard
          title="Blocked Drains"
          value={blockedDrains}
          subtitle={`${warningDrains} Flow Warnings`}
          icon={AlertTriangle}
          variant={blockedDrains > 0 ? "critical" : "normal"}
          trend={blockedDrains > 0 ? "ACTION REQ" : "NOMINAL"}
          trendPositive={blockedDrains === 0}
          onClick={() => onNavigate("drains")}
        />

        {/* 4. Critical Alerts */}
        <StatCard
          title="Critical Alerts"
          value={criticalAlerts}
          subtitle={`${alerts.filter((a) => a.status !== "Resolved").length} Active Alarms`}
          icon={AlertTriangle}
          variant={criticalAlerts > 0 ? "critical" : "normal"}
          trend={criticalAlerts > 0 ? "SURGE" : "QUIET"}
          trendPositive={criticalAlerts === 0}
          onClick={() => onNavigate("alerts")}
        />

        {/* 5. Submerged Roads */}
        <StatCard
          title="Flooded Roads"
          value={waterloggingRoads}
          subtitle="Road Inundations"
          icon={Car}
          variant={waterloggingRoads > 0 ? "high" : "normal"}
          onClick={() => onNavigate("roads")}
        />

        {/* 6. Workers Active */}
        <StatCard
          title="Workers Active"
          value={`${activeWorkers} / ${totalWorkers}`}
          subtitle={`${workers.filter((w) => w.status === "available").length} Ready for Dispatch`}
          icon={Users}
          variant="cyan"
          onClick={() => onNavigate("workers")}
        />
      </div>

      {/* Emergency Alert Notification Banner (If Critical Alert is Active) */}
      {activeCriticalAlert && (
        <div className="p-4 ent-card border-red-200 bg-red-50/40 animate-in fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="ent-badge ent-badge-danger text-[10px] uppercase font-bold tracking-wider">
                    Emergency Incident
                  </span>
                  <span className="font-mono text-xs text-red-900 font-bold">{activeCriticalAlert.alertId}</span>
                  <span className="text-xs text-slate-600">• {activeCriticalAlert.location}</span>
                </div>
                <h3 className="text-sm font-semibold text-red-950 mt-1">
                  {activeCriticalAlert.message}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => onOpenAlert(activeCriticalAlert)}
                className="ent-btn ent-btn-danger text-xs"
              >
                Respond to Incident
              </button>
              <button
                onClick={() => onNavigate("map")}
                className="ent-btn ent-btn-secondary text-xs"
              >
                Pin on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Split View: Telemetry Graphs & Real-Time Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Real-Time Flow Rate & Water Level Chart */}
        <div className="lg:col-span-2 p-6 ent-card flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Urban Storm Canal Hydraulic Telemetry
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Citywide rolling water level vs flow discharge correlation
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="ent-badge ent-badge-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>Water Level (%)</span>
                </div>
                <div className="ent-badge ent-badge-neutral">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>Flow Rate (L/min)</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                      fontWeight: 500
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgLevel"
                    name="Water Level %"
                    stroke="#0891b2"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#waterGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avgFlow"
                    name="Flow Rate (L/min)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#flowGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">City Avg Water Level</span>
              <p className="text-lg font-bold text-cyan-700 mt-0.5">
                {Math.round(drains.reduce((a, b) => a + (b.waterLevel || 0), 0) / (drains.length || 1))}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">City Avg Flow Rate</span>
              <p className="text-lg font-bold text-blue-700 mt-0.5">
                {(drains.reduce((a, b) => a + (b.flowRate || 0), 0) / (drains.length || 1)).toFixed(1)} L/m
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Precipitation Rate</span>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">
                {rainfall.currentMm || 34.5} mm/h
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Active Alerts Feed */}
        <div className="p-6 ent-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Active Alerts Feed</h3>
              </div>
              <span className="ent-badge ent-badge-danger text-xs">
                {alerts.filter((a) => a.status !== "Resolved").length} Open
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.alertId}
                  onClick={() => onOpenAlert(alert)}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 cursor-pointer transition select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                      {alert.location}
                    </span>
                    <StatusBadge status={alert.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono font-medium">{alert.alertId}</span>
                    <span className="ent-badge ent-badge-success text-[10px] py-0 px-2">
                      {alert.assignedWorker}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("alerts")}
            className="w-full mt-4 ent-btn ent-btn-secondary text-xs"
          >
            Manage All Alerts ({alerts.length})
          </button>
        </div>

      </div>

      {/* Drains Needing Immediate Attention Table */}
      <div className="p-6 ent-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Drainage Network Priority Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sorted by hydraulic risk level &amp; blockage probability (Vijayawada, Guntur, Mangalagiri, Tadepalli)
            </p>
          </div>

          <button
            onClick={() => onNavigate("drains")}
            className="ent-btn ent-btn-secondary text-xs self-start sm:self-auto"
          >
            <span>View All 20 Drains</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-3">DRAIN ID</th>
                <th className="py-2.5 px-3">LOCATION &amp; ZONE</th>
                <th className="py-2.5 px-3">WATER LEVEL</th>
                <th className="py-2.5 px-3">FLOW RATE</th>
                <th className="py-2.5 px-3">FLOW STATUS</th>
                <th className="py-2.5 px-3">RISK</th>
                <th className="py-2.5 px-3">ASSIGNED WORKER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drains
                .slice()
                .sort((a, b) => (b.waterLevel || 0) - (a.waterLevel || 0))
                .slice(0, 6)
                .map((drain) => (
                  <tr key={drain.drainId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-semibold text-blue-600">{drain.drainId}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">{drain.name}</div>
                      <div className="text-[11px] text-slate-500">{drain.location}</div>
                    </td>
                    <td className="py-3 px-3 font-medium">
                      <span className={drain.waterLevel > 80 ? "text-red-600 font-semibold" : "text-slate-800"}>
                        {drain.waterLevel}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={drain.flowRate < 5 ? "text-amber-600 font-semibold" : "text-slate-700"}>
                        {drain.flowRate} L/m
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={drain.status} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={drain.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {drain.assignedWorker || "None"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
