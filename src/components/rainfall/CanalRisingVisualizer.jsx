import React, { useState, useEffect } from "react";
import {
  Waves,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  CloudRain,
  ShieldAlert,
  Gauge,
  Sliders,
  CheckCircle2,
  Activity,
  Wind
} from "lucide-react";

export function CanalRisingVisualizer({
  currentRainfall = 34.5,
  onRainfallChange
}) {
  const [selectedCanalId, setSelectedCanalId] = useState("CANAL-VJA-1");
  const [simulatedMm, setSimulatedMm] = useState(currentRainfall);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Sync with prop when prop changes
  useEffect(() => {
    setSimulatedMm(currentRainfall);
  }, [currentRainfall]);

  const canalsList = [
    {
      id: "CANAL-VJA-1",
      name: "Ryves Canal Main Trunk",
      city: "Vijayawada",
      maxDepthM: 4.8,
      normalDepthM: 1.6,
      widthM: 14,
      bankCapacityM3s: 180,
      zone: "Vijayawada Central",
      description: "Primary Krishna Barrage discharge trunk running past Governorpet & Gunadala."
    },
    {
      id: "CANAL-VJA-2",
      name: "Bandar Canal Arterial",
      city: "Vijayawada",
      maxDepthM: 4.2,
      normalDepthM: 1.4,
      widthM: 12,
      bankCapacityM3s: 140,
      zone: "Vijayawada-Machilipatnam Corridor",
      description: "Direct south-eastern discharge conduit alongside NH-65 highway."
    },
    {
      id: "CANAL-MGL-3",
      name: "Mangalagiri Hill Runoff Linker",
      city: "Mangalagiri",
      maxDepthM: 3.6,
      normalDepthM: 0.9,
      widthM: 8,
      bankCapacityM3s: 85,
      zone: "Panakala Temple Catchment",
      description: "Receives intense sudden hillock silt run-off from Mangalagiri Reserve forest."
    },
    {
      id: "CANAL-GNT-4",
      name: "Guntur Brodipet Collector Trunk",
      city: "Guntur",
      maxDepthM: 3.8,
      normalDepthM: 1.1,
      widthM: 9,
      bankCapacityM3s: 95,
      zone: "Guntur Commercial Trench",
      description: "Underground-to-open culvert trunk draining Arundelpet and Brodipet commercial sectors."
    }
  ];

  const activeCanal = canalsList.find((c) => c.id === selectedCanalId) || canalsList[0];

  // Calculate realistic hydraulic elevation based on rainfall mm/h
  // Max bank height is activeCanal.maxDepthM
  // Low rain (0-15 mm): normalDepthM to ~2.2m
  // Moderate (15-40 mm): ~2.2m to ~3.4m
  // Heavy (40-65 mm): ~3.4m to maxDepthM (near overflow)
  // Extreme (>65 mm): exceeds maxDepthM (spillover / overflow!)
  const elevationFactor = Math.min(1.3, (simulatedMm / 60));
  const currentDepth = Number(
    Math.min(
      activeCanal.maxDepthM * 1.25,
      activeCanal.normalDepthM + (activeCanal.maxDepthM - activeCanal.normalDepthM) * elevationFactor
    ).toFixed(2)
  );

  const fillPercentage = Math.min(125, Math.round((currentDepth / activeCanal.maxDepthM) * 100));
  const overflowMeters = Number(Math.max(0, currentDepth - activeCanal.maxDepthM).toFixed(2));
  const overflowing = currentDepth >= activeCanal.maxDepthM;

  useEffect(() => {
    setIsOverflowing(overflowing);
  }, [overflowing]);

  const dischargeM3s = Math.round(
    activeCanal.bankCapacityM3s * (currentDepth / activeCanal.maxDepthM) * (1 + (simulatedMm > 50 ? 0.2 : 0))
  );

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSimulatedMm(val);
    if (onRainfallChange) onRainfallChange(val);
  };

  const handlePresetClick = (mm) => {
    setSimulatedMm(mm);
    if (onRainfallChange) onRainfallChange(mm);
  };

  // Water height percentage for visual SVG (0 to 100% of canal basin, with overflow rising up into bank headers)
  // Basin visual height is 220px. Base floor is at Y=230px, Crest is at Y=70px (160px height).
  // Overflow can reach up to Y=35px.
  const visualWaterY = Math.max(
    35,
    Math.min(225, 230 - ((currentDepth / activeCanal.maxDepthM) * 160))
  );
  const waterHeight = 230 - visualWaterY;

  return (
    <div className="ent-card p-5 space-y-5 border-blue-200 shadow-sm bg-gradient-to-b from-white to-slate-50/50">
      
      {/* Header & Canal Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Waves className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Realistic Canal Water Elevation &amp; Overflow Simulator
                {overflowing ? (
                  <span className="ent-badge ent-badge-danger animate-bounce text-xs">
                    🚨 CANAL OVERFLOWING
                  </span>
                ) : fillPercentage > 85 ? (
                  <span className="ent-badge ent-badge-warning text-xs">
                    ⚠️ HIGH SURGE RISK
                  </span>
                ) : (
                  <span className="ent-badge ent-badge-success text-xs">
                    NORMAL DISCHARGE
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time hydrodynamic simulation showing storm water rising above Krishna &amp; Guntur canal embankments.
              </p>
            </div>
          </div>
        </div>

        {/* Canal Selection Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {canalsList.map((canal) => (
            <button
              key={canal.id}
              onClick={() => setSelectedCanalId(canal.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                selectedCanalId === canal.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {canal.name.split(" ")[0]} ({canal.city})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Rainfall Slider & Intensity Presets */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-800">
              Simulate Precipitation Load (Watch Water Level Rise Live):
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Active Rainfall:</span>
            <span className="font-mono text-sm font-bold text-blue-600">
              {simulatedMm} mm/h
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">0mm</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={simulatedMm}
            onChange={handleSliderChange}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-[11px] font-mono text-slate-400">100mm/h</span>
        </div>

        {/* Quick Intensity Presets */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Presets:</span>
          {[
            { label: "0mm (Dry)", mm: 0 },
            { label: "8mm (Light)", mm: 8 },
            { label: "25mm (Moderate)", mm: 25 },
            { label: "52mm (Heavy Surge)", mm: 52 },
            { label: "82mm (Extreme Overflow 🚨)", mm: 82 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.mm)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                Math.abs(simulatedMm - preset.mm) < 3
                  ? "bg-blue-100 text-blue-800 border border-blue-300 font-semibold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Realistic Canal Simulation Stage */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 text-white shadow-inner">
        
        {/* Sky / Cloud Weather Backdrop */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 via-slate-800 to-transparent pointer-events-none z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <CloudRain className="h-6 w-6 text-blue-400 animate-bounce" />
            <div>
              <span className="text-xs font-bold text-slate-200">
                {activeCanal.name} — {activeCanal.zone}
              </span>
              <p className="text-[10px] text-slate-400">
                Catchment width: {activeCanal.widthM}m • Design crest height: {activeCanal.maxDepthM}m
              </p>
            </div>
          </div>

          {/* Overflow Warning Banner Overlay */}
          {overflowing && (
            <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-lg border border-red-400 shadow-lg animate-pulse">
              <AlertTriangle className="h-4 w-4" />
              <div className="text-right">
                <span className="text-xs font-bold block uppercase tracking-wider">
                  Bank Overtopping (+{overflowMeters}m)
                </span>
                <span className="text-[10px] text-red-100">
                  Floodwater spilling into adjacent roadways
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Animated Rain Falling Particles */}
        {simulatedMm > 0 && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
            {Array.from({ length: Math.min(30, Math.max(8, Math.round(simulatedMm / 3))) }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-blue-300 rounded-full animate-rain-drop"
                style={{
                  left: `${(i * 3.3 + (i % 5) * 2)}%`,
                  height: `${12 + (i % 4) * 8}px`,
                  animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                  animationDelay: `${(i * 0.08) % 1}s`,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        )}

        {/* Cross-Section SVG Graphic with Fluid Waves and Embankment Overtopping */}
        <div className="relative w-full h-[320px] pt-12">
          <svg
            className="w-full h-full"
            viewBox="0 0 900 320"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Linear Gradient for Fluid Canal Water */}
              <linearGradient id="canalWaterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={overflowing ? "#0284c7" : "#0ea5e9"} stopOpacity="0.9" />
                <stop offset="40%" stopColor="#0369a1" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="1" />
              </linearGradient>

              {/* Water Spill Gradient */}
              <linearGradient id="spillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
              </linearGradient>

              {/* Concrete Embankment Texture Gradient */}
              <linearGradient id="concreteGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Left Embankment / Retaining Wall (Concrete sloped bank) */}
            <polygon
              points="0,320 0,70 120,70 180,240 180,320"
              fill="url(#concreteGrad)"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Left Roadway / Ground Level (Top of bank at Y=70) */}
            <rect x="0" y="65" width="120" height="8" fill="#0f172a" />
            <line x1="0" y1="65" x2="120" y2="65" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
            <text x="15" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">
              🛣️ Road Embankment
            </text>

            {/* Right Embankment / Retaining Wall (Concrete sloped bank) */}
            <polygon
              points="900,320 900,70 780,70 720,240 720,320"
              fill="url(#concreteGrad)"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Right Roadway / Ground Level */}
            <rect x="780" y="65" width="120" height="8" fill="#0f172a" />
            <line x1="780" y1="65" x2="900" y2="65" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
            <text x="795" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">
              🏢 Commercial Buffer
            </text>

            {/* Canal Bed Floor (Y=240 to Y=320) */}
            <rect x="180" y="240" width="540" height="80" fill="#1e293b" />
            {/* Silt Layer on Canal Floor */}
            <rect x="180" y="235" width="540" height="15" fill="#78350f" opacity="0.8" />
            <text x="400" y="270" fill="#64748b" fontSize="11" fontStyle="italic">
              Canal Bed Silt Layer (35cm depth)
            </text>

            {/* Elevation Depth Gauge Markers on Left Wall (0m to 5m) */}
            {[
              { m: "0m", y: 235 },
              { m: "1m", y: 200 },
              { m: "2m", y: 165 },
              { m: "3m", y: 130 },
              { m: "4m (Max)", y: 95 },
              { m: "Crest (4.8m)", y: 70 }
            ].map((mark) => (
              <g key={mark.m}>
                <line x1="160" y1={mark.y} x2="190" y2={mark.y} stroke="#94a3b8" strokeWidth="1.5" />
                <text x="110" y={mark.y + 4} fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                  {mark.m}
                </text>
              </g>
            ))}

            {/* Crest Spillway Limit Line (Red dashed line at Y=70) */}
            <line
              x1="120"
              y1="70"
              x2="780"
              y2="70"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,4"
              opacity="0.8"
            />
            <text x="400" y="65" fill="#f87171" fontSize="11" fontWeight="bold">
              ▲ 4.8m BANK OVERFLOW THRESHOLD
            </text>

            {/* Realistic Dynamic Fluid Body (Clips to canal bounds or spills over when overflowing) */}
            {/* Main Fluid Polygon inside Canal */}
            <polygon
              points={`
                180,240 
                180,${visualWaterY} 
                ${overflowing ? `0,${visualWaterY} 0,70 120,70` : `180,${visualWaterY}`}
                300,${visualWaterY - (simulatedMm > 30 ? 4 : 2)} 
                450,${visualWaterY + (simulatedMm > 30 ? 5 : 2)} 
                600,${visualWaterY - (simulatedMm > 30 ? 4 : 2)} 
                ${overflowing ? `780,70 900,70 900,${visualWaterY}` : `720,${visualWaterY}`}
                720,${visualWaterY} 
                720,240
              `}
              fill="url(#canalWaterGrad)"
            />

            {/* Overflow Cascades Spilling onto Roadways when Water > 4.8m */}
            {overflowing && (
              <>
                {/* Left bank waterfall / flood sheet */}
                <rect
                  x="0"
                  y="65"
                  width="125"
                  height={Math.min(100, (currentDepth - activeCanal.maxDepthM) * 60 + 15)}
                  fill="url(#spillGrad)"
                  opacity="0.85"
                />
                <circle cx="30" cy="80" r="12" fill="#ffffff" opacity="0.3" className="animate-ping" />
                <circle cx="80" cy="85" r="16" fill="#ffffff" opacity="0.3" className="animate-ping" />
                <text x="15" y="105" fill="#ffffff" fontSize="10" fontWeight="bold">
                  💦 Street Spill ({overflowMeters}m)
                </text>

                {/* Right bank waterfall / flood sheet */}
                <rect
                  x="775"
                  y="65"
                  width="125"
                  height={Math.min(100, (currentDepth - activeCanal.maxDepthM) * 60 + 15)}
                  fill="url(#spillGrad)"
                  opacity="0.85"
                />
                <circle cx="820" cy="82" r="14" fill="#ffffff" opacity="0.3" className="animate-ping" />
                <text x="790" y="105" fill="#ffffff" fontSize="10" fontWeight="bold">
                  💦 Commercial Spill
                </text>
              </>
            )}

            {/* Animated Wave Surface (Sine Wave 1) */}
            <path
              d={`
                M 150,${visualWaterY} 
                Q 270,${visualWaterY - 7} 390,${visualWaterY} 
                T 630,${visualWaterY} 
                T 750,${visualWaterY}
              `}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              opacity="0.9"
            />

            {/* Animated Wave Surface (Sine Wave 2 - Faster secondary ripple) */}
            <path
              d={`
                M 160,${visualWaterY + 2} 
                Q 290,${visualWaterY + 6} 420,${visualWaterY} 
                T 660,${visualWaterY + 3} 
                T 740,${visualWaterY}
              `}
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="2"
              opacity="0.75"
            />

            {/* Hydrodynamic Velocity Arrows showing Flow Direction */}
            {[260, 420, 580].map((x) => (
              <g key={x} opacity={0.75}>
                <line
                  x1={x}
                  y1={visualWaterY + 40}
                  x2={x + 35}
                  y2={visualWaterY + 40}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                />
                <polygon
                  points={`${x + 35},${visualWaterY + 36} ${x + 45},${visualWaterY + 40} ${x + 35},${visualWaterY + 44}`}
                  fill="#ffffff"
                />
              </g>
            ))}

            {/* In-Water Live Telemetry Readout Box */}
            <g transform={`translate(360, ${Math.min(180, Math.max(90, visualWaterY + 20))})`}>
              <rect x="0" y="0" width="180" height="48" rx="8" fill="#0f172a" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="15" y="20" fill="#94a3b8" fontSize="10" fontWeight="bold">CURRENT CANAL DEPTH</text>
              <text x="15" y="40" fill={overflowing ? "#f87171" : "#38bdf8"} fontSize="18" fontWeight="bold" fontFamily="monospace">
                {currentDepth} m <tspan fontSize="12" fill="#cbd5e1">({fillPercentage}%)</tspan>
              </text>
            </g>

          </svg>
        </div>

        {/* Bottom Canal Status Footer */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-3 px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-400 block text-[10px]">Crest Freeboard:</span>
              <span className={`font-mono font-bold ${overflowing ? "text-red-400" : "text-emerald-400"}`}>
                {overflowing ? `Overtopping by +${overflowMeters}m` : `${(activeCanal.maxDepthM - currentDepth).toFixed(2)}m clearance remaining`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Hydrodynamic Discharge:</span>
              <span className="font-mono font-bold text-blue-400">
                {dischargeM3s} m³/s
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Sump Pump Status:</span>
              <span className="font-mono font-semibold text-slate-200">
                {simulatedMm > 50 ? "4 of 4 High-Flow Turbines ENGAGED" : "Standby (Automatic Trigger at 80%)"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${overflowing ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
            <span className="text-[11px] text-slate-300 font-medium">
              {activeCanal.description}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
