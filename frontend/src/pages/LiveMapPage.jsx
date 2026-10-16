import React, { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap
} from "react-leaflet";
import L from "leaflet";
import {
  Layers,
  Filter,
  Droplets,
  Wind,
  CloudRain,
  ShieldAlert,
  UserCheck,
  Compass,
  AlertTriangle,
  Info,
  MapPin,
  Eye,
  Bus,
  Car,
  Truck,
  Activity,
  Radio,
  Sparkles,
  X,
  Gauge,
  Navigation
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";

// Helper function to create custom animated sensor pin icons for Leaflet
function createCustomPin(status, drainId) {
  let color = "#10B981"; // Normal (green)
  let ring = "#059669";
  let isCritical = false;

  const s = status ? status.toLowerCase() : "normal";
  if (s === "warning" || s === "slow") {
    color = "#F59E0B"; // Yellow
    ring = "#D97706";
  } else if (s === "high" || s === "high risk" || s === "stopped") {
    color = "#F97316"; // Orange
    ring = "#EA580C";
  } else if (s === "critical" || s === "blocked") {
    color = "#EF4444"; // Red
    ring = "#DC2626";
    isCritical = true;
  } else if (s === "offline") {
    color = "#64748B"; // Gray
    ring = "#475569";
  }

  // Working Mode Animation: Active concentric sonar pulse + blinking center LED
  const svgHtml = `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <!-- Active Working Mode Ultrasonic Sonar Wave Rings -->
      ${s !== "offline" ? `
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; border: 2px solid ${color}; opacity: 0.8; animation: sonarRing 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;"></div>
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; border: 1.5px dashed ${color}; opacity: 0.6; animation: sonarRing 2s cubic-bezier(0, 0.2, 0.8, 1) infinite; animation-delay: 0.6s;"></div>
      ` : ""}
      
      <!-- Core Transducer Node with Blinking LED -->
      <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background-color: ${color}; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2;">
        <div style="width: 7px; height: 7px; border-radius: 50%; background-color: #ffffff; ${s !== "offline" ? "animation: ledFlicker 0.6s ease-in-out infinite;" : ""}"></div>
      </div>

      <!-- Micro ID Label Tag -->
      <div style="position: absolute; bottom: -8px; background: rgba(15,23,42,0.85); color: #ffffff; font-size: 8px; font-weight: bold; font-family: monospace; padding: 1px 4px; border-radius: 4px; white-space: nowrap; pointer-events: none; border: 1px solid rgba(255,255,255,0.2);">
        ${drainId ? drainId.replace("DRAIN-", "D-") : "NODE"}
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-leaflet-marker",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

// Helper function to create animated vehicle & public transit markers
function createVehiclePin(vehicle, isJammed) {
  const iconEmoji = vehicle.type === "bus" ? "🚌" : vehicle.type === "auto" ? "🛺" : vehicle.type === "truck" ? "🚚" : "🚗";
  const speedColor = vehicle.speed < 10 ? "#ef4444" : vehicle.speed < 20 ? "#f59e0b" : "#10b981";

  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #ffffff; border: 1.5px solid ${isJammed ? "#ef4444" : "#0284c7"}; border-radius: 20px; padding: 2px 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 3px; font-size: 11px;">
        <span>${iconEmoji}</span>
        <span style="font-size: 9px; font-weight: bold; font-family: monospace; color: ${speedColor};">${vehicle.speed}k/h</span>
      </div>
      <div style="font-size: 8px; font-weight: bold; color: #1e293b; background: rgba(255,255,255,0.9); padding: 0 3px; border-radius: 2px; margin-top: 1px; white-space: nowrap; border: 0.5px solid #cbd5e1;">
        ${vehicle.label}
      </div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "custom-vehicle-marker",
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
}

// Controller component to smoothly pan/zoom map on selection
function MapViewController({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export function LiveMapPage({
  drains = [],
  sensors = [],
  canals = [],
  roads = [],
  rainfall = {},
  onAssignWorker,
  onOpenAlert
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [mapType, setMapType] = useState("streets"); // 'streets', 'satellite', 'terrain'
  const [showCanals, setShowCanals] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [selectedDrain, setSelectedDrain] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [mapTarget, setMapTarget] = useState({ center: [16.4400, 80.5600], zoom: 11 });

  // Real AP Capital Region Cities coordinates
  const cityPresets = [
    { name: "Entire AP Capital Region", coords: [16.4400, 80.5600], zoom: 11 },
    { name: "Vijayawada", coords: [16.5062, 80.6480], zoom: 13 },
    { name: "Mangalagiri", coords: [16.4344, 80.5670], zoom: 14 },
    { name: "Tadepalli", coords: [16.4820, 80.6050], zoom: 14 },
    { name: "Guntur", coords: [16.3067, 80.4365], zoom: 13 }
  ];

  // Flood-Prone Geographic Zones across Vijayawada, Guntur, Mangalagiri, Tadepalli
  const floodZones = [
    {
      name: "Benz Circle Lowland Catchment (Vijayawada)",
      risk: "CRITICAL",
      coords: [
        [16.5050, 80.6430],
        [16.5050, 80.6530],
        [16.4950, 80.6530],
        [16.4950, 80.6430]
      ]
    },
    {
      name: "Mangalagiri Hill Runoff Depression (Mangalagiri)",
      risk: "CRITICAL",
      coords: [
        [16.4390, 80.5620],
        [16.4390, 80.5720],
        [16.4290, 80.5720],
        [16.4290, 80.5620]
      ]
    },
    {
      name: "Guntur Brodipet Commercial Trench (Guntur)",
      risk: "HIGH",
      coords: [
        [16.3160, 80.4290],
        [16.3160, 80.4390],
        [16.3050, 80.4390],
        [16.3050, 80.4290]
      ]
    },
    {
      name: "Tadepalli Krishna Riverside Buffer (Tadepalli)",
      risk: "HIGH",
      coords: [
        [16.4870, 80.5980],
        [16.4870, 80.6120],
        [16.4770, 80.6120],
        [16.4770, 80.5980]
      ]
    }
  ];

  // Filtered Drains
  const filteredDrains = useMemo(() => {
    if (filterStatus === "all") return drains;
    if (filterStatus === "blocked") return drains.filter((d) => d.status === "blocked");
    if (filterStatus === "warning") return drains.filter((d) => d.status === "warning" || d.status === "slow");
    if (filterStatus === "normal") return drains.filter((d) => d.status === "normal");
    if (filterStatus === "offline") {
      const offlineSensorDrainIds = sensors.filter((s) => s.status === "offline").map((s) => s.drainId);
      return drains.filter((d) => offlineSensorDrainIds.includes(d.drainId));
    }
    return drains;
  }, [drains, sensors, filterStatus]);

  // Robust Tile Configurations fixing blank satellite & terrain tiles
  const tileConfigs = {
    streets: {
      url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxNativeZoom: 20,
      maxZoom: 22,
      attribution: "&copy; Google Maps Streets"
    },
    satellite: {
      url: "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxNativeZoom: 19,
      maxZoom: 22,
      attribution: "&copy; Google Satellite & Roads (Hybrid)"
    },
    terrain: {
      url: "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxNativeZoom: 15, // CRUCIAL: Google terrain stops at 15; scaling allows deep zoom without blank grey tiles
      maxZoom: 22,
      attribution: "&copy; Google Physical Terrain"
    }
  };

  // When a sensor or drain is clicked: highlight drain and find connected road
  const handleSelectDrain = (drain) => {
    setSelectedDrain(drain);
    // Find connected road by drainId or location proximity
    const connected = roads.find(
      (r) => r.drainId === drain.drainId || r.drainCondition?.includes(drain.drainId)
    );
    setSelectedRoad(connected || null);
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-140px)] ent-card p-3 rounded-2xl overflow-hidden">
      
      {/* Top Map Control Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 p-3 ent-card mb-2">
        
        {/* Left: Map Title & Status Summary */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Live Google Maps GIS Telemetry &amp; Transit Grid
              <span className="ent-badge ent-badge-neutral text-[10px] font-mono">
                WORKING MODE
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Vijayawada • Guntur • Mangalagiri • Tadepalli ({filteredDrains.length} Active Nodes • {roads.length} Monitored Roadways)
            </p>
          </div>
        </div>

        {/* Center: City Jump Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider hidden md:inline">
            Focus:
          </span>
          {cityPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setSelectedDrain(null);
                setSelectedRoad(null);
                setMapTarget({ center: preset.coords, zoom: preset.zoom });
              }}
              className="ent-btn ent-btn-secondary text-xs py-1 px-2.5"
            >
              📍 {preset.name}
            </button>
          ))}
        </div>

        {/* Google Maps Layer Selector (Streets / Satellite / Terrain) */}
        <div className="ent-segmented">
          <button
            onClick={() => setMapType("streets")}
            className={`ent-segmented-btn ${mapType === "streets" ? "active" : ""}`}
            title="Clean Google Street Map"
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`ent-segmented-btn ${mapType === "satellite" ? "active" : ""}`}
            title="High-Resolution Hybrid Satellite Imagery"
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapType("terrain")}
            className={`ent-segmented-btn ${mapType === "terrain" ? "active" : ""}`}
            title="Topographical Elevation & Physical Terrain"
          >
            ⛰️ Terrain
          </button>
        </div>

      </div>

      {/* Secondary Filter Sub-bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-xs mb-2 ent-card">
        
        {/* Drain Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All Drains" },
            { id: "blocked", label: "Critical Blocked" },
            { id: "warning", label: "Warning / Slow" },
            { id: "normal", label: "Normal Flow" },
            { id: "offline", label: "Sensor Offline" }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterStatus(pill.id)}
              className={`text-xs font-medium whitespace-nowrap transition select-none ${
                filterStatus === pill.id
                  ? "ent-btn ent-btn-primary py-1 px-3 text-xs"
                  : "ent-btn ent-btn-secondary py-1 px-3 text-xs text-slate-700"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Layer Checkboxes */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-700 flex-wrap">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showCanals}
              onChange={(e) => setShowCanals(e.target.checked)}
              className="rounded text-[#2874F0] focus:ring-0"
            />
            <span>Canals Flow</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showRoads}
              onChange={(e) => setShowRoads(e.target.checked)}
              className="rounded text-red-500 focus:ring-0"
            />
            <span>Waterlogged Roads</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showVehicles}
              onChange={(e) => setShowVehicles(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>🚗 Live Transport &amp; Vehicles</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showFloodZones}
              onChange={(e) => setShowFloodZones(e.target.checked)}
              className="rounded text-amber-500 focus:ring-0"
            />
            <span>Flood Zones</span>
          </label>
        </div>

      </div>

      {/* Main Interactive Leaflet Map Container */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={mapTarget.center}
          zoom={mapTarget.zoom}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <MapViewController
            center={selectedDrain ? [selectedDrain.latitude, selectedDrain.longitude] : mapTarget.center}
            zoom={selectedDrain ? 15 : mapTarget.zoom}
          />

          {/* High-Definition Google Maps TileLayer (Fixed Satellite & Terrain) */}
          <TileLayer
            key={mapType}
            attribution={tileConfigs[mapType].attribution}
            url={tileConfigs[mapType].url}
            subdomains={tileConfigs[mapType].subdomains}
            maxNativeZoom={tileConfigs[mapType].maxNativeZoom}
            maxZoom={tileConfigs[mapType].maxZoom}
          />

          {/* 1. Krishna River Basin Drainage Canals with Animated Flow Pulse */}
          {showCanals &&
            canals.map((canal) => (
              <Polyline
                key={canal.canalId}
                positions={canal.coordinates}
                pathOptions={{
                  color: "#0284c7",
                  weight: 6,
                  opacity: 0.9,
                  dashArray: "10, 8"
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-sans">
                    <span className="font-bold text-[#0284c7] text-sm flex items-center gap-1.5">
                      🌊 {canal.name}
                    </span>
                    <p className="text-slate-700 text-[11px] mt-1 font-medium">Flow: {canal.flowDirection}</p>
                    <p className="text-slate-500 text-[11px]">Condition: <strong>{canal.status}</strong></p>
                  </div>
                </Popup>
              </Polyline>
            ))}

          {/* 2. Waterlogged Roads & Connected Road Corridors */}
          {showRoads &&
            roads.map((road) => {
              const isSelected = selectedRoad && selectedRoad.roadId === road.roadId;
              const isLinkedToSelectedDrain = selectedDrain && (
                road.drainId === selectedDrain.drainId ||
                road.drainCondition?.includes(selectedDrain.drainId)
              );
              const isHighlighted = isSelected || isLinkedToSelectedDrain;

              const strokeColor = road.floodRisk === "CRITICAL" ? "#ef4444" : road.floodRisk === "HIGH" ? "#f97316" : "#0284c7";

              return (
                <Polyline
                  key={road.roadId}
                  positions={road.coordinates}
                  pathOptions={{
                    color: isHighlighted ? "#ec4899" : strokeColor,
                    weight: isHighlighted ? 9 : 5,
                    opacity: isHighlighted ? 1 : 0.85,
                    dashArray: isHighlighted ? "8, 6" : undefined
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedRoad(road);
                      const matchingDrain = drains.find((d) => d.drainId === road.drainId);
                      if (matchingDrain) setSelectedDrain(matchingDrain);
                    }
                  }}
                >
                  <Popup>
                    <div className="p-2 text-xs font-sans">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-slate-900 text-sm">🛣️ {road.name}</span>
                        <StatusBadge status={road.floodRisk} size="sm" />
                      </div>
                      <p className="text-slate-600">City: <strong>{road.city}</strong></p>
                      <p className="text-slate-700">Water Depth on Asphalt: <span className="font-bold text-red-600">{road.waterDepthCm} cm</span></p>
                      <p className="text-slate-600">Traffic Congestion: <span className="text-amber-600 font-semibold">{road.trafficCondition} ({road.trafficSpeedKmH || 15} km/h)</span></p>
                      <p className="text-slate-500 text-[10px] mt-1">Transit: {road.transitImpact || "Normal municipal services"}</p>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

          {/* 3. Live Moving Public Transport & Vehicles on Roads */}
          {showVehicles &&
            roads.map((road) => {
              const shouldShowVehiclesForRoad = !selectedRoad || selectedRoad.roadId === road.roadId;
              if (!shouldShowVehiclesForRoad || !road.vehicles || road.vehicles.length === 0) return null;

              return road.vehicles.map((v, vIdx) => {
                // Interpolate along the road coordinates
                const coordsCount = road.coordinates.length;
                const coordIdx = Math.min(coordsCount - 1, vIdx % coordsCount);
                const pos = road.coordinates[coordIdx];
                const isJammed = road.trafficCondition === "Jammed";

                return (
                  <Marker
                    key={`${road.roadId}-veh-${v.id}`}
                    position={[pos[0] + (vIdx * 0.0003), pos[1] + (vIdx * 0.0003)]}
                    icon={createVehiclePin(v, isJammed)}
                  >
                    <Popup>
                      <div className="p-2 text-xs font-sans min-w-[200px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">
                          <span>{v.type === "bus" ? "🚌 APSRTC Bus" : v.type === "auto" ? "🛺 Auto-Rickshaw" : v.type === "truck" ? "🚚 Freight Truck" : "🚗 Vehicle"}</span>
                          <span className="text-[10px] text-blue-600 ml-auto">{v.label}</span>
                        </div>
                        <p className="text-slate-600">Corridor: <strong>{road.name}</strong></p>
                        <p className="text-slate-700">Current Velocity: <strong className="text-blue-600">{v.speed} km/h</strong></p>
                        <p className="text-slate-500 text-[10px] mt-1">Water Depth: {road.waterDepthCm} cm ({road.trafficCondition})</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              });
            })}

          {/* 4. AP Flood Zones */}
          {showFloodZones &&
            floodZones.map((zone, idx) => (
              <Polygon
                key={idx}
                positions={zone.coords}
                pathOptions={{
                  color: zone.risk === "CRITICAL" ? "#ef4444" : "#f59e0b",
                  fillColor: zone.risk === "CRITICAL" ? "#ef4444" : "#f59e0b",
                  fillOpacity: 0.22,
                  weight: 2,
                  dashArray: "5, 5"
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-sans">
                    <span className="font-bold text-amber-700 block">⚠️ Flood-Prone Urban Depression</span>
                    <p className="text-slate-900 font-bold mt-0.5">{zone.name}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">High water retention risk during monsoonal cloudbursts.</p>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* 5. Working Mode Animated Drain & Sensor Markers */}
          {filteredDrains.map((drain) => {
            const linkedSensor = sensors.find((s) => s.drainId === drain.drainId);
            const isOffline = linkedSensor && linkedSensor.status === "offline";
            const markerStatus = isOffline ? "offline" : drain.status;

            return (
              <Marker
                key={drain.drainId}
                position={[drain.latitude, drain.longitude]}
                icon={createCustomPin(markerStatus, drain.drainId)}
                eventHandlers={{
                  click: () => handleSelectDrain(drain)
                }}
              >
                <Popup className="drain-map-popup">
                  <div className="p-2.5 text-xs font-sans text-slate-800 min-w-[260px]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">
                          {drain.drainId} • {linkedSensor?.sensorId || "ESP32-NODE"}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{drain.name}</h4>
                      </div>
                      <StatusBadge status={markerStatus} size="sm" />
                    </div>

                    <p className="text-[11px] text-slate-600 mb-2">
                      📍 {drain.location}
                    </p>

                    {/* Telemetry Stats */}
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-50 p-2 text-center mb-2.5 border border-slate-200">
                      <div>
                        <span className="block text-[10px] text-slate-500">Water Level</span>
                        <span className={`text-sm font-bold ${drain.waterLevel > 80 ? "text-red-600" : "text-slate-900"}`}>
                          {drain.waterLevel}%
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Flow Rate</span>
                        <span className="text-sm font-bold text-blue-600">
                          {drain.flowRate} <span className="text-[9px]">L/m</span>
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Rainfall</span>
                        <span className="text-sm font-bold text-emerald-600">
                          {rainfall.currentMm || 34.5} <span className="text-[9px]">mm</span>
                        </span>
                      </div>
                    </div>

                    {/* Blockage Alert Context */}
                    {drain.status === "blocked" && (
                      <div className="mb-2.5 rounded-lg border border-red-200 bg-red-50 p-2 text-[11px] text-red-700">
                        🚨 <strong>Possible blockage detected:</strong> Rising water level combined with restricted flow rate.
                      </div>
                    )}

                    {/* Sensor Telemetry Pulse */}
                    <div className="space-y-1 text-[11px] text-slate-600 mb-3 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-blue-900 font-medium">
                          <Radio className="h-3 w-3 text-blue-600 animate-pulse" />
                          Ultrasonic Working Mode:
                        </span>
                        <span className="font-bold text-emerald-600">Continuous 868MHz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connected Roadway:</span>
                        <span className="font-semibold text-slate-900">
                          {roads.find((r) => r.drainId === drain.drainId)?.name || "Adjacent Municipal Road"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned Staff:</span>
                        <span className="font-semibold text-slate-900">{drain.assignedWorker || "None"}</span>
                      </div>
                    </div>

                    {/* Quick Worker Assignment Action */}
                    {onAssignWorker && (
                      <button
                        onClick={() =>
                          onAssignWorker({
                            drainId: drain.drainId,
                            location: drain.location,
                            alertId: `ALT-MAP-${drain.drainId}`,
                            riskLevel: drain.riskLevel
                          })
                        }
                        className="w-full ent-btn ent-btn-primary py-1.5 text-xs font-semibold uppercase"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Assign Worker</span>
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Dedicated "Road & Public Transport Live Intel" Panel on Sensor Click */}
        {selectedRoad && (
          <div className="absolute top-4 right-4 z-[400] w-84 sm:w-96 ent-card p-4 rounded-xl shadow-xl border-blue-300 animate-in fade-in slide-in-from-top-2 bg-white/95 backdrop-blur-md">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-2.5">
              <div>
                <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-blue-500 animate-spin" />
                  Connected Road &amp; Transport Telemetry
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                  {selectedRoad.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedRoad.city} • Linked to {selectedRoad.drainId}
                </span>
              </div>
              <button
                onClick={() => setSelectedRoad(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Road Waterlogging & Traffic Gauges */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Water Depth on Road</span>
                <span className={`text-base font-bold ${selectedRoad.waterDepthCm > 15 ? "text-red-600" : "text-blue-600"}`}>
                  {selectedRoad.waterDepthCm} cm
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {selectedRoad.status || "Surface ponding"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Traffic Congestion</span>
                <span className={`text-base font-bold ${selectedRoad.trafficCondition === "Jammed" ? "text-red-600" : selectedRoad.trafficCondition === "Slow" ? "text-amber-600" : "text-emerald-600"}`}>
                  {selectedRoad.trafficCondition}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  {selectedRoad.trafficSpeedKmH || 12} km/h speed
                </span>
              </div>
            </div>

            {/* Public Transport Impact */}
            <div className="mb-3 p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <Bus className="h-3.5 w-3.5 text-amber-700" />
                <span>Public Transit &amp; APSRTC Impact:</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                {selectedRoad.transitImpact || "Normal bus schedules active across corridor."}
              </p>
            </div>

            {/* Live Vehicles Detected on this Corridor */}
            {selectedRoad.vehicles && selectedRoad.vehicles.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Vehicles Detected on Corridor ({selectedRoad.vehicles.length}):
                </span>
                <div className="space-y-1">
                  {selectedRoad.vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between text-xs p-1.5 rounded-md bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{v.type === "bus" ? "🚌" : v.type === "auto" ? "🛺" : v.type === "truck" ? "🚚" : "🚗"}</span>
                        <span className="font-semibold text-slate-800">{v.label}</span>
                      </div>
                      <span className={`font-mono text-[11px] font-bold ${v.speed < 10 ? "text-red-600" : "text-emerald-600"}`}>
                        {v.speed} km/h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternate Dry Route Recommendation */}
            <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900">
              <span className="font-bold">Recommended Dry Bypass: </span>
              {selectedRoad.waterDepthCm > 15
                ? "Divert through elevated flyover ramp or adjacent ring expressway."
                : "Road is passable with low gear. Avoid curb drainage grates."}
            </div>
          </div>
        )}

        {/* Legend Overlay at Bottom Left (Enterprise Card) */}
        <div className="absolute bottom-4 left-4 z-[400] ent-card p-3 text-[11px] rounded-xl shadow-md bg-white/95 backdrop-blur-md">
          <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-2">
            Status &amp; Telemetry Legend
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Normal Transmitting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Warning / Slow Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>Critical Blocked Node</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Sensor Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-3.5 bg-[#0284c7] rounded" />
              <span>Krishna Canal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-3.5 bg-pink-500 rounded" />
              <span>Active Transit Road</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
