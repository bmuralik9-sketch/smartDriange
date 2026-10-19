import React, { useState } from "react";
import {
  Layers,
  Search,
  Filter,
  Droplets,
  Wind,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  MapPin,
  X,
  UserCheck,
  Waves,
  Radio,
  Sparkles,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { StatusBadge } from "../components/common/StatusBadge";

export function DrainsPage({ drains = [], sensors = [], onAssignWorker, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDrain, setSelectedDrain] = useState(drains[0] || null);

  // Filtered drains
  const filtered = drains.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.drainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || d.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Generate dynamic 24-hr historical telemetry for selected drain
  const telemetryHistory = React.useMemo(() => {
    if (!selectedDrain) return [];
    const baseWl = selectedDrain.waterLevel || 50;
    const baseFr = selectedDrain.flowRate || 15;
    const points = [];
    for (let i = 12; i >= 0; i--) {
      const h = `${String(24 - i * 2).padStart(2, "0")}:00`;
      points.push({
        time: i === 0 ? "Now" : h,
        waterLevel: Math.max(10, Math.min(98, Math.round(baseWl + (Math.sin(i) * 15)))),
        flowRate: Math.max(0.1, Number((baseFr + (Math.cos(i) * 5)).toFixed(1)))
      });
    }
    return points;
  }, [selectedDrain]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Layers className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Drain Flow Monitoring &amp; Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time hydrodynamic monitoring across all 20 municipal storm canals and box culverts.
          </p>
        </div>

        {/* Status Filters */}
        <div className="ent-segmented self-start md:self-auto">
          {["all", "normal", "slow", "stopped", "blocked"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`ent-segmented-btn capitalize ${selectedStatus === st ? "active" : ""}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Blockage Detection Logic Explanation Panel */}
      <div className="p-4 ent-card border-blue-100 bg-blue-50/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-blue-600" />
              <span>Algorithmic Blockage Detection Logic</span>
            </span>
            <p className="text-xs text-slate-600 max-w-2xl">
              Cross-correlation between ultrasonic water elevation and electromagnetic velocity:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-2.5 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-900 font-mono text-[11px]">
              IF (Water &gt; 75% &amp; Flow &lt; 5.0 L/m) &rarr; <span className="font-semibold">POSSIBLE BLOCKAGE</span>
            </div>
            <div className="px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-900 font-mono text-[11px] font-semibold">
              IF (Water &gt; 90% &amp; Flow &asymp; 0) &rarr; CRITICAL ALARM
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Graphs & Drain List */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Selected Drain Detail & Telemetry Line Graphs */}
        <div className="lg:col-span-7 space-y-6">
          {selectedDrain ? (
            <div className="p-6 ent-card">
              
              {/* Drain Info Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {selectedDrain.drainId}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">{selectedDrain.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {selectedDrain.location} • {selectedDrain.zone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedDrain.status} />
                  <StatusBadge status={selectedDrain.riskLevel} />
                </div>
              </div>

              {/* Critical Blockage Warning Banner if Blocked */}
              {selectedDrain.status === "blocked" && (
                <div className="my-4 rounded-lg border border-red-200 bg-red-50/50 p-3.5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-red-900">
                        Drain Blockage Detected
                      </h4>
                      <p className="text-xs text-red-800 mt-0.5">
                        Water level has surged to {selectedDrain.waterLevel}% while flow rate is severely restricted to {selectedDrain.flowRate} L/min. Silt or debris obstructing conduit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Metrics Strip */}
              <div className="my-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Water Level</span>
                  <p className={`text-xl font-bold mt-0.5 ${selectedDrain.waterLevel > 80 ? "text-red-600" : "text-cyan-700"}`}>
                    {selectedDrain.waterLevel}%
                  </p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Flow Rate</span>
                  <p className={`text-xl font-bold mt-0.5 ${selectedDrain.flowRate < 5 ? "text-amber-700" : "text-blue-700"}`}>
                    {selectedDrain.flowRate} <span className="text-xs font-normal">L/min</span>
                  </p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Staff</span>
                  <p className="text-xs font-semibold text-emerald-700 mt-1.5 truncate">
                    {selectedDrain.assignedWorker || "None"}
                  </p>
                </div>
              </div>

              {/* Working Mode Hydrodynamic Culvert Animation */}
              <div className="my-5 p-4 rounded-xl border border-slate-200 bg-slate-900 text-white shadow-inner overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-blue-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Hydrodynamic Culvert Conduit (Working Mode Active)
                    </span>
                  </div>
                  <span className="ent-badge ent-badge-neutral text-[10px] font-mono text-cyan-300">
                    Live Velocity: {selectedDrain.flowRate} L/min
                  </span>
                </div>

                {/* Animated Cross-Section Culvert Stage */}
                <div className="relative w-full h-32 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden">
                  
                  {/* Street Grate Intake at Top */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-slate-800 flex items-center justify-around border-b border-slate-700">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <div key={idx} className="w-1.5 h-3 bg-slate-950 rounded-xs" />
                    ))}
                  </div>

                  {/* Water Body with Height proportional to Water Level */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ${
                      selectedDrain.status === "blocked"
                        ? "bg-gradient-to-t from-red-950 via-red-900 to-amber-700"
                        : selectedDrain.status === "slow"
                        ? "bg-gradient-to-t from-amber-950 via-amber-900 to-amber-600"
                        : "bg-gradient-to-t from-blue-950 via-blue-900 to-cyan-600"
                    }`}
                    style={{ height: `${Math.max(15, Math.min(94, selectedDrain.waterLevel))}%` }}
                  >
                    {/* Fluid Wave Ripple Surface */}
                    <div className="absolute top-0 left-0 right-0 h-3 opacity-70 animate-wave-flow bg-[radial-gradient(circle,rgba(255,255,255,0.4)_10%,transparent_20%)]" style={{ backgroundSize: "14px 14px" }} />

                    {/* Flowing Velocity Arrows */}
                    <div className="absolute inset-0 flex items-center justify-around overflow-hidden pointer-events-none">
                      {selectedDrain.status === "blocked" ? (
                        <div className="flex items-center gap-2 text-red-300 text-xs font-bold animate-pulse">
                          <span>⚠️ WHIRLPOOL CHOKE: Flow Stalled (0.4 L/min)</span>
                          <span className="text-base">🌀</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-around w-full opacity-60">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <ArrowRight
                              key={i}
                              className={`h-5 w-5 text-cyan-200 transition-all ${
                                selectedDrain.flowRate > 15 ? "animate-bounce" : "opacity-40"
                              }`}
                              style={{ animationDuration: `${Math.max(0.4, 25 / (selectedDrain.flowRate || 10))}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Blockage Debris Simulation if Blocked */}
                    {selectedDrain.status === "blocked" && (
                      <div className="absolute right-4 bottom-2 bg-red-900/90 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500 animate-pulse">
                        🗑️ Silt Choke at Discharge Grate
                      </div>
                    )}
                  </div>

                  {/* Surface Level Indicator Tag */}
                  <div
                    className="absolute right-2 -translate-y-1/2 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-400 shadow-xs pointer-events-none"
                    style={{ bottom: `${Math.max(15, Math.min(94, selectedDrain.waterLevel))}%` }}
                  >
                    Surface Elevation: {selectedDrain.waterLevel}%
                  </div>

                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Conduit Width: {selectedDrain.widthMeters || 3.0}m • Depth: {selectedDrain.depthMeters || 3.5}m</span>
                  <span className="text-cyan-400 font-mono">Max Capacity: {selectedDrain.capacity || 7500} L/min</span>
                </div>
              </div>

              {/* Graph 1: Water Level vs Time */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Water Level vs Time
                  </h4>
                  <span className="text-[11px] text-slate-400">24-Hour Telemetry</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e2e8f0",
                          borderRadius: "8px",
                          fontSize: "11px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.06)"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="waterLevel"
                        name="Water Level %"
                        stroke="#0891b2"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Graph 2: Flow Rate vs Time */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Flow Rate vs Time
                  </h4>
                  <span className="text-[11px] text-slate-400">Liters / Minute (Q)</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e2e8f0",
                          borderRadius: "8px",
                          fontSize: "11px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.06)"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="flowRate"
                        name="Flow Rate (L/min)"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action: Assign Worker */}
              {onAssignWorker && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() =>
                      onAssignWorker({
                        drainId: selectedDrain.drainId,
                        location: selectedDrain.location,
                        alertId: `ALT-${selectedDrain.drainId}`,
                        riskLevel: selectedDrain.riskLevel
                      })
                    }
                    className="ent-btn ent-btn-primary text-xs"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Dispatch Municipal Sanitation Staff</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 ent-card">Select a drain to view live telemetry</div>
          )}
        </div>

        {/* Right 5 Cols: All Drains Filterable Table/Cards */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Drain ID, road or zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ent-input w-full pl-9 py-2 text-xs"
            />
          </div>

          {/* Drains Scrollable Cards List */}
          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filtered.map((drain) => {
              const isSelected = selectedDrain && selectedDrain.drainId === drain.drainId;

              return (
                <div
                  key={drain.drainId}
                  onClick={() => setSelectedDrain(drain)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-blue-600">
                      {drain.drainId}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={drain.status} size="sm" />
                      <StatusBadge status={drain.riskLevel} size="sm" />
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 mt-1">{drain.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{drain.location}</p>

                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2">
                    <div>
                      <span className="text-slate-400 text-[10px]">Water:</span>
                      <span className={`ml-1 font-semibold ${drain.waterLevel > 80 ? "text-red-600" : "text-slate-700"}`}>
                        {drain.waterLevel}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Flow:</span>
                      <span className="ml-1 font-mono text-slate-700 font-medium">
                        {drain.flowRate} L/m
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
