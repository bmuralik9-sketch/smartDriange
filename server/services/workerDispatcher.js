const store = require("../models/store");

/**
 * Automatically dispatches an available municipal sanitation worker to an alert
 * @param {Object} alert
 * @param {Object} drain
 */
async function autoDispatchWorker(alert, drain) {
  const workers = await store.getWorkers();

  // Prefer an available worker in the same zone
  let targetWorker = workers.find(
    (w) => w.status === "available" && drain && drain.zone && w.area === drain.zone
  );

  // Otherwise, fallback to any available worker
  if (!targetWorker) {
    targetWorker = workers.find((w) => w.status === "available");
  }

  // If all workers are busy, fallback to worker with the least assigned alerts
  if (!targetWorker) {
    const activeWorkers = workers.filter((w) => w.status !== "offline");
    if (activeWorkers.length > 0) {
      targetWorker = activeWorkers.sort((a, b) => a.alertsAssigned - b.alertsAssigned)[0];
    }
  }

  if (targetWorker) {
    const workerLabel = `${targetWorker.name} (${targetWorker.workerId})`;
    
    // Update worker record
    await store.updateWorker(targetWorker.workerId, {
      status: "busy",
      currentTask: `Dispatched to ${alert.location} for ${alert.riskLevel} alert (${alert.alertId})`,
      alertsAssigned: (targetWorker.alertsAssigned || 0) + 1,
      lastActive: "Just now"
    });

    return workerLabel;
  }

  return "Unassigned - Escalated to Central Dispatch";
}

module.exports = {
  autoDispatchWorker
};
