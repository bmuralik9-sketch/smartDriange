const fs = require("fs");
const path = require("path");
const { getIsUsingMock } = require("../config/db");
const defaultData = require("../config/defaultData");
const {
  DrainModel,
  SensorModel,
  SensorReadingModel,
  AlertModel,
  WorkerModel,
  RainfallModel,
  RoadFloodingModel,
  ComplaintModel
} = require("./schemas");

const initialComplaints = [
  {
    complaintId: "CMP-2026-001",
    citizenName: "Priya Sharma",
    citizenPhone: "+91 98450 33412",
    citizenEmail: "priya.sharma@gmail.com",
    category: "Drain Blockage",
    drainId: "DRAIN-007",
    location: "KR Market Vegetable Yard, Gate 2",
    description: "Plastic crates and vegetable waste have completely choked the perimeter drain grate. Water starting to pond on sidewalk.",
    photoUrl: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=600&q=80",
    urgency: "high",
    status: "Worker Dispatched",
    assignedWorker: "Mohan Lal (WRK-106)",
    resolutionNotes: "Dispatched Mohan Lal with manual desilt grabbers.",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    resolvedAt: null
  },
  {
    complaintId: "CMP-2026-002",
    citizenName: "Rahul Deshmukh",
    citizenPhone: "+91 98450 88721",
    citizenEmail: "rahul.d@yahoo.com",
    category: "Waterlogging",
    drainId: "DRAIN-001",
    location: "MG Road Metro Station Entry B",
    description: "Stormwater from road not draining into canal inlet. Commuters having to wade through 12cm of dirty rainwater.",
    photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    urgency: "medium",
    status: "In Review",
    assignedWorker: "Ramesh Kumar (WRK-101)",
    resolutionNotes: "",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    resolvedAt: null
  },
  {
    complaintId: "CMP-2026-003",
    citizenName: "Ananya Roy",
    citizenPhone: "+91 98450 55198",
    citizenEmail: "ananya.roy@outlook.com",
    category: "Broken Cover",
    drainId: "DRAIN-005",
    location: "Cantonment Railway Crossing Underpass",
    description: "Concrete grating over roadside culvert is cracked and collapsed. Trapping tree branches and plastic debris.",
    photoUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    urgency: "critical",
    status: "Pending",
    assignedWorker: "Unassigned",
    resolutionNotes: "",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    resolvedAt: null
  }
];

// In-Memory state initialization
let state = {
  drains: JSON.parse(JSON.stringify(defaultData.drains)),
  sensors: JSON.parse(JSON.stringify(defaultData.sensors)),
  workers: JSON.parse(JSON.stringify(defaultData.workers)),
  alerts: JSON.parse(JSON.stringify(defaultData.alerts)),
  roadFlooding: JSON.parse(JSON.stringify(defaultData.roadFlooding)),
  rainfall: JSON.parse(JSON.stringify(defaultData.rainfall)),
  sensorReadings: [],
  canals: JSON.parse(JSON.stringify(defaultData.canals)),
  complaints: JSON.parse(JSON.stringify(initialComplaints))
};

// Populate some initial sensor readings for graphs
(() => {
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const ts = new Date(now - i * 3600000).toISOString();
    state.drains.forEach((drain) => {
      state.sensorReadings.push({
        sensorId: `ESP32-${drain.drainId}`,
        drainId: drain.drainId,
        waterLevel: Math.max(10, Math.min(98, Math.round(drain.waterLevel + (Math.random() * 16 - 8)))),
        flowRate: Math.max(0.1, Number((drain.flowRate + (Math.random() * 4 - 2)).toFixed(1))),
        rainfall: Math.max(0, Math.round(state.rainfall.currentMm + (Math.random() * 10 - 5))),
        temperature: 27,
        timestamp: ts
      });
    });
  }
})();

// DRAIN OPERATIONS
const getDrains = async () => {
  if (!getIsUsingMock()) {
    try {
      const docs = await DrainModel.find().lean();
      if (docs.length > 0) return docs;
    } catch (e) {
      console.warn("Falling back to in-memory drains:", e.message);
    }
  }
  return state.drains;
};

const getDrainById = async (drainId) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await DrainModel.findOne({ drainId }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  return state.drains.find((d) => d.drainId === drainId || d._id === drainId);
};

