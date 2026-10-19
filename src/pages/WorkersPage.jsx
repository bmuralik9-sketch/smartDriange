import React, { useState } from "react";
import {
  Users,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Activity,
  Briefcase
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";
import { api } from "../services/api";

export function WorkersPage({ workers = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const handleToggleStatus = async (worker) => {
    try {
      setUpdatingId(worker.workerId);
      const nextStatus =
        worker.status === "available"
          ? "busy"
          : worker.status === "busy"
          ? "offline"
          : "available";

      await api.updateWorker(worker.workerId, { status: nextStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update worker status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || w.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Municipal Sanitation Staff Roster &amp; Dispatch
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Emergency field technicians, de-silt truck operators, and zone response teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="ent-badge ent-badge-success text-xs font-medium">
            {workers.filter((w) => w.status === "available").length} Workers Available
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 ent-card">
        <div className="ent-segmented">
          {["all", "available", "busy", "offline"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`ent-segmented-btn capitalize ${selectedStatus === st ? "active" : ""}`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, worker ID or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ent-input w-full pl-8 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Workers Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((worker) => (
          <div
            key={worker.workerId}
            className="ent-card p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                    {worker.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{worker.name}</h3>
                    <span className="text-[11px] font-mono text-blue-600 font-medium">
                      {worker.workerId}
                    </span>
                  </div>
                </div>
                <StatusBadge status={worker.status} />
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono">{worker.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{worker.area}</span>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 mt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block mb-0.5">
                    Current Deployment Task
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {worker.currentTask}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                <span>Active Alerts: </span>
                <strong className="text-slate-900">{worker.alertsAssigned}</strong>
              </div>

              <button
                disabled={updatingId === worker.workerId}
                onClick={() => handleToggleStatus(worker)}
                className="ent-btn ent-btn-secondary text-xs py-1 px-2.5 disabled:opacity-50"
              >
                Toggle Status
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
