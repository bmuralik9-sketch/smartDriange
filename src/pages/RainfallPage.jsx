import React, { useState } from "react";
import {
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  TrendingUp,
  Clock,
  Compass,
  Radio,
  BarChart2,
  CheckCircle2,
  Sliders,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { api } from "../services/api";
import { CanalRisingVisualizer } from "../components/rainfall/CanalRisingVisualizer";

export function RainfallPage({ rainfall = {}, onRefresh }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const current = rainfall.currentMm !== undefined ? rainfall.currentMm : 38.5;
  const last1h = rainfall.last1HourMm || 24.2;
  const last6h = rainfall.last6HoursMm || 68.4;
  const last24h = rainfall.last24HoursMm || 112.8;
  const history = rainfall.history || [];
  const stations = rainfall.stations || [];

  // Determine active category
  let activeCat = "Moderate Rain";
  let activeBadge = "ent-badge-accent";
  if (current === 0) {
    activeCat = "No Rain";
    activeBadge = "ent-badge-neutral";
  } else if (current <= 10) {
    activeCat = "Light Rain";
    activeBadge = "ent-badge-info";
  } else if (current <= 30) {
    activeCat = "Moderate Rain";
    activeBadge = "ent-badge-accent";
  } else if (current <= 60) {
    activeCat = "Heavy Rain";
    activeBadge = "ent-badge-warning";
  } else {
    activeCat = "Extreme Storm";
    activeBadge = "ent-badge-danger";
  }

  const categories = [
    { label: "No Rain", mm: 0, range: "0 mm", desc: "Dry canal bed" },
    { label: "Light Rain", mm: 5.2, range: "0 - 10 mm", desc: "Low hydraulic load" },
    { label: "Moderate Rain", mm: 22.0, range: "11 - 30 mm", desc: "Normal storm flow" },
    { label: "Heavy Rain", mm: 48.0, range: "31 - 60 mm", desc: "Desilt crews active" },
    { label: "Extreme Storm", mm: 74.5, range: "> 60 mm", desc: "Sump pumps engaged" }
  ];

  const handleSwitchRainfall = async (targetMm, timeframe = selectedTimeframe) => {
    try {
      setIsUpdating(true);
      await api.updateRainfall({
        currentMm: targetMm,
        timeframe: timeframe
      });
      setStatusMessage(`Switched rainfall to ${targetMm} mm/h (${timeframe} window)`);
      setTimeout(() => setStatusMessage(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSwitchTimeframe = async (tf) => {
    setSelectedTimeframe(tf);
    // When switching to 0-10m, if current is high, switch down to 0-10 mm range (5.8 mm)
    const target = tf === "0-10m" ? (current > 10 ? 5.8 : current) : current;
    await handleSwitchRainfall(target, tf);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <CloudRain className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Precipitation &amp; Stormwater Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated weather stations &amp; watershed storm index across Andhra Pradesh Capital Region.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="ent-segmented self-start sm:self-auto">
          <span className="text-[11px] text-slate-500 font-medium px-2">Window:</span>
          {[
            { id: "0-10m", label: "0 - 10 Mins" },
            { id: "1h", label: "1 Hour" },
            { id: "6h", label: "6 Hours" },
            { id: "24h", label: "24 Hours" }
          ].map((tf) => (
            <button
              key={tf.id}
              disabled={isUpdating}
              onClick={() => handleSwitchTimeframe(tf.id)}
              className={`ent-segmented-btn ${selectedTimeframe === tf.id ? "active" : ""}`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage && (
        <div className="p-3 ent-card border-blue-200 bg-blue-50/50 text-blue-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 4 KPI Rainfall Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Current Rate
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900">{current}</span>
            <span className="text-xs font-medium text-slate-500">mm/h</span>
          </div>
          <div className="mt-2.5">
            <span className={`ent-badge ${activeBadge}`}>
              {activeCat}
            </span>
          </div>
        </div>

        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Last 1 Hour
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900">{last1h}</span>
            <span className="text-xs font-mono text-slate-500">mm</span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500">Runoff accumulation</p>
        </div>

        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Last 6 Hours
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900">{last6h}</span>
            <span className="text-xs font-mono text-slate-500">mm</span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500">Sustained precipitation</p>
        </div>

        <div className="p-4 ent-card">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Last 24 Hours
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900">{last24h}</span>
            <span className="text-xs font-mono text-slate-500">mm</span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500">Catchment volume total</p>
        </div>
      </div>

      {/* Interactive Rainfall Intensity Selector */}
      <div className="p-5 ent-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Interactive Precipitation Switcher (Test Low vs High Rainfall Impact)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Click a preset below to instantly simulate hydraulic load</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {categories.map((c) => {
            const isSelected = c.label === activeCat;
            return (
              <button
                key={c.label}
                disabled={isUpdating}
                onClick={() => handleSwitchRainfall(c.mm)}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/40"
                    : "border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{c.label}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">{c.range}</div>
                <div className="text-[10px] text-slate-500 mt-1">{c.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic Canal Rising & Bank Overflow Simulator */}
      <CanalRisingVisualizer
        currentRainfall={current}
        onRainfallChange={(targetMm) => handleSwitchRainfall(targetMm)}
      />

      {/* Rainfall Trend Chart & Weather Station Gauges */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Dynamic Recharts Rainfall Chart */}
        <div className="lg:col-span-2 p-6 ent-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Rainfall Profile ({selectedTimeframe === "0-10m" ? "0 - 10 Minutes Window" : selectedTimeframe})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic telemetry corresponding to active {current} mm/h precipitation intensity
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-blue-600">Peak: {current} mm/h</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar
                  dataKey="mm"
                  name="Rainfall (mm)"
                  fill={current > 50 ? "#ef4444" : current > 20 ? "#2563eb" : "#10b981"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Weather Stations */}
        <div className="p-6 ent-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Automatic Weather Stations (AWS)
              </h3>
              <span className="ent-badge ent-badge-success text-[10px]">Live</span>
            </div>

            <div className="space-y-2">
              {stations.map((st) => (
                <div
                  key={st.name}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-medium text-slate-800">{st.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-medium">Status: {st.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{st.mm}</span>
                    <span className="text-[10px] text-slate-500 ml-1">mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg border border-blue-100 bg-blue-50/50 text-xs text-slate-700">
            <span className="font-semibold text-blue-900">Doppler Advisory: </span>
            {current <= 10
              ? "Precipitation is light (0-10 mm range). Storm conduits operating well within hydraulic threshold."
              : current <= 30
              ? "Moderate monsoonal rainfall. Normal drainage discharge active across all 20 channels."
              : "High runoff expected. Emergency desilt crews on standby across low-lying underpasses."}
          </div>
        </div>

      </div>

    </div>
  );
}