const updateDrain = async (drainId, updates) => {
  updates.lastUpdated = new Date().toISOString();
  if (!getIsUsingMock()) {
    try {
      const doc = await DrainModel.findOneAndUpdate({ drainId }, updates, { new: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  const index = state.drains.findIndex((d) => d.drainId === drainId);
  if (index !== -1) {
    state.drains[index] = { ...state.drains[index], ...updates };
    return state.drains[index];
  }
  return null;
};

// SENSOR OPERATIONS
const getSensors = async () => {
  if (!getIsUsingMock()) {
    try {
      const docs = await SensorModel.find().lean();
      if (docs.length > 0) return docs;
    } catch (e) {}
  }
  return state.sensors;
};

const getSensorById = async (sensorId) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await SensorModel.findOne({ sensorId }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  return state.sensors.find((s) => s.sensorId === sensorId);
};

const updateSensor = async (sensorId, updates) => {
  updates.lastCommunication = new Date().toISOString();
  if (!getIsUsingMock()) {
    try {
      const doc = await SensorModel.findOneAndUpdate({ sensorId }, updates, { new: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  const index = state.sensors.findIndex((s) => s.sensorId === sensorId);
  if (index !== -1) {
    state.sensors[index] = { ...state.sensors[index], ...updates };
    return state.sensors[index];
  }
  return null;
};

// SENSOR READINGS OPERATIONS
const addSensorReading = async (reading) => {
  reading.timestamp = reading.timestamp || new Date().toISOString();
  if (!getIsUsingMock()) {
    try {
      await SensorReadingModel.create(reading);
    } catch (e) {}
  }
  state.sensorReadings.push(reading);
  if (state.sensorReadings.length > 2000) {
    state.sensorReadings.shift(); // Keep bounded
  }
  return reading;
};

const getSensorReadings = async (sensorId, limit = 50) => {
  if (!getIsUsingMock()) {
    try {
      const query = sensorId ? { sensorId } : {};
      const docs = await SensorReadingModel.find(query).sort({ timestamp: -1 }).limit(limit).lean();
      if (docs.length > 0) return docs.reverse();
    } catch (e) {}
  }
  let filtered = state.sensorReadings;
  if (sensorId) {
    filtered = filtered.filter((r) => r.sensorId === sensorId || r.drainId === sensorId);
  }
  return filtered.slice(-limit);
};

// ALERT OPERATIONS
const getAlerts = async () => {
  if (!getIsUsingMock()) {
    try {
      const docs = await AlertModel.find().sort({ createdAt: -1 }).lean();
      if (docs.length > 0) return docs;
    } catch (e) {}
  }
  return state.alerts;
};

const getAlertById = async (alertId) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await AlertModel.findOne({ alertId }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  return state.alerts.find((a) => a.alertId === alertId);
};

const addAlert = async (alert) => {
  if (!alert.alertId) {
    alert.alertId = `ALT-${new Date().getFullYear()}-${String(state.alerts.length + 1).padStart(3, "0")}`;
  }
  alert.createdAt = alert.createdAt || new Date().toISOString();
  alert.status = alert.status || "New";

  if (!getIsUsingMock()) {
    try {
      const doc = await AlertModel.create(alert);
      return doc.toObject();
    } catch (e) {}
  }
  state.alerts.unshift(alert);
  return alert;
};

const updateAlert = async (alertId, updates) => {
  if (updates.status === "Resolved" && !updates.resolvedAt) {
    updates.resolvedAt = new Date().toISOString();
  }
  if (!getIsUsingMock()) {
    try {
      const doc = await AlertModel.findOneAndUpdate({ alertId }, updates, { new: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  const index = state.alerts.findIndex((a) => a.alertId === alertId);
  if (index !== -1) {
    state.alerts[index] = { ...state.alerts[index], ...updates };
    return state.alerts[index];
  }
  return null;
};

// WORKER OPERATIONS
const getWorkers = async () => {
  if (!getIsUsingMock()) {
    try {
      const docs = await WorkerModel.find().lean();
      if (docs.length > 0) return docs;
    } catch (e) {}
  }
  return state.workers;
};

const getWorkerById = async (workerId) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await WorkerModel.findOne({ workerId }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  return state.workers.find((w) => w.workerId === workerId);
};

const updateWorker = async (workerId, updates) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await WorkerModel.findOneAndUpdate({ workerId }, updates, { new: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  const index = state.workers.findIndex((w) => w.workerId === workerId);
  if (index !== -1) {
    state.workers[index] = { ...state.workers[index], ...updates };
    return state.workers[index];
  }
  return null;
};

// RAINFALL OPERATIONS
const getRainfall = async () => {
  if (!getIsUsingMock()) {
    try {
      const doc = await RainfallModel.findOne().lean();
      if (doc) return doc;
    } catch (e) {}
  }
  return state.rainfall;
};

const updateRainfall = async (updates) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await RainfallModel.findOneAndUpdate({}, updates, { new: true, upsert: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  state.rainfall = { ...state.rainfall, ...updates };
  return state.rainfall;
};

// ROAD FLOODING OPERATIONS
const getRoadFlooding = async () => {
  if (!getIsUsingMock()) {
    try {
      const docs = await RoadFloodingModel.find().lean();
      if (docs.length > 0) return docs;
    } catch (e) {}
  }
  return state.roadFlooding;
};

const updateRoadFlooding = async (roadId, updates) => {
  updates.lastUpdated = new Date().toISOString();
  if (!getIsUsingMock()) {
    try {
      const doc = await RoadFloodingModel.findOneAndUpdate({ roadId }, updates, { new: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  const index = state.roadFlooding.findIndex((r) => r.roadId === roadId);
  if (index !== -1) {
    state.roadFlooding[index] = { ...state.roadFlooding[index], ...updates };
    return state.roadFlooding[index];
  }
  return null;
};

// COMPLAINTS OPERATIONS
const getComplaints = async (filter = {}) => {
  if (!getIsUsingMock()) {
    try {
      const docs = await ComplaintModel.find(filter).sort({ createdAt: -1 }).lean();
      if (docs.length > 0) return docs;
    } catch (e) {}
  }
  let list = state.complaints;
  if (filter.status) {
    list = list.filter((c) => c.status.toLowerCase() === filter.status.toLowerCase());
  }
  if (filter.assignedWorker) {
    list = list.filter((c) => c.assignedWorker.includes(filter.assignedWorker));
  }
  if (filter.citizenPhone) {
    list = list.filter((c) => c.citizenPhone === filter.citizenPhone);
  }
  return list;
};

const getComplaintById = async (complaintId) => {
  if (!getIsUsingMock()) {
    try {
      const doc = await ComplaintModel.findOne({ complaintId }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  return state.complaints.find((c) => c.complaintId === complaintId);
};

const addComplaint = async (complaint) => {
  if (!complaint.complaintId) {
    complaint.complaintId = `CMP-${new Date().getFullYear()}-${String(state.complaints.length + 1).padStart(3, "0")}`;
  }
  complaint.createdAt = complaint.createdAt || new Date().toISOString();
  complaint.status = complaint.status || "Pending";

  if (!getIsUsingMock()) {
    try {
      const doc = await ComplaintModel.create(complaint);
      return doc.toObject();
    } catch (e) {}
  }
  state.complaints.unshift(complaint);
  return complaint;
};

const updateComplaint = async (complaintId, updates) => {
  if (updates.status === "Resolved" && !updates.resolvedAt) {
    updates.resolvedAt = new Date().toISOString();
  }
  if (!getIsUsingMock()) {
    try {
      const doc = await ComplaintModel.findOneAndUpdate({ complaintId }, updates, { new: true }).lean();
      if (doc) return doc;
    } catch (e) {}
  }
  const index = state.complaints.findIndex((c) => c.complaintId === complaintId);
  if (index !== -1) {
    state.complaints[index] = { ...state.complaints[index], ...updates };
    return state.complaints[index];
  }
  return null;
};

// CANALS
const getCanals = () => state.canals;

// RESET ALL DEMO DATA
const resetToDefaultData = () => {
  state = {
    drains: JSON.parse(JSON.stringify(defaultData.drains)),
    sensors: JSON.parse(JSON.stringify(defaultData.sensors)),
    workers: JSON.parse(JSON.stringify(defaultData.workers)),
    alerts: JSON.parse(JSON.stringify(defaultData.alerts)),
    roadFlooding: JSON.parse(JSON.stringify(defaultData.roadFlooding)),
    rainfall: JSON.parse(JSON.stringify(defaultData.rainfall)),
    sensorReadings: [],
    canals: JSON.parse(JSON.stringify(defaultData.canals)),
    complaints: JSON.parse(JSON.stringify(initialComplaints))
  };
  return state;
};

module.exports = {
  getDrains,
  getDrainById,
  updateDrain,
  getSensors,
  getSensorById,
  updateSensor,
  addSensorReading,
  getSensorReadings,
  getAlerts,
  getAlertById,
  addAlert,
  updateAlert,
  getWorkers,
  getWorkerById,
  updateWorker,
  getRainfall,
  updateRainfall,
  getRoadFlooding,
  updateRoadFlooding,
  getCanals,
  getComplaints,
  getComplaintById,
  addComplaint,
  updateComplaint,
  resetToDefaultData
};

