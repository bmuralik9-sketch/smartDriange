import React, { useState } from "react";
import {
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Compass,
  ArrowRight,
  CheckCheck,
  Camera,
  Layers,
  Activity
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export function WorkerPortal({ alerts = [], complaints = [], drains = [], onRefresh, onNavigate }) {
  const { currentUser } = useAuth();
  const workerName = currentUser?.name || "K. Venkateswara Rao";
  const workerId = currentUser?.workerId || "WRK-101";

  const [dutyStatus, setDutyStatus] = useState("available");
  const [resolutionText, setResolutionText] = useState({});
  const [resolvingId, setResolvingId] = useState(null);

  // Filter tasks assigned to this specific worker
  const myAlerts = alerts.filter(
    (a) => a.assignedWorker && a.assignedWorker.includes(workerId)
  );

  const myComplaints = complaints.filter(
    (c) => c.assignedWorker && c.assignedWorker.includes(workerId)
  );

  const handleStartTask = async (task, type) => {
    try {
      if (type === "alert") {
        await api.updateAlert(task.alertId, { status: "In Progress" });
      } else {
        await api.updateComplaint(task.complaintId, { status: "Worker Dispatched" });
      }
      setDutyStatus("busy");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveTask = async (task, type) => {
    try {
      const id = type === "alert" ? task.alertId : task.complaintId;
      setResolvingId(id);
      const notes = resolutionText[id] || "Debris and silt cleared with suction hose. Hydraulic flow restored.";

      if (type === "alert") {
        await api.updateAlert(task.alertId, {
          status: "Resolved",
          resolutionNotes: notes
        });
      } else {
        await api.updateComplaint(task.complaintId, {
          status: "Resolved",
          resolutionNotes: notes
        });
      }

      setDutyStatus("available");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Worker Profile & Duty Header */}
      <div className="p-5 ent-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-lg">
              👷
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="ent-badge ent-badge-warning text-[10px] uppercase">
                  Field Sanitation Officer
                </span>
                <span className="text-xs font-mono font-medium text-slate-500">{workerId}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {workerName}
              </h1>
              <p className="text-xs text-slate-500">
                Assigned Zone: <span className="text-slate-800 font-medium">{currentUser?.area || "Vijayawada Central"}</span>
              </p>
            </div>
          </div>

          {/* Duty Status Selector */}
          <div className="ent-segmented self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium px-2">Duty:</span>
            {[
              { id: "available", label: "Ready" },
              { id: "busy", label: "Active" },
              { id: "offline", label: "Off-duty" }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setDutyStatus(st.id)}
                className={`ent-segmented-btn ${dutyStatus === st.id ? "active" : ""}`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Counters */}
        <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Tasks</span>
            <p className="text-xl font-bold text-amber-600 mt-0.5">
              {myAlerts.filter((a) => a.status !== "Resolved").length + myComplaints.filter((c) => c.status !== "Resolved").length}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Resolved Today</span>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {myAlerts.filter((a) => a.status === "Resolved").length + myComplaints.filter((c) => c.status === "Resolved").length + 2}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Shift Hours</span>
            <p className="text-xl font-bold text-blue-600 mt-0.5">5.5 hrs</p>
          </div>
        </div>
      </div>

      {/* Task Queue Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-blue-600" />
          <span>My Assigned Field Work Orders</span>
        </h2>

        {myAlerts.length === 0 && myComplaints.length === 0 ? (
          <div className="p-12 text-center ent-card text-slate-500">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-800">No Pending De-Silting Work Orders</p>
            <p className="text-xs text-slate-500 mt-1">All drainage conduits in your zone operating smoothly.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* 1. Sensor Alerts Assigned */}
            {myAlerts.map((alert) => {
              const isResolved = alert.status === "Resolved";
              return (
                <div
                  key={alert.alertId}
                  className={`p-4 rounded-lg border space-y-3 ${
                    isResolved
                      ? "border-slate-200 bg-slate-50/50 opacity-80"
                      : "border-red-200 bg-red-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-red-900">{alert.alertId}</span>
                    <StatusBadge status={alert.status} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{alert.location}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alert.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-[10px]">Water Level:</span>
                      <strong className="text-red-700 ml-1 font-semibold">{alert.waterLevel || 92}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Flow Rate:</span>
                      <strong className="text-amber-800 ml-1 font-semibold">{alert.flowRate || 0.8} L/m</strong>
                    </div>
                  </div>

                  {!isResolved ? (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        placeholder="Add resolution notes (e.g. Cleared 20kg silt)..."
                        value={resolutionText[alert.alertId] || ""}
                        onChange={(e) =>
                          setResolutionText({ ...resolutionText, [alert.alertId]: e.target.value })
                        }
                        className="ent-input w-full text-xs"
                      />

                      <div className="flex items-center gap-2">
                        {alert.status !== "In Progress" && (
                          <button
                            onClick={() => handleStartTask(alert, "alert")}
                            className="flex-1 ent-btn ent-btn-secondary text-xs"
                          >
                            Start Work
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveTask(alert, "alert")}
                          className="flex-1 ent-btn ent-btn-success text-xs"
                        >
                          Mark Cleared
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-800 font-medium pt-1 flex items-center gap-1.5">
                      <CheckCheck className="h-4 w-4 text-emerald-600" />
                      <span>Task Completed &amp; Flow Restored</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 2. Citizen Complaints Assigned */}
            {myComplaints.map((c) => {
              const isResolved = c.status === "Resolved";
              return (
                <div
                  key={c.complaintId}
                  className={`p-4 rounded-lg border space-y-3 ${
                    isResolved
                      ? "border-slate-200 bg-slate-50/50 opacity-80"
                      : "border-blue-200 bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-blue-900">{c.complaintId}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{c.category}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{c.location}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                    </div>
                    {c.photoUrl && (
                      <img src={c.photoUrl} alt="Complaint" className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                    )}
                  </div>

                  {!isResolved ? (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        placeholder="Resolution comments..."
                        value={resolutionText[c.complaintId] || ""}
                        onChange={(e) =>
                          setResolutionText({ ...resolutionText, [c.complaintId]: e.target.value })
                        }
                        className="ent-input w-full text-xs"
                      />

                      <button
                        onClick={() => handleResolveTask(c, "complaint")}
                        className="w-full ent-btn ent-btn-success text-xs"
                      >
                        Complete Citizen Task
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-800 font-medium pt-1 flex items-center gap-1.5">
                      <CheckCheck className="h-4 w-4 text-emerald-600" />
                      <span>Grievance Resolved On-Site</span>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}
      </div>

    </div>
  );
}
