import React from "react";
import {
  Car,
  AlertTriangle,
  Compass,
  Droplets,
  Layers,
  ArrowRight,
  ShieldAlert,
  Gauge
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";

export function RoadFloodingPage({ roads = [], onNavigate }) {
  const criticalRoads = roads.filter((r) => r.floodRisk === "CRITICAL" || r.floodRisk === "HIGH");

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Car className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Road Flood &amp; Waterlogging Monitoring
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time urban thoroughfare water ponding and traffic disruption tracker.
          </p>
        </div>

        <button
          onClick={() => onNavigate("map")}
          className="ent-btn ent-btn-secondary text-xs"
        >
          <Compass className="h-3.5 w-3.5 text-slate-500" />
          <span>View Inundation GIS Map</span>
        </button>
      </div>

      {/* Summary Alert Banner if roads are submerged */}
      {criticalRoads.length > 0 && (
        <div className="p-4 ent-card border-red-200 bg-red-50/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-950">
                Severe Road Inundation Detected at {criticalRoads.length} Major Corridors
              </h3>
              <p className="text-xs text-red-800 mt-0.5">
                Water ponding exceeding vehicle threshold depth (&gt; 15 cm) due to blocked storm conduits. Municipal traffic rerouting recommended.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monitored Roads Grid Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roads.map((road) => {
          const isCritical = road.floodRisk === "CRITICAL";
          const isHigh = road.floodRisk === "HIGH";

          return (
            <div
              key={road.roadId}
              className={`ent-card p-5 flex flex-col justify-between ${
                isCritical ? "border-red-200 bg-red-50/20" : isHigh ? "border-amber-200" : ""
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold">
                      {road.roadId}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">{road.name}</h3>
                  </div>
                  <StatusBadge status={road.floodRisk} />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Water Depth</span>
                    <p className={`text-2xl font-bold mt-0.5 ${road.waterDepthCm > 15 ? "text-red-600" : "text-cyan-700"}`}>
                      {road.waterDepthCm} <span className="text-xs font-normal">cm</span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Traffic Flow</span>
                    <p className={`text-sm font-semibold mt-1.5 ${
                      road.trafficCondition === "Jammed" ? "text-red-600" :
                      road.trafficCondition === "Slow" ? "text-amber-700" : "text-emerald-700"
                    }`}>
                      {road.trafficCondition}
                    </p>
                  </div>
                </div>

                {/* Context Attributes */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Rainfall:</span>
                    <span className="font-medium text-slate-800">{road.rainfallIntensity}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Drain Condition:</span>
                    <span className={`font-medium ${road.drainCondition.includes("Blocked") ? "text-red-600" : "text-slate-800"}`}>
                      {road.drainCondition}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Inundation Status:</span>
                    <span className="font-semibold text-blue-700">{road.status}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <button
                onClick={() => onNavigate("map")}
                className="mt-4 w-full ent-btn ent-btn-secondary text-xs"
              >
                <span>View Road Geometry on Map</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
