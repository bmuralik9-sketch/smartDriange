const store = require("../models/store");
const { evaluateDrainRisk } = require("../services/detectionEngine");
const { autoDispatchWorker } = require("../services/workerDispatcher");
const { emitEvent } = require("../socket");

const getAllSensors = async (req, res) => {
  try {
    const sensors = await store.getSensors();
    res.json({ success: true, count: sensors.length, data: sensors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSensorById = async (req, res) => {
  try {
    const sensor = await store.getSensorById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ success: false, message: "Sensor not found" });
    }
    const readings = await store.getSensorReadings(sensor.sensorId, 30);
    res.json({ success: true, data: { ...sensor, readings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSensorReadings = async (req, res) => {
  try {
    const { sensorId, limit } = req.query;
    const readings = await store.getSensorReadings(sensorId, limit ? parseInt(limit) : 50);
    res.json({ success: true, count: readings.length, data: readings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Primary ESP32 Telemetry Ingestion Endpoint
 * POST /api/sensors/data
 */
const receiveSensorData = async (req, res) => {
  try {
    const { sensorId, drainId, waterLevel, flowRate, rainfall, temperature, battery, signalStrength } = req.body;

    if (!sensorId) {
      return res.status(400).json({ success: false, message: "Missing required field: sensorId" });
    }

    const targetDrainId = drainId || (sensorId.replace("ESP32-", ""));
    const drain = await store.getDrainById(targetDrainId);

    // 1. Evaluate Rule-based Blockage & Smart Risk
    const evaluation = evaluateDrainRisk({
      waterLevel: Number(waterLevel),
      flowRate: Number(flowRate),
      rainfall: Number(rainfall || 20),
      drain
    });

    // 2. Record historical reading
    const reading = await store.addSensorReading({
      sensorId,
      drainId: targetDrainId,
      waterLevel: Number(waterLevel),
      flowRate: Number(flowRate),
      rainfall: Number(rainfall || 20),
      temperature: Number(temperature || 27),
      timestamp: new Date().toISOString()
    });

    // 3. Update Sensor State
    const updatedSensor = await store.updateSensor(sensorId, {
      waterLevel: Number(waterLevel),
      flowRate: Number(flowRate),
      rainfall: Number(rainfall || 20),
      temperature: Number(temperature || 27),
      battery: battery !== undefined ? Number(battery) : undefined,
      signalStrength: signalStrength !== undefined ? Number(signalStrength) : undefined,
      status: evaluation.status === "blocked" ? "critical" : evaluation.status === "slow" ? "warning" : "online",
      lastCommunication: new Date().toISOString()
    });

    // 4. Update Drain State
    let assignedWorkerName = drain ? drain.assignedWorker : "None";
    let alertCreated = null;

    if (evaluation.alertNeeded) {
      // Check if active alert already exists recently for this drain to avoid duplicate spam
      const alerts = await store.getAlerts();
      const existingAlert = alerts.find(
        (a) => a.drainId === targetDrainId && a.status !== "Resolved"
      );

      if (!existingAlert) {
        const newAlert = {
          alertId: `ALT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          drainId: targetDrainId,
          sensorId,
          type: evaluation.alertSeverity,
          message: evaluation.alertMessage,
          location: drain ? drain.location : `Drain Location (${targetDrainId})`,
          riskLevel: evaluation.alertSeverity,
          waterLevel: Number(waterLevel),
          flowRate: Number(flowRate),
          status: "New",
          assignedWorker: "Pending Dispatch",
          createdAt: new Date().toISOString()
        };

        // Auto-assign worker if critical/high
        if (evaluation.alertSeverity === "CRITICAL" || evaluation.alertSeverity === "HIGH") {
          assignedWorkerName = await autoDispatchWorker(newAlert, drain);
          newAlert.assignedWorker = assignedWorkerName;
          newAlert.status = "Assigned";
        }

        alertCreated = await store.addAlert(newAlert);
        emitEvent("alert_new", alertCreated);
      }
    }

    const updatedDrain = await store.updateDrain(targetDrainId, {
      waterLevel: Number(waterLevel),
      flowRate: Number(flowRate),
      status: evaluation.status,
      riskLevel: evaluation.riskLevel,
      assignedWorker: assignedWorkerName,
      lastUpdated: new Date().toISOString()
    });

    // 5. Broadcast Socket.IO Events
    if (updatedSensor) emitEvent("sensor_update", updatedSensor);
    if (updatedDrain) emitEvent("drain_update", updatedDrain);
    emitEvent("reading_new", reading);

    res.status(200).json({
      success: true,
      message: "ESP32 sensor telemetry processed successfully",
      evaluation: {
        isBlockageDetected: evaluation.isBlockageDetected,
        status: evaluation.status,
        riskLevel: evaluation.riskLevel,
        aiRiskScore: evaluation.aiRiskScore,
        smartRiskCategory: evaluation.smartRiskCategory
      },
      alertCreated: alertCreated ? alertCreated.alertId : null,
      assignedWorker: assignedWorkerName
    });
  } catch (error) {
    console.error("Error processing sensor data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSensors,
  getSensorById,
  getSensorReadings,
  receiveSensorData
};
