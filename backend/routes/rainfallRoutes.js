const express = require("express");
const router = express.Router();
const {
  getRainfallData,
  updateRainfallData
} = require("../controllers/rainfallController");

router.get("/", getRainfallData);
router.put("/", updateRainfallData);

module.exports = router;
