const store = require("../models/store");
const { emitEvent } = require("../socket");

const getRainfallData = async (req, res) => {
  try {
    const rainfall = await store.getRainfall();
    res.json({ success: true, data: rainfall });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRainfallData = async (req, res) => {
  try {
    const current = await store.getRainfall();
    const payload = req.body;

    let timeframe = payload.timeframe || current.timeframe || "1h";
    let targetMm;
    if (payload.currentMm !== undefined) {
      targetMm = Number(payload.currentMm);
    } else if (timeframe === "0-10m" || timeframe === "10m") {
      targetMm = current.currentMm > 10 ? 5.8 : current.currentMm;
    } else {
      targetMm = current.currentMm;
    }

    // Recalculate category
    let intensity = "Moderate Rain";
    let intensityCategory = "moderate";
    if (targetMm === 0) {
      intensity = "No Rain";
      intensityCategory = "none";
    } else if (targetMm <= 10) {
      intensity = "Light Rain";
      intensityCategory = "light";
    } else if (targetMm <= 30) {
      intensity = "Moderate Rain";
      intensityCategory = "moderate";
    } else if (targetMm <= 60) {
      intensity = "Heavy Rain";
      intensityCategory = "heavy";
    } else {
      intensity = "Extreme Storm";
      intensityCategory = "extreme";
    }

    // Generate dynamic history matching selected timeframe & intensity
    let history = [];
    if (timeframe === "0-10m" || timeframe === "10m") {
      history = [
        { time: "0m", mm: Number((targetMm * 0.7).toFixed(1)), intensity },
        { time: "2m", mm: Number((targetMm * 0.85).toFixed(1)), intensity },
        { time: "4m", mm: Number((targetMm * 0.95).toFixed(1)), intensity },
        { time: "6m", mm: Number(targetMm.toFixed(1)), intensity },
        { time: "8m", mm: Number((targetMm * 0.9).toFixed(1)), intensity },
        { time: "10m", mm: Number((targetMm * 0.8).toFixed(1)), intensity }
      ];
    } else if (timeframe === "1h") {
      history = [
        { time: "0 min", mm: Number((targetMm * 0.6).toFixed(1)), intensity },
        { time: "15 min", mm: Number((targetMm * 0.8).toFixed(1)), intensity },
        { time: "30 min", mm: Number((targetMm * 1.05).toFixed(1)), intensity },
        { time: "45 min", mm: Number(targetMm.toFixed(1)), intensity },
        { time: "60 min", mm: Number((targetMm * 0.9).toFixed(1)), intensity }
      ];
    } else if (timeframe === "6h") {
      history = [
        { time: "1h ago", mm: Number((targetMm * 0.4).toFixed(1)), intensity },
        { time: "2h ago", mm: Number((targetMm * 0.7).toFixed(1)), intensity },
        { time: "3h ago", mm: Number((targetMm * 1.1).toFixed(1)), intensity },
        { time: "4h ago", mm: Number((targetMm * 0.9).toFixed(1)), intensity },
        { time: "5h ago", mm: Number((targetMm * 0.8).toFixed(1)), intensity },
        { time: "Current", mm: Number(targetMm.toFixed(1)), intensity }
      ];
    } else {
      // 24h
      history = [
        { time: "00:00", mm: Number((targetMm * 0.1).toFixed(1)), intensity: "Light" },
        { time: "04:00", mm: Number((targetMm * 0.2).toFixed(1)), intensity: "Light" },
        { time: "08:00", mm: Number((targetMm * 0.5).toFixed(1)), intensity: "Moderate" },
        { time: "12:00", mm: Number((targetMm * 0.9).toFixed(1)), intensity },
        { time: "16:00", mm: Number((targetMm * 1.1).toFixed(1)), intensity },
        { time: "20:00", mm: Number((targetMm * 0.85).toFixed(1)), intensity },
        { time: "Now", mm: Number(targetMm.toFixed(1)), intensity }
      ];
    }

    const updated = await store.updateRainfall({
      currentMm: targetMm,
      intensity,
      intensityCategory,
      last1HourMm: Number((targetMm * 0.8).toFixed(1)),
      last6HoursMm: Number((targetMm * 2.1).toFixed(1)),
      last24HoursMm: Number((targetMm * 3.4).toFixed(1)),
      timeframe,
      history,
      stations: [
        { name: "Central Weather Station", mm: Number((targetMm * 1.02).toFixed(1)), status: "Active" },
        { name: "Airport AWS Radar", mm: Number((targetMm * 0.95).toFixed(1)), status: "Active" },
        { name: "Tech Corridor AWS", mm: Number((targetMm * 1.08).toFixed(1)), status: "Active" },
        { name: "Industrial North Station", mm: Number((targetMm * 0.88).toFixed(1)), status: "Active" },
        { name: "South Valley Weather Post", mm: Number((targetMm * 0.92).toFixed(1)), status: "Active" }
      ]
    });

    emitEvent("rainfall_update", updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRainfallData,
  updateRainfallData
};
