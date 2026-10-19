import React, { useState, useEffect } from "react";
import { Play, Zap, RotateCcw, Activity, ShieldAlert, Check, Radio, Sparkles } from "lucide-react";
import { api } from "../../services/api";

export function SimulationBar({ onSimulationRun }) {
  const [loading, setLoading] = useState(false);
  const [isJittering, setIsJittering] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  const triggerUpdate = async (mode = "jitter") => {
    try {
      setLoading(true);
      if (mode === "jitter") setIsJittering(true);
      const res = await api.triggerSimulation(mode);
      if (res.scenario) {
        setLastNotification(res.scenario);
        setTimeout(() => setLastNotification(null), 4500);
      }
      if (onSimulationRun) onSimulationRun(res);
    } catch (err) {
      console.error("Simulation trigger failed:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsJittering(false), 1200);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await api.resetSimulation();
      setLastNotification("Reset to Baseline AP Demo State");
      setTimeout(() => setLastNotification(null), 4000);
      if (onSimulationRun) onSimulationRun();
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (autoSimulate) {
      timer = setInterval(() => {
        triggerUpdate("jitter");
      }, 8000);
    }
    return () => clearInterval(timer);
  }, [autoSimulate]);

  return (
    <div className="w-full px-3 sm:px-6 my-2">
      <div className={`mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-3 ent-card transition-all ${isJittering ? "ring-2 ring-blue-500 bg-blue-50/30" : ""}`}>
        
        {/* Left: Simulation Indicator & Live Working Mode */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-1.5">
            <span>IoT Fleet Status:</span>
          </span>
          
          <span className="ent-badge ent-badge-neutral text-[11px] font-medium flex items-center gap-1">
            <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
            20 Nodes Working &amp; Transmitting
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
            <Sparkles className="h-3 w-3 text-blue-500 animate-spin" />
            Working Mode Animations Active
          </span>

          {lastNotification && (
            <span className="ent-badge ent-badge-success text-[11px] font-medium animate-in fade-in">
              <Check className="h-3 w-3 text-emerald-600" />
              {lastNotification}
            </span>
          )}
        </div>

        {/* Right: Clean Enterprise Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* SIMULATE SENSOR UPDATE Button */}
          <button
            disabled={loading}
            onClick={() => triggerUpdate("jitter")}
            className={`ent-btn text-xs disabled:opacity-50 transition-all ${
              isJittering 
                ? "bg-blue-600 text-white shadow-md animate-pulse" 
                : "ent-btn-secondary hover:border-blue-400 hover:text-blue-600"
            }`}
            title="Randomize telemetry across all 20 sensors, drains, and road traffic"
          >
            <Activity className={`h-3.5 w-3.5 ${isJittering ? "animate-spin text-white" : "text-blue-600"}`} />
            <span>{isJittering ? "⚡ Jittering 20 Nodes..." : "Simulate Sensor Jitter"}</span>
          </button>

          {/* INJECT CRITICAL BLOCKAGE Button */}
          <button
            disabled={loading}
            onClick={() => triggerUpdate("spike")}
            className="ent-btn ent-btn-danger text-xs disabled:opacity-50"
            title="Demonstrate water level surging > 90%, flow restriction, critical alert and worker auto-dispatch"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Inject Blockage Spike</span>
          </button>

          {/* Auto Simulator Toggle */}
          <button
            onClick={() => setAutoSimulate((prev) => !prev)}
            className={`ent-btn text-xs ${
              autoSimulate
                ? "ent-btn-success"
                : "ent-btn-secondary"
            }`}
          >
            <Play className={`h-3 w-3 ${autoSimulate ? "fill-white" : "fill-slate-600"}`} />
            <span>{autoSimulate ? "Auto-Jitter ON (8s)" : "Auto-Jitter OFF"}</span>
          </button>

          {/* Reset Baseline Button */}
          <button
            disabled={loading}
            onClick={handleReset}
            className="ent-btn ent-btn-secondary text-xs disabled:opacity-50"
            title="Reset to factory baseline AP state"
          >
            <RotateCcw className="h-3 w-3 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
}
