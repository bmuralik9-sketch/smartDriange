import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Cpu,
  PieChart as PieIcon,
  ShieldAlert,
  Car,
  Calendar,
  Filter,
  Activity,
  CheckCircle2
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { api } from "../services/api";

export function AnalyticsPage() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics(range);
      setData(res);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500 font-mono text-sm">
        Aggregating municipal telemetry datasets...
      </div>
    );
  }

  const { kpis, blockageByZone, alertDistribution, responseTimes, trendData } = data;

  const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#2563eb"];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Civic Hydrodynamic Analytics &amp; Telemetry Insights
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical blockage patterns, alert distribution, worker resolution latency, and sensor reliability.
          </p>
        </div>

        {/* Time Filters */}
        <div className="ent-segmented self-start sm:self-auto">
          {[
            { id: "today", label: "Today" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`ent-segmented-btn ${range === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Insight Bars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Blockage Rate</span>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {kpis?.blockedDrains || 0} <span className="text-xs font-normal text-slate-500">Canals</span>
          </p>
          <span className="text-[11px] text-slate-500">Requires de-silt intervention</span>
        </div>

        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sensor Fleet Uptime</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {kpis?.uptimePercent || 98.4}%
          </p>
          <span className="text-[11px] text-slate-500">99.5% Service SLA Target</span>
        </div>

        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Worker Response</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            21.4 <span className="text-xs font-normal text-slate-500">mins</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">28% faster than SLA</span>
        </div>

        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">City Avg Water Level</span>
          <p className="text-2xl font-bold text-cyan-700 mt-1">
            {kpis?.avgWaterLevel || 45}%
          </p>
          <span className="text-[11px] text-slate-500">Normal operating limit &lt; 70%</span>
        </div>
      </div>

      {/* Charts Row 1: Blockage Frequency by Zone & Alerts Distribution */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Drain Blockage Frequency by Zone */}
        <div className="lg:col-span-7 p-6 ent-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              1. Drain Blockage &amp; Silt Frequency by Municipal Zone
            </h3>
            <span className="text-xs font-mono text-blue-600 font-medium">Spatial Breakdown</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockageByZone} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="zone" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="blocked" name="Blocked (Critical)" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="warning" name="Slow / Warning" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="normal" name="Normal Flow" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Alerts Severity Distribution Donut */}
        <div className="lg:col-span-5 p-6 ent-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              2. Alerts Breakdown by Severity
            </h3>
            <span className="text-xs text-slate-400">Total Volume</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2: Response Time of Workers & Hydraulic vs Rainfall Trend */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Chart 3: Response Time of Workers */}
        <div className="lg:col-span-6 p-6 ent-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              3. Sanitation Crew Response Time (Minutes)
            </h3>
            <span className="text-xs text-emerald-600 font-medium">Target: 30m</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="avgResponseMins" name="Avg Dispatch Time" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="targetMins" name="Target SLA" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Hydraulic vs Rainfall Trend */}
        <div className="lg:col-span-6 p-6 ent-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              4. Hydraulic Surges vs Precipitation Volume
            </h3>
            <span className="text-xs text-blue-600 font-medium">Multi-Sensor Sync</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="waterLevelAvg" name="Water Level (%)" stroke="#0891b2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="flowRateAvg" name="Flow Rate (L/m)" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
