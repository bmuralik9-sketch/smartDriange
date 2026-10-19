import React from "react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "normal", // 'normal' (green), 'warning' (yellow), 'high' (orange), 'critical' (red), 'cyan'
  trend,
  trendPositive = true,
  onClick
}) {
  const iconBgMap = {
    normal: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border border-amber-100",
    high: "bg-orange-50 text-orange-600 border border-orange-100",
    critical: "bg-red-50 text-red-600 border border-red-100",
    cyan: "bg-blue-50 text-blue-600 border border-blue-100"
  };

  const iconStyle = iconBgMap[variant] || iconBgMap.normal;

  return (
    <div
      onClick={onClick}
      className={`ent-card p-5 transition-all select-none ${
        onClick ? "ent-card-interactive" : ""
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyle}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
              trendPositive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 truncate font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
