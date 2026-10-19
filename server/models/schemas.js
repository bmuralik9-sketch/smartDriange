const mongoose = require("mongoose");

const DrainSchema = new mongoose.Schema({
  drainId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  waterLevel: { type: Number, default: 0 },
  flowRate: { type: Number, default: 0 },
  status: { type: String, enum: ["normal", "slow", "stopped", "blocked", "warning"], default: "normal" },
  riskLevel: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
  assignedWorker: { type: String, default: "None" },
  lastUpdated: { type: Date, default: Date.now },
  capacity: { type: Number, default: 5000 },
  widthMeters: { type: Number, default: 2.5 },
  depthMeters: { type: Number, default: 3.0 },
  zone: { type: String, default: "Zone-1 Central" }
});

const SensorSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, unique: true },
  drainId: { type: String, required: true },
  type: { type: String, default: "Ultrasonic Level Sensor" },
  status: { type: String, enum: ["online", "offline", "warning", "critical"], default: "online" },
  waterLevel: { type: Number, default: 0 },
  flowRate: { type: Number, default: 0 },
  rainfall: { type: Number, default: 0 },
  temperature: { type: Number, default: 27 },
  battery: { type: Number, default: 95 },
  signalStrength: { type: Number, default: -65 },
  firmwareVersion: { type: String, default: "v2.4.1-esp32" },
  lastCommunication: { type: Date, default: Date.now }
});

const SensorReadingSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  drainId: { type: String },
  waterLevel: { type: Number, required: true },
  flowRate: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  temperature: { type: Number, default: 27 },
  timestamp: { type: Date, default: Date.now }
});

const AlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  drainId: { type: String, required: true },
  sensorId: { type: String, required: true },
  type: { type: String, enum: ["CRITICAL", "HIGH", "WARNING", "INFORMATION"], default: "WARNING" },
  message: { type: String, required: true },
  riskLevel: { type: String, default: "WARNING" },
  waterLevel: { type: Number },
  flowRate: { type: Number },
  status: { type: String, enum: ["New", "Acknowledged", "Assigned", "In Progress", "Resolved"], default: "New" },
  assignedWorker: { type: String, default: "Unassigned" },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

const WorkerSchema = new mongoose.Schema({
  workerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  area: { type: String, required: true },
  status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
  currentTask: { type: String, default: "Standby" },
  alertsAssigned: { type: Number, default: 0 },
  lastActive: { type: String, default: "Just now" },
  badgeNumber: { type: String }
});

const RainfallSchema = new mongoose.Schema({
  currentMm: { type: Number, default: 0 },
  intensity: { type: String, default: "No Rain" },
  intensityCategory: { type: String, default: "none" },
  last1HourMm: { type: Number, default: 0 },
  last6HoursMm: { type: Number, default: 0 },
  last24HoursMm: { type: Number, default: 0 },
  forecast: { type: String },
  history: [{ time: String, mm: Number, intensity: String }],
  stations: [{ name: String, mm: Number, status: String }]
});

const RoadFloodingSchema = new mongoose.Schema({
  roadId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  waterDepthCm: { type: Number, default: 0 },
  trafficCondition: { type: String, enum: ["Normal", "Slow", "Jammed", "Closed"], default: "Normal" },
  rainfallIntensity: { type: String },
  drainCondition: { type: String },
  floodRisk: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "LOW" },
  status: { type: String },
  coordinates: { type: [[Number]], default: [] },
  lastUpdated: { type: Date, default: Date.now }
});

const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  citizenName: { type: String, required: true },
  citizenPhone: { type: String, default: "" },
  citizenEmail: { type: String, default: "" },
  category: { type: String, default: "Drain Blockage" },
  drainId: { type: String, default: "DRAIN-001" },
  location: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: { type: String, default: "" },
  urgency: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  status: { type: String, enum: ["Pending", "In Review", "Worker Dispatched", "Resolved"], default: "Pending" },
  assignedWorker: { type: String, default: "Unassigned" },
  resolutionNotes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

// Create Mongoose models
const DrainModel = mongoose.models.Drain || mongoose.model("Drain", DrainSchema);
const SensorModel = mongoose.models.Sensor || mongoose.model("Sensor", SensorSchema);
const SensorReadingModel = mongoose.models.SensorReading || mongoose.model("SensorReading", SensorReadingSchema);
const AlertModel = mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
const WorkerModel = mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);
const RainfallModel = mongoose.models.Rainfall || mongoose.model("Rainfall", RainfallSchema);
const RoadFloodingModel = mongoose.models.RoadFlooding || mongoose.model("RoadFlooding", RoadFloodingSchema);
const ComplaintModel = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);

module.exports = {
  DrainModel,
  SensorModel,
  SensorReadingModel,
  AlertModel,
  WorkerModel,
  RainfallModel,
  RoadFloodingModel,
  ComplaintModel
};

