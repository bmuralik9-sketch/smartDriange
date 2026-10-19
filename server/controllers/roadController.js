const store = require("../models/store");
const { emitEvent } = require("../socket");

const getRoadFlooding = async (req, res) => {
  try {
    const roads = await store.getRoadFlooding();
    res.json({ success: true, count: roads.length, data: roads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRoad = async (req, res) => {
  try {
    const updated = await store.updateRoadFlooding(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Road not found" });
    }
    emitEvent("road_update", updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRoadFlooding,
  updateRoad
};
