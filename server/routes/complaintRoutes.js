const express = require("express");
const router = express.Router();
const {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint
} = require("../controllers/complaintController");

router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);
router.post("/", createComplaint);
router.put("/:id", updateComplaint);

module.exports = router;
