import React, { useState } from "react";
import {
  FileText,
  UserCheck,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  Search,
  Filter,
  Eye,
  X,
  ShieldCheck
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";
import { api } from "../services/api";

export function ComplaintsAdminPage({ complaints = [], workers = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [inspectComplaint, setInspectComplaint] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const handleAssignWorker = async (complaintId, workerLabel) => {
    try {
      await api.updateComplaint(complaintId, {
        assignedWorker: workerLabel,
        status: "Worker Dispatched"
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || c.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Citizen Drainage Complaints &amp; Photo Triage
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review citizen-reported blockages, inspect photographic evidence, and dispatch zone maintenance crews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="ent-badge ent-badge-neutral text-xs">
            {complaints.filter((c) => c.status !== "Resolved").length} Open Grievances
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 ent-card">
        <div className="ent-segmented">
          {["all", "pending", "in review", "worker dispatched", "resolved"].map((st) => (
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
            placeholder="Search complaint ID or citizen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ent-input w-full pl-8 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Complaints List Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.complaintId}
            className="ent-card p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-blue-600">{c.complaintId}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Drain: {c.drainId}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{c.category}</h3>
                </div>
                <StatusBadge status={c.status} size="sm" />
              </div>

              {/* Photo Thumbnail if attached */}
              {c.photoUrl ? (
                <div
                  onClick={() => setInspectComplaint(c)}
                  className="relative rounded-lg overflow-hidden mb-3 border border-slate-200 group cursor-pointer bg-slate-50"
                >
                  <img src={c.photoUrl} alt="Evidence" className="w-full h-36 object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1">
                    <Eye className="h-4 w-4" />
                    <span>View Evidence</span>
                  </div>
                </div>
              ) : (
                <div className="h-20 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs mb-3">
                  No Photo Attached
                </div>
              )}

              {/* Citizen & Location */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{c.location}</span>
                </div>

                <p className="text-slate-700 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {c.description}
                </p>

                <div className="text-[11px] text-slate-500 pt-1">
                  Citizen: <strong className="text-slate-900">{c.citizenName}</strong> ({c.citizenPhone})
                </div>
              </div>
            </div>

            {/* Worker Dispatch Selector */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Assigned Worker:</span>
                <span className="font-semibold text-slate-800">{c.assignedWorker || "Unassigned"}</span>
              </div>

              {c.status !== "Resolved" && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handleAssignWorker(c.complaintId, e.target.value);
                  }}
                  className="ent-input w-full text-xs py-1.5"
                >
                  <option value="" disabled>Dispatch Worker to Site...</option>
                  {workers.map((w) => (
                    <option key={w.workerId} value={`${w.name} (${w.workerId})`}>
                      {w.name} ({w.area} - {w.status})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Photo Modal */}
      {inspectComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="font-semibold text-sm text-slate-900">Photographic Evidence • {inspectComplaint.complaintId}</span>
              <button onClick={() => setInspectComplaint(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <img src={inspectComplaint.photoUrl} alt="Inspection" className="w-full h-72 object-cover rounded-lg border border-slate-200" />
            <p className="text-xs text-slate-600 mt-3">{inspectComplaint.description}</p>
          </div>
        </div>
      )}

    </div>
  );
}
