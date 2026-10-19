const express = require("express");
const router = express.Router();
const {
  triggerSimulation,
  resetSimulation,
  getPredictions
} = require("../controllers/simulationController");

router.post("/trigger", triggerSimulation);
router.post("/reset", resetSimulation);
router.get("/predict", getPredictions);

module.exports = router;
