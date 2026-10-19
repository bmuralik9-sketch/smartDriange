const store = require("../models/store");
const { emitEvent } = require("../socket");

const getAllAlerts = async (req, res) => {
  try {
    const { status, type, riskLevel } = req.query;
    let alerts = await store.getAlerts();

    if (status) {
      alerts = alerts.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }
    if (type) {
      alerts = alerts.filter((a) => a.type.toLowerCase() === type.toLowerCase());
    }
    if (riskLevel) {
      alerts = alerts.filter((a) => a.riskLevel.toLowerCase() === riskLevel.toLowerCase());
    }

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAlertById = async (req, res) => {
  try {
    const alert = await store.getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAlert = async (req, res) => {
  try {
    const newAlert = await store.addAlert(req.body);
    emitEvent("alert_new", newAlert);
    res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAlert = async (req, res) => {
  try {
    const { status, assignedWorker } = req.body;
    const updates = { ...req.body };

    if (status === "Resolved") {
      updates.resolvedAt = new Date().toISOString();
    }

    const updated = await store.updateAlert(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    // If worker was assigned or changed, update the drain record too
    if (assignedWorker && updated.drainId) {
      await store.updateDrain(updated.drainId, { assignedWorker });
    }

    // If resolved, check if drain can be returned to normal or warning
    if (status === "Resolved" && updated.drainId) {
      const drain = await store.getDrainById(updated.drainId);
      if (drain && (drain.status === "blocked" || drain.status === "slow")) {
        await store.updateDrain(updated.drainId, {
          status: "normal",
          riskLevel: "low",
          waterLevel: Math.max(25, (drain.waterLevel || 50) - 40),
          flowRate: 22.0
        });
      }
    }

    emitEvent("alert_update", updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert
};
