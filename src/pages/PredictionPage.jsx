import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  CloudRain,
  Car,
  Layers,
  Cpu,
  Database,
  Zap,
  ShieldAlert,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Info
} from "lucide-react";
import { api } from "../services/api";

export function PredictionPage() {
  const [predictionsData, setPredictionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(5); // Default to Smart Analysis in pipeline

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await api.getPredictions();
        setPredictionsData(res);
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const pipelineSteps = [
    {
      id: 1,
      title: "RAIN",
      subtitle: "Precipitation & Cloudbursts",
      icon: CloudRain,
      desc: "Intense monsoonal downpours deliver stormwater runoff into urban catchment basins.",
      metric: "38.5 mm/h Intensity"
    },
    {
      id: 2,
      title: "ROADS",
      subtitle: "Surface Water Ponding",
      icon: Car,
      desc: "Rainwater collects on road asphalt and directs towards lateral storm drains.",
      metric: "6 Monitored Corridors"
    },
    {
      id: 3,
      title: "DRAINAGE",
      subtitle: "Subterranean Canals",
      icon: Layers,
      desc: "Box culverts and open canals convey water away from city streets.",
      metric: "20 Major Arterial Canals"
    },
    {
      id: 4,
      title: "ESP32",
      subtitle: "IoT Telemetry Edge",
      icon: Cpu,
      desc: "Ultrasonic distance & electromagnetic flow sensors sample water velocity every 10s.",
      metric: "20 Active Edge Nodes"
    },
    {
      id: 5,
      title: "INGESTION",
      subtitle: "Backend REST API",
      icon: Database,
      desc: "Node.js/Express API processes live JSON payloads with zero telemetry loss.",
      metric: "HTTP POST /api/sensors/data"
    },
    {
      id: 6,
      title: "ANALYSIS",
      subtitle: "AI Risk Scoring Engine",
      icon: BrainCircuit,
      desc: "Multi-factor algorithm cross-references water height with flow deficit to detect blockages.",
      metric: "94.2% Prediction Accuracy"
    },
    {
      id: 7,
      title: "DISPATCH",
      subtitle: "Real-Time WebSocket",
      icon: ShieldAlert,
      desc: "Instantly notifies control room screens and triggers high-priority alarms.",
      metric: "< 2s Broadcast Latency"
    },
    {
      id: 8,
      title: "WORKER",
      subtitle: "Field Crew Mobilization",
      icon: Users,
      desc: "Nearest available sanitation worker auto-dispatched with exact GPS coordinates.",
      metric: "Auto-Assigned Dispatch"
    },
    {
      id: 9,
      title: "CLEARED",
      subtitle: "Resolution & Normal Flow",
      icon: CheckCircle2,
      desc: "Blockage de-silted, flow restored to 25 L/min, alert archived in municipal registry.",
      metric: "Incident Resolved"
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Digital City Architecture &amp; AI Risk Prediction
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Closed-loop urban stormwater lifecycle: from atmospheric precipitation to automated municipal resolution.
          </p>
        </div>
      </div>

      {/* SECTION 15: DIGITAL CITY VIEW (SYSTEM WORKFLOW PIPELINE) */}
      <div className="p-6 ent-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Section 15: Municipal Digital City Architecture</span>
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              End-to-End Automated Flood Prevention Pipeline
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click any step to inspect technical details</span>
        </div>

        {/* Visual Pipeline Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 relative">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative p-3 rounded-lg border transition cursor-pointer flex flex-col items-center text-center ${
                  isCurrent
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center mb-1.5 ${
                    isCurrent ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-medium mb-0.5">
                  0{step.id}
                </span>
                <h4 className="text-[11px] font-semibold text-slate-900 leading-tight uppercase">
                  {step.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Selected Pipeline Step Inspector Card */}
        {activeStep && (
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            {(() => {
              const current = pipelineSteps.find((s) => s.id === activeStep);
              if (!current) return null;
              const Icon = current.icon;
              return (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-blue-600 font-semibold uppercase">
                          Phase 0{current.id}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900">{current.title} — {current.subtitle}</h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                        {current.desc}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-center shrink-0">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Telemetry Metric</span>
                    <span className="font-mono text-xs font-semibold text-slate-900">{current.metric}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* SECTION 14: SMART RISK PREDICTION SECTION */}
      <div className="p-6 ent-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Section 14: AI / Smart Risk Prediction Engine</span>
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Predictive Hydraulic Risk Index
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-variable algorithmic scoring evaluating water depth, velocity reduction %, and precipitation intensity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="ent-badge ent-badge-neutral text-xs">
              Model: UrbanHydraulic-RiskPredictor-v1.4
            </span>
          </div>
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictionsData?.predictions?.map((pred) => {
            const isCrit = pred.smartRiskCategory === "CRITICAL RISK";
            const isHigh = pred.smartRiskCategory === "HIGH RISK";

            return (
              <div
                key={pred.drainId}
                className={`ent-card p-5 flex flex-col justify-between ${
                  isCrit ? "border-red-200 bg-red-50/20" : isHigh ? "border-amber-200" : ""
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-blue-600 font-semibold">{pred.drainId}</span>
                      <h4 className="text-sm font-semibold text-slate-900">{pred.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{pred.location}</p>
                    </div>
                  </div>

                  {/* Drain Risk Score */}
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 text-center my-3">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                      Drain Risk Score
                    </span>
                    <div className="mt-1 flex items-baseline justify-center gap-1">
                      <span className={`text-3xl font-bold ${
                        pred.aiRiskScore >= 80 ? "text-red-600" :
                        pred.aiRiskScore >= 60 ? "text-amber-700" : "text-emerald-600"
                      }`}>
                        {pred.aiRiskScore}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>

                    <div className="mt-2">
                      <span className={`ent-badge text-[10px] ${
                        pred.aiRiskScore >= 80 ? "ent-badge-danger" :
                        pred.aiRiskScore >= 60 ? "ent-badge-warning" : "ent-badge-success"
                      }`}>
                        {pred.smartRiskCategory}
                      </span>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex justify-between">
                      <span>Water Elevation Factor:</span>
                      <span className="text-slate-800 font-mono font-medium">{pred.breakdown?.waterLevelContribution} / 45 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flow Velocity Deficit:</span>
                      <span className="text-slate-800 font-mono font-medium">{pred.breakdown?.flowDeficitContribution} / 30 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stormwater Deluge:</span>
                      <span className="text-slate-800 font-mono font-medium">{pred.breakdown?.rainfallContribution} / 15 pts</span>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="mt-3.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-[11px] text-slate-600">
                    <span className="text-slate-800 font-semibold block mb-0.5">Municipal Recommendation:</span>
                    {pred.recommendedAction}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
