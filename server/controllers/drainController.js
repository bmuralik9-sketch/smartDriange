const store = require("../models/store");
const { emitEvent } = require("../socket");

const getAllDrains = async (req, res) => {
  try {
    const { status, riskLevel, zone } = req.query;
    let drains = await store.getDrains();

    if (status) {
      drains = drains.filter((d) => d.status.toLowerCase() === status.toLowerCase());
    }
    if (riskLevel) {
      drains = drains.filter((d) => d.riskLevel.toLowerCase() === riskLevel.toLowerCase());
    }
    if (zone) {
      drains = drains.filter((d) => d.zone.toLowerCase().includes(zone.toLowerCase()));
    }

    res.json({ success: true, count: drains.length, data: drains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDrainById = async (req, res) => {
  try {
    const drain = await store.getDrainById(req.params.id);
    if (!drain) {
      return res.status(404).json({ success: false, message: "Drain not found" });
    }
    const readings = await store.getSensorReadings(drain.drainId, 30);
    res.json({ success: true, data: { ...drain, readings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDrain = async (req, res) => {
  try {
    const updated = await store.updateDrain(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Drain not found" });
    }
    emitEvent("drain_update", updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCanals = async (req, res) => {
  try {
    const canals = store.getCanals();
    res.json({ success: true, data: canals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDrains,
  getDrainById,
  updateDrain,
  getCanals
};
