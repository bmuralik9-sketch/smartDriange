const express = require("express");
const router = express.Router();
const {
  getRoadFlooding,
  updateRoad
} = require("../controllers/roadController");

router.get("/flooding", getRoadFlooding);
router.get("/", getRoadFlooding);
router.put("/:id", updateRoad);

module.exports = router;
