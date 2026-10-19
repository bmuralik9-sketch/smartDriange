import React, { useState } from "react";
import {
  UploadCloud,
  Camera,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  X,
  Image as ImageIcon,
  Check,
  Phone,
  FileText,
  Layers,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export function CitizenPortal({ drains = [], complaints = [], onRefresh }) {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("report"); // 'report' or 'my-complaints'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form State
  const [category, setCategory] = useState("Drain Blockage");
  const [drainId, setDrainId] = useState(drains[0]?.drainId || "DRAIN-001");
  const [location, setLocation] = useState("KR Market Vegetable Yard, Gate 2");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("high");
  const [photoPreview, setPhotoPreview] = useState(null);

  // Handle Photo selection & conversion to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload a photo under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !description) {
      alert("Please fill in the location and problem description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        citizenName: currentUser?.name || "Concerned Citizen",
        citizenPhone: currentUser?.phone || "+91 98480 33412",
        citizenEmail: currentUser?.email || "citizen@apdrainage.in",
        category,
        drainId,
        location,
        description,
        photoUrl: photoPreview || "",
        urgency
      };

      const res = await api.createComplaint(payload);
      setSuccessMessage(`Complaint lodged successfully! Reference ID: ${res.data?.complaintId || "CMP-NEW"}`);
      setDescription("");
      setPhotoPreview(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Complaint filing failed:", err);
      alert("Failed to submit complaint: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Citizen Banner / Welcome Card */}
      <div className="p-5 ent-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-lg">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="ent-badge ent-badge-neutral text-[10px] uppercase">
                  Citizen Civic Portal
                </span>
                <span className="text-xs text-slate-500">• Welcome, {currentUser?.name}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Report Drainage Obstruction or Waterlogging
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="ent-segmented self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("report")}
              className={`ent-segmented-btn ${activeTab === "report" ? "active" : ""}`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => setActiveTab("my-complaints")}
              className={`ent-segmented-btn ${activeTab === "my-complaints" ? "active" : ""}`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Track Complaints ({complaints.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-2.5 animate-in fade-in text-xs font-medium">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: REPORT ISSUE FORM WITH PHOTO UPLOAD */}
      {activeTab === "report" && (
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left 7 Cols: Complaint Form */}
          <div className="lg:col-span-7 p-6 ent-card">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-600" />
              <span>Submit Drainage Report with Photo Evidence</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Category & Urgency */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="ent-input w-full font-medium"
                  >
                    <option value="Drain Blockage">🚨 Drain Choked / Garbage Blockage</option>
                    <option value="Waterlogging">🌊 Road Inundation / Waterlogging</option>
                    <option value="Broken Cover">⚠️ Broken Grate / Missing Cover</option>
                    <option value="Foul Odor / Silt">☣️ Toxic Silt Accumulation / Odor</option>
                    <option value="Canal Overflow">💧 Krishna Canal Sluice Overflow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "low", label: "Low" },
                      { id: "medium", label: "Medium" },
                      { id: "high", label: "Urgent" }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setUrgency(lvl.id)}
                        className={`py-2 px-2 rounded-lg border text-center text-xs transition select-none ${
                          urgency === lvl.id
                            ? lvl.id === "high"
                              ? "bg-red-600 text-white border-red-600 font-semibold"
                              : "bg-slate-900 text-white border-slate-900 font-semibold"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drain Node & Exact Location */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nearest Monitored Canal</label>
                  <select
                    value={drainId}
                    onChange={(e) => setDrainId(e.target.value)}
                    className="ent-input w-full font-mono text-xs"
                  >
                    {drains.map((d) => (
                      <option key={d.drainId} value={d.drainId}>
                        {d.drainId} — {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Exact Landmark / Street Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Benz Circle Flyover Pillar 24, Vijayawada"
                      className="ent-input w-full pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the blockage, plastic waste trapped, water stagnation depth, or traffic disruptions..."
                  className="ent-input w-full"
                />
              </div>

              {/* PHOTO UPLOAD BOX */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Upload Photo Evidence <span className="text-blue-600">(Mandatory for Field Dispatch)</span>
                </label>
                
                {photoPreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 p-2 bg-slate-50">
                    <img
                      src={photoPreview}
                      alt="Drainage issue preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-4 right-4 h-7 w-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 transition"
                      title="Remove Photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="p-2 text-center text-xs text-emerald-700 font-medium">
                      ✓ Photo Attached &amp; Geotagged for Field Dispatch
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400 transition">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2 border border-blue-100">
                      <Camera className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      Click to Capture or Select Drain Photo
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full ent-btn ent-btn-primary py-2.5 text-xs font-semibold disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Lodging Complaint..." : "Lodge Complaint with Municipal Command"}</span>
              </button>

            </form>
          </div>

          {/* Right 5 Cols: Guidelines & Live Status of Nearby Drains */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* How Civic Redressal Works */}
            <div className="p-6 ent-card border-blue-100 bg-blue-50/30">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Automated Grievance Redressal</span>
              </h3>
              
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-blue-100">
                  <span className="flex h-5 w-5 rounded-full bg-blue-600 text-white items-center justify-center text-[11px] font-bold shrink-0">1</span>
                  <span><strong>AI Validation:</strong> Photo evidence and sensor telemetry are matched automatically.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-blue-100">
                  <span className="flex h-5 w-5 rounded-full bg-blue-600 text-white items-center justify-center text-[11px] font-bold shrink-0">2</span>
                  <span><strong>Sanitation Dispatch:</strong> High-suction silt cleaning truck assigned to the nearest worker.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-blue-100">
                  <span className="flex h-5 w-5 rounded-full bg-blue-600 text-white items-center justify-center text-[11px] font-bold shrink-0">3</span>
                  <span><strong>Site Clearance:</strong> Worker uploads resolution photo and marks drainage canal cleared.</span>
                </div>
              </div>
            </div>

            {/* Monitored Drains in your area */}
            <div className="p-6 ent-card">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>Nearby Municipal Monitored Canals</span>
              </h3>
              
              <div className="space-y-2">
                {drains.slice(0, 4).map((d) => (
                  <div
                    key={d.drainId}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-blue-600 font-semibold">{d.drainId}</span>
                      <p className="font-medium text-slate-900">{d.name}</p>
                      <p className="text-[11px] text-slate-500">{d.location}</p>
                    </div>
                    <StatusBadge status={d.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: MY TRACKED COMPLAINTS */}
      {activeTab === "my-complaints" && (
        <div className="p-6 ent-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              My Submitted Civic Grievances ({complaints.length})
            </h2>
            <button
              onClick={() => onRefresh && onRefresh()}
              className="ent-btn ent-btn-secondary text-xs py-1 px-3"
            >
              Refresh Status
            </button>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Camera className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">No Complaints Lodged Yet</p>
              <p className="text-xs mt-1 text-slate-500">If you notice water ponding or garbage blockages, use the Report Issue tab.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {complaints.map((c) => (
                <div
                  key={c.complaintId}
                  className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-blue-600">
                        {c.complaintId}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>

                    <h4 className="font-semibold text-sm text-slate-900">{c.category}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{c.location}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {c.description}
                    </p>

                    {c.photoUrl && (
                      <div className="mt-2.5">
                        <img
                          src={c.photoUrl}
                          alt="Evidence"
                          className="w-full h-36 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                    <span className="ent-badge ent-badge-neutral text-[10px]">
                      Worker: {c.assignedWorker || "Pending Dispatch"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
