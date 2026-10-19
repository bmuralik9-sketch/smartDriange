import React from "react";
import { AlertTriangle, CheckCircle, UserCheck, MapPin, X, Droplets, Wind, ShieldAlert } from "lucide-react";

export function EmergencyModal({
  alert,
  onClose,
  onAcknowledge,
  onAssignWorker,
  onViewMap,
  onResolve
}) {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg ent-card p-6 border-red-200 shadow-xl">
        
        {/* Urgent Header Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="ent-badge ent-badge-danger text-[10px] font-semibold uppercase tracking-wider">
                  Action Required
                </span>
                <span className="text-xs font-mono font-medium text-slate-500">{alert.alertId}</span>
              </div>
              <h3 className="mt-0.5 text-base font-bold text-slate-900">
                Drainage Telemetry Alert
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Problem Description & Location */}
        <div className="my-5 space-y-3.5">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Location
                </span>
                <p className="text-sm font-semibold text-slate-900">{alert.location}</p>
                <p className="text-xs font-mono text-blue-600 mt-0.5">Drain: {alert.drainId}</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-red-200 bg-red-50/40">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-800">
              Problem &amp; Hydraulic Risk
            </span>
            <p className="text-xs font-medium text-red-950 mt-1 leading-relaxed">{alert.message}</p>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg border border-red-100 bg-red-50/30">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Water Level</span>
              <p className="text-2xl font-bold text-red-600 mt-0.5">{alert.waterLevel || 91}%</p>
            </div>
            <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/30">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Flow Rate</span>
              <p className="text-2xl font-bold text-amber-700 mt-0.5">{alert.flowRate || 0.8} L/m</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
          <button
            onClick={() => onAcknowledge(alert)}
            className="ent-btn ent-btn-secondary text-xs"
          >
            Acknowledge
          </button>

          <button
            onClick={() => onAssignWorker(alert)}
            className="ent-btn ent-btn-primary text-xs"
          >
            Assign Worker
          </button>

          <button
            onClick={() => onViewMap(alert)}
            className="ent-btn ent-btn-secondary text-xs"
          >
            View on Map
          </button>

          <button
            onClick={() => onResolve(alert)}
            className="ent-btn ent-btn-success text-xs"
          >
            Mark Resolved
          </button>
        </div>

      </div>
    </div>
  );
}
