import React, { useState, useEffect } from "react";
import {
  Cpu,
  Radio,
  Battery,
  Wifi,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  Activity,
  Terminal,
  RefreshCw,
  Sparkles,
  Zap,
  Waves,
  ArrowDown
} from "lucide-react";
import { StatusBadge } from "../components/common/StatusBadge";
import { api } from "../services/api";

export function SensorsPage({ sensors = [], drains = [], onRefresh }) {
  const [selectedSensor, setSelectedSensor] = useState(sensors[0] || null);
  const [testPayload, setTestPayload] = useState({
    sensorId: "ESP32-AP-DRAIN-001",
    drainId: "DRAIN-001",
    waterLevel: 85,
    flowRate: 3.2,
    rainfall: 44,
    temperature: 28,
    battery: 92,
    signalStrength: -68
  });
  const [testResult, setTestResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [packetTick, setPacketTick] = useState(0);

  // Sync selected sensor with changes from props
  useEffect(() => {
    if (!selectedSensor && sensors.length > 0) {
      setSelectedSensor(sensors[0]);
    } else if (selectedSensor) {
      const updated = sensors.find((s) => s.sensorId === selectedSensor.sensorId);
      if (updated) setSelectedSensor(updated);
    }
  }, [sensors]);

  // Live packet simulation ticker for working mode
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketTick((prev) => prev + 1);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const handleTestPost = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await api.sendSensorData(testPayload);
      setTestResult({ success: true, data: res });
      if (onRefresh) onRefresh();
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const activeSensor = selectedSensor || sensors[0] || {
    sensorId: "ESP32-AP-DRAIN-001",
    drainId: "DRAIN-001",
    waterLevel: 78,
    flowRate: 14.2,
    type: "Ultrasonic Level Sensor",
    battery: 88,
    signalStrength: -68,
    status: "active"
  };

  const linkedDrain = drains.find((d) => d.drainId === activeSensor.drainId);

  // Distance from transducer (mounted at top of culvert 300cm high) down to water surface
  const surfaceDistanceCm = Math.round(300 * (1 - (activeSensor.waterLevel / 100)));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 ent-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Cpu className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              ESP32 IoT Sensor Fleet Management
              <span className="ent-badge ent-badge-neutral text-[10px] font-mono">
                WORKING MODE ANIMATIONS ACTIVE
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Telemetry status, battery health, Wi-Fi signal, and ultrasonic radar sensing across 20 AP edge nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="ent-badge ent-badge-success text-xs font-medium flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
            {sensors.filter((s) => s.status !== "offline").length} of {sensors.length} Transmitting Live
          </span>
        </div>
      </div>

      {/* ACTIVE WORKING MODE ANIMATED TRANSDUCER & HARDWARE VISUALIZER */}
      <div className="p-6 ent-card bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 text-white border-blue-500/30 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Interactive Microcontroller Hardware & Ultrasonic Beam Animation */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            
            {/* ESP32 Controller Box */}
            <div className="relative w-64 p-3.5 rounded-xl border border-slate-700 bg-slate-800 shadow-xl text-center">
              {/* Antenna with RF Radiation Waves */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="h-6 w-1.5 bg-slate-400 rounded-t-sm" />
                <div className="absolute -top-2 h-8 w-8 rounded-full border border-blue-400/60 animate-sonar-ring pointer-events-none" />
                <div className="absolute -top-4 h-12 w-12 rounded-full border border-blue-400/30 animate-sonar-ring pointer-events-none" style={{ animationDelay: "0.8s" }} />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-700 pb-1.5 mb-2">
                <span className="text-blue-400 font-bold">{activeSensor.sensorId}</span>
                <span className="text-slate-400">ESP32-S3 IoT</span>
              </div>

              {/* Hardware LED Indicators */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono mb-2">
                <div className="flex items-center justify-center gap-1 bg-slate-900/60 p-1 rounded border border-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs" />
                  <span className="text-slate-300">PWR: ON</span>
                </div>
                <div className="flex items-center justify-center gap-1 bg-slate-900/60 p-1 rounded border border-slate-700">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-led-blink shadow-xs" />
                  <span className="text-slate-300">TX: 868M</span>
                </div>
                <div className="flex items-center justify-center gap-1 bg-slate-900/60 p-1 rounded border border-slate-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-led-blink shadow-xs" style={{ animationDelay: "0.3s" }} />
                  <span className="text-slate-300">RX: ACK</span>
                </div>
              </div>

              {/* Transducer Cone Horn */}
              <div className="mx-auto mt-2 h-4 w-12 bg-slate-600 rounded-b-md border border-slate-500" />
            </div>

            {/* Ultrasonic Sonar Radar Waves travelling down */}
            <div className="relative w-64 h-32 flex flex-col items-center justify-around py-1 overflow-hidden pointer-events-none">
              <div className="w-16 h-4 border-b-2 border-blue-400 rounded-b-full opacity-90 animate-sonar-ring" />
              <div className="w-28 h-6 border-b-2 border-cyan-400 rounded-b-full opacity-70 animate-sonar-ring" style={{ animationDelay: "0.5s" }} />
              <div className="w-44 h-8 border-b-2 border-sky-400 rounded-b-full opacity-50 animate-sonar-ring" style={{ animationDelay: "1s" }} />
              
              {/* Distance equation indicator */}
              <div className="absolute top-1/2 -translate-y-1/2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-500/40 shadow-xs">
                Time-of-Flight: {(surfaceDistanceCm * 5.8).toFixed(0)} µs &rarr; Distance: {surfaceDistanceCm} cm
              </div>
            </div>

            {/* Water Surface inside Culvert */}
            <div className="w-72 h-10 rounded-t-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 relative overflow-hidden border-t-2 border-cyan-300 shadow-lg">
              <div className="absolute inset-0 opacity-40 animate-wave-flow bg-[radial-gradient(circle,rgba(255,255,255,0.4)_10%,transparent_20%)]" style={{ backgroundSize: "16px 16px" }} />
              <div className="text-center text-[10px] font-bold text-white uppercase tracking-wider pt-2">
                🌊 Drain Water Surface ({activeSensor.waterLevel}% Elevation)
              </div>
            </div>

          </div>

          {/* Right: Selected Node Telemetry & Real-Time Packet Stream */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-750 pb-2">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                  Working Mode: Continuous Radar &amp; Telemetry
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {linkedDrain?.name || activeSensor.drainId}
                </h3>
                <p className="text-xs text-slate-400">
                  {linkedDrain?.location || "Andhra Pradesh Capital Drainage Sector"}
                </p>
              </div>
              <StatusBadge status={activeSensor.status} />
            </div>

            {/* 4 Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-750 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Water Elevation</span>
                <span className={`text-base font-bold ${activeSensor.waterLevel > 80 ? "text-red-400" : "text-cyan-400"}`}>
                  {activeSensor.waterLevel}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-750 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flow Velocity</span>
                <span className="text-base font-bold text-blue-400 font-mono">
                  {activeSensor.flowRate} <span className="text-[10px]">L/m</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-750 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Battery Cell</span>
                <span className={`text-base font-bold ${activeSensor.battery < 20 ? "text-red-400" : "text-emerald-400"}`}>
                  {activeSensor.battery}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-750 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">RF Signal</span>
                <span className="text-base font-bold text-purple-400 font-mono">
                  {activeSensor.signalStrength} <span className="text-[10px]">dBm</span>
                </span>
              </div>
            </div>

            {/* Live Packet Streaming Console Log */}
            <div className="rounded-xl border border-slate-750 bg-black/70 p-3 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-1 mb-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE RF PACKET FEED (PACKET #{packetTick + 1042})
                </span>
                <span className="text-[10px]">LoRaWAN v1.0.3</span>
              </div>
              <div className="text-emerald-400 truncate">
                &gt; TX [64B] {activeSensor.sensorId} &rarr; AP-GATEWAY-VJA-1 (RSSI: {activeSensor.signalStrength}dBm, SNR: 9.2dB)
              </div>
              <div className="text-cyan-300 truncate">
                &gt; PAYLOAD: &#123; wl: {activeSensor.waterLevel}%, fr: {activeSensor.flowRate}L/m, bat: {activeSensor.battery}%, t: 29°C &#125;
              </div>
              <div className="text-slate-400 truncate">
                &gt; ACK RECEIVED [200 OK] &bull; Gateway Latency: 22ms &bull; Blockage status: {activeSensor.waterLevel > 80 ? "CRITICAL RISK" : "NORMAL"}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Grid: Sensors Fleet Table & Interactive Test Dispatcher */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Sensors Fleet Table */}
        <div className="lg:col-span-8 p-6 ent-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Connected Edge Nodes ({sensors.length})
              </h3>
              <p className="text-xs text-slate-500">
                Click any sensor row below to load into the animated transducer inspection stage
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Firmware: v2.5.0-esp32</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-medium">
                  <th className="pb-2.5 px-2">SENSOR ID</th>
                  <th className="pb-2.5 px-2">DRAIN ID</th>
                  <th className="pb-2.5 px-2">SENSOR TYPE</th>
                  <th className="pb-2.5 px-2">WATER LEVEL</th>
                  <th className="pb-2.5 px-2">FLOW RATE</th>
                  <th className="pb-2.5 px-2">BATTERY</th>
                  <th className="pb-2.5 px-2">SIGNAL</th>
                  <th className="pb-2.5 px-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sensors.map((sensor) => {
                  const isSelected = activeSensor.sensorId === sensor.sensorId;
                  return (
                    <tr
                      key={sensor.sensorId}
                      onClick={() => {
                        setSelectedSensor(sensor);
                        setTestPayload({
                          ...testPayload,
                          sensorId: sensor.sensorId,
                          drainId: sensor.drainId,
                          waterLevel: sensor.waterLevel,
                          flowRate: sensor.flowRate,
                          battery: sensor.battery,
                          signalStrength: sensor.signalStrength
                        });
                      }}
                      className={`cursor-pointer transition ${
                        isSelected ? "bg-blue-50/80 font-semibold" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-2.5 px-2 font-mono font-semibold text-blue-600 flex items-center gap-1.5">
                        <Radio className={`h-3 w-3 ${sensor.status !== "offline" ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} />
                        {sensor.sensorId}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-600">
                        {sensor.drainId}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700">
                        {sensor.type}
                      </td>
                      <td className="py-2.5 px-2 font-medium">
                        <span className={sensor.waterLevel > 80 ? "text-red-600 font-semibold" : "text-slate-800"}>
                          {sensor.waterLevel}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-700">
                        {sensor.flowRate} L/m
                      </td>
                      <td className="py-2.5 px-2 font-medium">
                        <span className={`inline-flex items-center gap-1 ${sensor.battery < 20 ? "text-red-600 font-bold" : "text-slate-700"}`}>
                          <Battery className="h-3.5 w-3.5" />
                          {sensor.battery}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 font-mono">
                        <span className="inline-flex items-center gap-1">
                          <Wifi className="h-3.5 w-3.5 text-blue-500" />
                          {sensor.signalStrength} dBm
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <StatusBadge status={sensor.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Live Hardware Ingestion Tester */}
        <div className="lg:col-span-4 p-6 ent-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Terminal className="h-4 w-4 text-blue-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">ESP32 Hardware Ingestion</h3>
                <p className="text-[11px] text-slate-500">Simulate HTTP POST /api/sensors/data</p>
              </div>
            </div>

            <form onSubmit={handleTestPost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Target Sensor ID</label>
                <input
                  type="text"
                  value={testPayload.sensorId}
                  onChange={(e) => setTestPayload({ ...testPayload, sensorId: e.target.value })}
                  className="ent-input w-full font-mono py-1.5"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Linked Drain ID</label>
                <input
                  type="text"
                  value={testPayload.drainId}
                  onChange={(e) => setTestPayload({ ...testPayload, drainId: e.target.value })}
                  className="ent-input w-full font-mono py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Water Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={testPayload.waterLevel}
                    onChange={(e) => setTestPayload({ ...testPayload, waterLevel: Number(e.target.value) })}
                    className="ent-input w-full font-mono py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Flow Rate (L/m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={testPayload.flowRate}
                    onChange={(e) => setTestPayload({ ...testPayload, flowRate: Number(e.target.value) })}
                    className="ent-input w-full font-mono py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Rainfall (mm)</label>
                  <input
                    type="number"
                    value={testPayload.rainfall}
                    onChange={(e) => setTestPayload({ ...testPayload, rainfall: Number(e.target.value) })}
                    className="ent-input w-full font-mono py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Battery (%)</label>
                  <input
                    type="number"
                    value={testPayload.battery}
                    onChange={(e) => setTestPayload({ ...testPayload, battery: Number(e.target.value) })}
                    className="ent-input w-full font-mono py-1.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full mt-2 ent-btn ent-btn-primary py-2 text-xs font-semibold disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSending ? "Transmitting Packet..." : "Send Ingestion Packet"}</span>
              </button>
            </form>
          </div>

          {/* Test Response Feedback */}
          {testResult && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              testResult.success 
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}>
              <div className="font-semibold mb-1">
                {testResult.success ? "Telemetry Ingested & Evaluated" : "Error Ingesting"}
              </div>
              {testResult.data && (
                <div className="space-y-0.5 text-[11px] font-mono">
                  <div>Risk: {testResult.data.evaluation?.smartRiskCategory}</div>
                  <div>Blockage Detected: {String(testResult.data.evaluation?.isBlockageDetected)}</div>
                  {testResult.data.alertCreated && (
                    <div className="text-red-700 font-semibold">Alert Triggered: {testResult.data.alertCreated}</div>
                  )}
                  {testResult.data.assignedWorker && (
                    <div className="text-emerald-700">Worker Assigned: {testResult.data.assignedWorker}</div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
