const express = require("express");
const router = express.Router();
const {
  getAllSensors,
  getSensorById,
  getSensorReadings,
  receiveSensorData
} = require("../controllers/sensorController");

router.get("/readings", getSensorReadings);
router.post("/data", receiveSensorData);
router.get("/", getAllSensors);
router.get("/:id", getSensorById);

module.exports = router;
