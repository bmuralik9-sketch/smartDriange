const store = require("../models/store");

const getAnalyticsData = async (req, res) => {
  try {
    const { range = "7d" } = req.query;

    const [drains, sensors, alerts, workers, roads, rainfall] = await Promise.all([
      store.getDrains(),
      store.getSensors(),
      store.getAlerts(),
      store.getWorkers(),
      store.getRoadFlooding(),
      store.getRainfall()
    ]);

    // KPI Aggregations
    const totalDrains = drains.length;
    const blockedDrains = drains.filter((d) => d.status === "blocked").length;
    const warningDrains = drains.filter((d) => d.status === "warning" || d.status === "slow").length;
    const normalDrains = drains.filter((d) => d.status === "normal").length;

    const activeSensors = sensors.filter((s) => s.status !== "offline").length;
    const totalSensors = sensors.length;

    const criticalAlerts = alerts.filter(
      (a) => (a.riskLevel === "CRITICAL" || a.type === "CRITICAL") && a.status !== "Resolved"
    ).length;
    const totalActiveAlerts = alerts.filter((a) => a.status !== "Resolved").length;

    const waterloggingRoads = roads.filter(
      (r) => r.floodRisk === "CRITICAL" || r.floodRisk === "HIGH" || r.waterDepthCm > 10
    ).length;

    const activeWorkers = workers.filter((w) => w.status === "available" || w.status === "busy").length;
    const totalWorkers = workers.length;

    // Averages
    const avgWaterLevel = drains.length > 0
      ? Math.round(drains.reduce((acc, d) => acc + (d.waterLevel || 0), 0) / drains.length)
      : 0;

    const avgFlowRate = drains.length > 0
      ? Number((drains.reduce((acc, d) => acc + (d.flowRate || 0), 0) / drains.length).toFixed(1))
      : 0;

    // Blockage by Zone
    const zoneMap = {};
    drains.forEach((d) => {
      const z = d.zone || "Zone-1 Central";
      if (!zoneMap[z]) {
        zoneMap[z] = { zone: z, total: 0, blocked: 0, warning: 0, normal: 0 };
      }
      zoneMap[z].total++;
      if (d.status === "blocked") zoneMap[z].blocked++;
      else if (d.status === "slow" || d.status === "warning") zoneMap[z].warning++;
      else zoneMap[z].normal++;
    });
    const blockageByZone = Object.values(zoneMap);

    // Alerts Distribution
    const alertDistribution = [
      { name: "Critical", value: alerts.filter((a) => a.type === "CRITICAL").length, color: "#EF4444" },
      { name: "High Risk", value: alerts.filter((a) => a.type === "HIGH").length, color: "#F97316" },
      { name: "Warning", value: alerts.filter((a) => a.type === "WARNING").length, color: "#F59E0B" },
      { name: "Information", value: alerts.filter((a) => a.type === "INFORMATION").length, color: "#3B82F6" }
    ];

    // Response Times (in minutes) for resolved alerts
    const responseTimes = [
      { day: "Mon", avgResponseMins: 22, targetMins: 30 },
      { day: "Tue", avgResponseMins: 18, targetMins: 30 },
      { day: "Wed", avgResponseMins: 25, targetMins: 30 },
      { day: "Thu", avgResponseMins: 15, targetMins: 30 },
      { day: "Fri", avgResponseMins: 32, targetMins: 30 },
      { day: "Sat", avgResponseMins: 28, targetMins: 30 },
      { day: "Sun", avgResponseMins: 19, targetMins: 30 }
    ];

    // Sensor Fleet Health
    const uptimePercent = totalSensors > 0 ? Number(((activeSensors / totalSensors) * 100).toFixed(1)) : 100;

    // Time-series trend mock for selected range
    const trendData = [
      { time: "00:00", waterLevelAvg: 38, flowRateAvg: 22.4, rainfall: 4 },
      { time: "04:00", waterLevelAvg: 44, flowRateAvg: 19.8, rainfall: 8 },
      { time: "08:00", waterLevelAvg: 58, flowRateAvg: 16.2, rainfall: 18 },
      { time: "12:00", waterLevelAvg: 72, flowRateAvg: 12.0, rainfall: 35 },
      { time: "16:00", waterLevelAvg: 81, flowRateAvg: 8.5, rainfall: 48 },
      { time: "20:00", waterLevelAvg: 68, flowRateAvg: 14.1, rainfall: 38 },
      { time: "Now", waterLevelAvg: avgWaterLevel, flowRateAvg: avgFlowRate, rainfall: rainfall.currentMm }
    ];

    res.json({
      success: true,
      range,
      kpis: {
        totalDrains,
        activeSensors: `${activeSensors} / ${totalSensors}`,
        activeSensorsCount: activeSensors,
        totalSensorsCount: totalSensors,
        blockedDrains,
        warningDrains,
        normalDrains,
        criticalAlerts,
        totalActiveAlerts,
        waterloggingRoads,
        activeWorkers: `${activeWorkers} / ${totalWorkers}`,
        activeWorkersCount: activeWorkers,
        totalWorkersCount: totalWorkers,
        avgWaterLevel,
        avgFlowRate,
        uptimePercent
      },
      blockageByZone,
      alertDistribution,
      responseTimes,
      trendData,
      rainfall
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalyticsData
};
