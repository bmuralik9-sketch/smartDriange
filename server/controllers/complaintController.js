const store = require("../models/store");
const { emitEvent } = require("../socket");

const getAllComplaints = async (req, res) => {
  try {
    const { status, assignedWorker, citizenPhone } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assignedWorker) filter.assignedWorker = assignedWorker;
    if (citizenPhone) filter.citizenPhone = citizenPhone;

    const complaints = await store.getComplaints(filter);
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await store.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createComplaint = async (req, res) => {
  try {
    const {
      citizenName,
      citizenPhone,
      citizenEmail,
      category,
      drainId,
      location,
      description,
      photoUrl,
      urgency
    } = req.body;

    if (!location || !description) {
      return res.status(400).json({
        success: false,
        message: "Location and description are required to submit a complaint"
      });
    }

    const complaintData = {
      citizenName: citizenName || "Concerned Citizen",
      citizenPhone: citizenPhone || "",
      citizenEmail: citizenEmail || "",
      category: category || "Drain Blockage",
      drainId: drainId || "DRAIN-001",
      location,
      description,
      photoUrl: photoUrl || "",
      urgency: urgency || "medium",
      status: "Pending",
      assignedWorker: "Unassigned",
      resolutionNotes: "",
      createdAt: new Date().toISOString()
    };

    const newComplaint = await store.addComplaint(complaintData);

    // Broadcast new complaint in real time to Government and Worker dashboards
    emitEvent("complaint_new", newComplaint);

    res.status(201).json({
      success: true,
      message: "Complaint lodged successfully with municipal authority",
      data: newComplaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.status === "Resolved" && !updates.resolvedAt) {
      updates.resolvedAt = new Date().toISOString();
    }

    const updated = await store.updateComplaint(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    // Broadcast update in real time
    emitEvent("complaint_update", updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint
};
