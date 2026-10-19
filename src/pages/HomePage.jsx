import React from "react";
import {
  Activity,
  MapPin,
  Cpu,
  ShieldAlert,
  CloudRain,
  Users,
  BarChart3,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Waves,
  Zap,
  Radio,
  Clock,
  Compass
} from "lucide-react";

export function HomePage({ onEnterDashboard }) {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 lg:px-8 text-center">
        
        {/* Municipal Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-700 shadow-xs mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Andhra Pradesh Capital Region Municipal Telemetry</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          SMART DRAINAGE <br />
          <span className="text-blue-600">
            MANAGEMENT SYSTEM
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          Real-Time IoT Monitoring for Cleaner, Safer, and Flood-Resilient Cities across Vijayawada, Guntur, Mangalagiri, and Tadepalli.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onEnterDashboard("dashboard")}
            className="ent-btn ent-btn-primary px-6 py-2.5 text-xs font-semibold"
          >
            <span>Open Command Console</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onEnterDashboard("map")}
            className="ent-btn ent-btn-secondary px-6 py-2.5 text-xs font-semibold"
          >
            <Compass className="h-4 w-4 text-slate-500" />
            <span>Explore Live GIS Map</span>
          </button>
        </div>

        {/* Key Metrics Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
          <div className="p-4 ent-card">
            <span className="block text-2xl font-bold text-slate-900">20</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Monitored Canals</span>
          </div>
          <div className="p-4 ent-card">
            <span className="block text-2xl font-bold text-emerald-600">&lt; 3.5s</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Telemetry Latency</span>
          </div>
          <div className="p-4 ent-card">
            <span className="block text-2xl font-bold text-blue-600">94.2%</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Blockage Accuracy</span>
          </div>
          <div className="p-4 ent-card">
            <span className="block text-2xl font-bold text-slate-900">100%</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Automated Dispatch</span>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">Urban Flood Defense</span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
              Why Traditional Urban Drainage Systems Fail
            </h2>
            <p className="mt-2 text-slate-500 text-xs">
              Conventional municipalities only discover blocked drains after underpasses submerge and roads flood.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-5 ent-card border-slate-200">
              <div className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3 border border-red-100">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Silent Debris Choking</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Garbage, plastic crates, and construction silt accumulate unseen in subterranean conduits until flow stops entirely.
              </p>
            </div>

            <div className="p-5 ent-card border-slate-200">
              <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-100">
                <CloudRain className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Sudden Flash Flooding</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Intense monsoonal cloudbursts overwhelm unmonitored drains within 20 minutes, paralyzing traffic at underpasses.
              </p>
            </div>

            <div className="p-5 ent-card border-slate-200">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 border border-blue-100">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Delayed Manual Response</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Without precise sensor telemetry, sanitation crews lose critical hours searching for the blockage along miles of culverts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & IoT Monitoring */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Continuous Telemetry</span>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
            How The Smart Drainage Platform Operates
          </h2>
          <p className="mt-2 text-slate-500 text-xs">
            End-to-end integration from ESP32 edge sensors to real-time municipal control center.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-5 ent-card">
            <div className="text-[10px] font-mono text-blue-600 font-semibold mb-1">STAGE 01</div>
            <Cpu className="h-6 w-6 text-slate-800 mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">ESP32 IoT Sensors</h4>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Ultrasonic probes and flow meters sample water level &amp; velocity every 10 seconds.
            </p>
          </div>

          <div className="p-5 ent-card">
            <div className="text-[10px] font-mono text-blue-600 font-semibold mb-1">STAGE 02</div>
            <Zap className="h-6 w-6 text-slate-800 mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">Rule-Based Detection</h4>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Detects if water level exceeds 75% while velocity drops to flag physical blockages.
            </p>
          </div>

          <div className="p-5 ent-card">
            <div className="text-[10px] font-mono text-blue-600 font-semibold mb-1">STAGE 03</div>
            <ShieldAlert className="h-6 w-6 text-slate-800 mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">Instant Alerts</h4>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Dispatches emergency notifications over WebSockets to operators before roads submerge.
            </p>
          </div>

          <div className="p-5 ent-card">
            <div className="text-[10px] font-mono text-blue-600 font-semibold mb-1">STAGE 04</div>
            <Users className="h-6 w-6 text-slate-800 mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">Worker Dispatch</h4>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Auto-assigns nearest municipal staff with exact GPS coordinates and task orders.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onEnterDashboard("dashboard")}
            className="ent-btn ent-btn-primary px-6 py-2.5 text-xs font-semibold"
          >
            <span>Launch Operator Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
