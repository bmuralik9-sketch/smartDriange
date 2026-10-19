const express = require("express");
const router = express.Router();
const {
  getAllDrains,
  getDrainById,
  updateDrain,
  getCanals
} = require("../controllers/drainController");

router.get("/canals", getCanals);
router.get("/", getAllDrains);
router.get("/:id", getDrainById);
router.put("/:id", updateDrain);

module.exports = router;
