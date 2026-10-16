import React from "react";

export function StatusBadge({ status, size = "md" }) {
  if (!status) return null;
  const s = status.toLowerCase();

  let badgeClass = "ent-badge ent-badge-neutral";
  let dotColor = "bg-slate-400";
  let label = status.toUpperCase();

  if (s === "normal" || s === "online" || s === "available" || s === "resolved") {
    badgeClass = "ent-badge ent-badge-green";
    dotColor = "bg-emerald-500";
  } else if (s === "warning" || s === "slow" || s === "busy" || s === "medium" || s === "in progress") {
    badgeClass = "ent-badge ent-badge-amber";
    dotColor = "bg-amber-500";
  } else if (s === "high risk" || s === "high" || s === "stopped" || s === "assigned") {
    badgeClass = "ent-badge bg-orange-50 text-orange-700 border-orange-200";
    dotColor = "bg-orange-500";
  } else if (s === "critical" || s === "blocked" || s === "severe inundation" || s === "jammed") {
    badgeClass = "ent-badge ent-badge-red font-bold";
    dotColor = "bg-red-500 animate-pulse";
  } else if (s === "offline" || s === "unassigned") {
    badgeClass = "ent-badge ent-badge-neutral";
    dotColor = "bg-slate-400";
  }

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-[10px]" 
    : "px-2.5 py-0.5 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium transition select-none ${badgeClass} ${sizeClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
}
