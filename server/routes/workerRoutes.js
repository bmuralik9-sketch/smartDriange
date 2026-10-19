const express = require("express");
const router = express.Router();
const {
  getAllWorkers,
  getWorkerById,
  updateWorker
} = require("../controllers/workerController");

router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorker);

module.exports = router;
