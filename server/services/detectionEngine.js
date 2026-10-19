// Detection Engine: Blockage Identification & AI Risk Scoring System

/**
 * Calculates rule-based blockage and AI risk score (0-100)
 * @param {Object} params - { waterLevel, flowRate, rainfall, drainId, sensorId }
 */
function evaluateDrainRisk({ waterLevel, flowRate, rainfall = 20, drain = null }) {
  const wl = Number(waterLevel) || 0;
  const fr = Number(flowRate) || 0;
  const rf = Number(rainfall) || 0;

  // Expected baseline flow for normal operation
  const baselineFlow = 25.0; // L/min

  // 1. RULE-BASED BLOCKAGE IDENTIFICATION
  let isBlockageDetected = false;
  let status = "normal";
  let riskLevel = "low";
  let alertNeeded = false;
  let alertSeverity = "INFORMATION";
  let alertMessage = "";

  if (wl >= 90 && fr <= 1.5) {
    // Critical Blockage Rule
    isBlockageDetected = true;
    status = "blocked";
    riskLevel = "critical";
    alertNeeded = true;
    alertSeverity = "CRITICAL";
    alertMessage = `🚨 CRITICAL BLOCKAGE DETECTED! Water level at ${wl}% while flow is nearly stopped (${fr} L/min). Immediate desiltation required.`;
  } else if (wl >= 75 && fr < 5.0) {
    // Possible Blockage Rule
    isBlockageDetected = true;
    status = "blocked";
    riskLevel = "high";
    alertNeeded = true;
    alertSeverity = "HIGH";
    alertMessage = `⚠️ Possible drain blockage detected. Water level high (${wl}%) with severely restricted flow (${fr} L/min).`;
  } else if (wl >= 65 || fr < 8.0) {
    isBlockageDetected = false;
    status = "slow";
    riskLevel = "medium";
    if (wl >= 70) {
      alertNeeded = true;
      alertSeverity = "WARNING";
      alertMessage = `Water level elevated to ${wl}%. Flow rate has slowed to ${fr} L/min.`;
    }
  } else if (fr < 3.0 && wl < 50) {
    status = "stopped";
    riskLevel = "low";
  } else {
    status = "normal";
    riskLevel = "low";
  }

  // 2. AI / SMART PREDICTION RISK SCORING (0 to 100)
  // Transparent multi-factor algorithm designed for future ML model drop-in
  // Factor 1: Water Level (0 - 45 points)
  const wlScore = Math.min(45, (wl / 100) * 45);

  // Factor 2: Flow Restriction (0 - 30 points)
  const flowDeficit = Math.max(0, baselineFlow - fr);
  const flowScore = Math.min(30, (flowDeficit / baselineFlow) * 30);

  // Factor 3: Rainfall Escalation (0 - 15 points)
  const rainScore = Math.min(15, (rf / 60) * 15);

  // Factor 4: Conduit Vulnerability Factor (0 - 10 points)
  const vulnerabilityScore = (drain && (drain.status === "blocked" || drain.zone?.includes("Industrial"))) ? 8 : 4;

  const totalScore = Math.round(Math.min(100, wlScore + flowScore + rainScore + vulnerabilityScore));

  let smartRiskCategory = "LOW RISK";
  if (totalScore >= 80) smartRiskCategory = "CRITICAL RISK";
  else if (totalScore >= 60) smartRiskCategory = "HIGH RISK";
  else if (totalScore >= 35) smartRiskCategory = "MEDIUM RISK";

  return {
    isBlockageDetected,
    status,
    riskLevel,
    alertNeeded,
    alertSeverity,
    alertMessage,
    aiRiskScore: totalScore,
    smartRiskCategory,
    breakdown: {
      waterLevelContribution: Number(wlScore.toFixed(1)),
      flowDeficitContribution: Number(flowScore.toFixed(1)),
      rainfallContribution: Number(rainScore.toFixed(1)),
      vulnerabilityContribution: vulnerabilityScore
    }
  };
}

module.exports = {
  evaluateDrainRisk
};
