const express = require("express");
const router = express.Router();
const {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert
} = require("../controllers/alertController");

router.get("/", getAllAlerts);
router.get("/:id", getAlertById);
router.post("/", createAlert);
router.put("/:id", updateAlert);

module.exports = router;
