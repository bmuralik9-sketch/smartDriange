import React, { useState } from "react";
import { X, UserCheck, ShieldCheck, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function AssignWorkerModal({ isOpen, onClose, alert, workers = [], onAssign }) {
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !alert) return null;

  const handleConfirm = async () => {
    if (!selectedWorkerId) return;
    const worker = workers.find((w) => w.workerId === selectedWorkerId);
    if (!worker) return;

    setSubmitting(true);
    await onAssign(alert, `${worker.name} (${worker.workerId})`);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg ent-card p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Assign Sanitation Worker</h3>
              <p className="text-xs text-slate-500">Alert: {alert.alertId} • {alert.location}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Worker List */}
        <div className="my-4 max-h-80 overflow-y-auto space-y-2 pr-1">
          {workers.map((worker) => {
            const isSelected = selectedWorkerId === worker.workerId;
            return (
              <div
                key={worker.workerId}
                onClick={() => setSelectedWorkerId(worker.workerId)}
                className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer select-none ${
                  isSelected
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{worker.name}</span>
                    <span className="text-xs font-mono text-slate-500">({worker.workerId})</span>
                    <StatusBadge status={worker.status} size="sm" />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {worker.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {worker.phone}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Active</span>
                  <span className="text-xs font-semibold text-slate-800">{worker.alertsAssigned} Assigned</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="ent-btn ent-btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            disabled={!selectedWorkerId || submitting}
            onClick={handleConfirm}
            className="ent-btn ent-btn-primary text-xs disabled:opacity-50"
          >
            {submitting ? "Assigning..." : "Confirm Dispatch"}
          </button>
        </div>

      </div>
    </div>
  );
}
