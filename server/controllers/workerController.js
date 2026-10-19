const store = require("../models/store");
const { emitEvent } = require("../socket");

const getAllWorkers = async (req, res) => {
  try {
    const { status, area } = req.query;
    let workers = await store.getWorkers();

    if (status) {
      workers = workers.filter((w) => w.status.toLowerCase() === status.toLowerCase());
    }
    if (area) {
      workers = workers.filter((w) => w.area.toLowerCase().includes(area.toLowerCase()));
    }

    res.json({ success: true, count: workers.length, data: workers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const worker = await store.getWorkerById(req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.json({ success: true, data: worker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateWorker = async (req, res) => {
  try {
    const updated = await store.updateWorker(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    emitEvent("worker_update", updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllWorkers,
  getWorkerById,
  updateWorker
};
