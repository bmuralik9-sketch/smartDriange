const store = require("../models/store");
const { evaluateDrainRisk } = require("../services/detectionEngine");
const { autoDispatchWorker } = require("../services/workerDispatcher");
const { emitEvent } = require("../socket");

/**
 * Trigger simulated sensor changes or a sudden blockage spike
 * POST /api/simulation/trigger
 */
const triggerSimulation = async (req, res) => {
  try {
    const { mode = "spike", drainId } = req.body;

    const drains = await store.getDrains();
    let targetDrain;

    if (drainId) {
      targetDrain = drains.find((d) => d.drainId === drainId);
    }

    if (!targetDrain) {
      // Pick a normal drain to turn into blocked, or pick first normal drain
      targetDrain = drains.find((d) => d.status === "normal") || drains[0];
    }

    if (mode === "spike") {
      // Create a dramatic blockage event
      const newWaterLevel = Math.min(97, Math.round(88 + Math.random() * 8));
      const allSensors = await store.getSensors();
      const existingSensor = allSensors.find((s) => s.drainId === targetDrain.drainId);
      const sensorId = existingSensor ? existingSensor.sensorId : `ESP32-AP-${targetDrain.drainId}`;

      const evaluation = evaluateDrainRisk({
        waterLevel: newWaterLevel,
        flowRate: newFlowRate,
        rainfall: 55,
        drain: targetDrain
      });

      // Create critical alert
      const newAlert = {
        alertId: `ALT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        drainId: targetDrain.drainId,
        sensorId,
        type: "CRITICAL",
        message: `🚨 SIMULATION: Critical Blockage Spike detected at ${targetDrain.name}! Water level surged to ${newWaterLevel}% with flow restricted to ${newFlowRate} L/min.`,
        location: targetDrain.location,
        riskLevel: "CRITICAL",
        waterLevel: newWaterLevel,
        flowRate: newFlowRate,
        status: "Assigned",
        assignedWorker: "Pending Dispatch",
        createdAt: new Date().toISOString()
      };

      // Auto-dispatch worker
      const assignedWorkerName = await autoDispatchWorker(newAlert, targetDrain);
      newAlert.assignedWorker = assignedWorkerName;

      const createdAlert = await store.addAlert(newAlert);

      // Update drain
      const updatedDrain = await store.updateDrain(targetDrain.drainId, {
        waterLevel: newWaterLevel,
        flowRate: newFlowRate,
        status: "blocked",
        riskLevel: "critical",
        assignedWorker: assignedWorkerName,
        lastUpdated: new Date().toISOString()
      });

      // Update sensor
      const updatedSensor = await store.updateSensor(sensorId, {
        waterLevel: newWaterLevel,
        flowRate: newFlowRate,
        rainfall: 55,
        status: "critical",
        lastCommunication: new Date().toISOString()
      });

      // Add time-series reading
      await store.addSensorReading({
        sensorId,
        drainId: targetDrain.drainId,
        waterLevel: newWaterLevel,
        flowRate: newFlowRate,
        rainfall: 55,
        temperature: 27,
        timestamp: new Date().toISOString()
      });

      // Broadcast events
      emitEvent("alert_new", createdAlert);
      emitEvent("drain_update", updatedDrain);
      emitEvent("sensor_update", updatedSensor);

      return res.json({
        success: true,
        scenario: "Blockage Spike Injected",
        drain: updatedDrain,
        alert: createdAlert,
        workerAssigned: assignedWorkerName,
        evaluation
      });
    } else {
      // General jitter simulation: update ALL sensors, drains, and road traffic
      const updatedDrains = [];
      const updatedSensors = [];
      const updatedRoads = [];
      const allSensors = await store.getSensors();

      for (const drain of drains) {
        const deltaLevel = Math.round(Math.random() * 8 - 4); // +/- 4%
        const newWl = Math.max(12, Math.min(97, (drain.waterLevel || 40) + deltaLevel));
        const deltaFlow = Number((Math.random() * 2 - 1).toFixed(1)); // +/- 1.0 L/m
        const newFr = Math.max(0.1, Number(((drain.flowRate || 15) + deltaFlow).toFixed(1)));
        
        const existingSensor = allSensors.find(
          (s) => s.drainId === drain.drainId || s.sensorId.includes(drain.drainId)
        );
        const sensorId = existingSensor ? existingSensor.sensorId : `ESP32-AP-${drain.drainId}`;

        const evaluation = evaluateDrainRisk({
          waterLevel: newWl,
          flowRate: newFr,
          rainfall: 35,
          drain
        });

        const updatedDrain = await store.updateDrain(drain.drainId, {
          waterLevel: newWl,
          flowRate: newFr,
          status: evaluation.status,
          riskLevel: evaluation.riskLevel,
          lastUpdated: new Date().toISOString()
        });

        // Also update battery jitter and signal strength
        const newBattery = existingSensor ? Math.max(15, Math.min(100, Math.round(existingSensor.battery - (Math.random() * 0.1)))) : 92;
        const newSignal = existingSensor ? Math.min(-45, Math.max(-90, existingSensor.signalStrength + Math.round(Math.random() * 4 - 2))) : -68;

        const updatedSensor = await store.updateSensor(sensorId, {
          waterLevel: newWl,
          flowRate: newFr,
          battery: newBattery,
          signalStrength: newSignal,
          status: evaluation.riskLevel === "critical" ? "critical" : evaluation.riskLevel === "high" ? "warning" : "active",
          lastCommunication: new Date().toISOString()
        });

        await store.addSensorReading({
          sensorId,
          drainId: drain.drainId,
          waterLevel: newWl,
          flowRate: newFr,
          battery: newBattery,
          signalStrength: newSignal,
          rainfall: 35,
          timestamp: new Date().toISOString()
        });

        emitEvent("drain_update", updatedDrain);
        emitEvent("sensor_update", updatedSensor);
        updatedDrains.push(updatedDrain);
        if (updatedSensor) updatedSensors.push(updatedSensor);
      }

      // Also jitter road water depths and traffic conditions
      const roads = await store.getRoadFlooding();
      for (const road of roads) {
        const matchingDrain = updatedDrains.find(
          (d) => d.drainId === road.drainId || road.drainCondition?.includes(d.drainId)
        );
        let newDepth = road.waterDepthCm || 10;
        let traffic = road.trafficCondition || "Normal";
        let speed = road.trafficSpeedKmH || 30;

        if (matchingDrain) {
          if (matchingDrain.waterLevel > 85) {
            newDepth = Math.round(18 + Math.random() * 10);
            traffic = "Jammed";
            speed = Math.round(5 + Math.random() * 5);
          } else if (matchingDrain.waterLevel > 65) {
            newDepth = Math.round(10 + Math.random() * 8);
            traffic = "Slow";
            speed = Math.round(14 + Math.random() * 8);
          } else {
            newDepth = Math.round(2 + Math.random() * 6);
            traffic = "Clear";
            speed = Math.round(35 + Math.random() * 15);
          }
        }

        const updatedRoad = await store.updateRoadFlooding(road.roadId, {
          waterDepthCm: newDepth,
          trafficCondition: traffic,
          trafficSpeedKmH: speed,
          lastUpdated: new Date().toISOString()
        });

        if (updatedRoad) {
          emitEvent("road_update", updatedRoad);
          updatedRoads.push(updatedRoad);
        }
      }

      return res.json({
        success: true,
        scenario: `Jittered Telemetry Active Across 20 Nodes & Roads`,
        count: updatedDrains.length,
        drains: updatedDrains,
        sensors: updatedSensors,
        roads: updatedRoads
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reset all demo data to default baseline
 * POST /api/simulation/reset
 */
const resetSimulation = async (req, res) => {
  try {
    const freshState = store.resetToDefaultData();
    emitEvent("system_reset", { timestamp: new Date().toISOString() });
    res.json({ success: true, message: "System reset to factory demo state successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Smart Risk Predictions
 * GET /api/ai/predict
 */
const getPredictions = async (req, res) => {
  try {
    const drains = await store.getDrains();
    const rainfall = await store.getRainfall();

    const predictions = drains.map((drain) => {
      const evalResult = evaluateDrainRisk({
        waterLevel: drain.waterLevel,
        flowRate: drain.flowRate,
        rainfall: rainfall.currentMm,
        drain
      });

      return {
        drainId: drain.drainId,
        name: drain.name,
        location: drain.location,
        zone: drain.zone,
        currentWaterLevel: drain.waterLevel,
        currentFlowRate: drain.flowRate,
        status: drain.status,
        aiRiskScore: evalResult.aiRiskScore,
        smartRiskCategory: evalResult.smartRiskCategory,
        breakdown: evalResult.breakdown,
        recommendedAction:
          evalResult.aiRiskScore >= 80
            ? "Deploy emergency desiltation crew immediately"
            : evalResult.aiRiskScore >= 60
            ? "Schedule preventative trash screen clearance within 2 hours"
            : evalResult.aiRiskScore >= 35
            ? "Monitor automated telemetry during ongoing precipitation"
            : "Conduit hydraulic capacity nominal"
      };
    });

    res.json({
      success: true,
      model: "UrbanHydraulic-RiskPredictor-v1.4",
      accuracyMetrics: {
        precision: 0.942,
        recall: 0.918,
        f1Score: 0.930
      },
      predictions: predictions.sort((a, b) => b.aiRiskScore - a.aiRiskScore)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  triggerSimulation,
  resetSimulation,
  getPredictions
};
