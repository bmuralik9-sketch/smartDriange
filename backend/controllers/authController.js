const store = require("../models/store");

// In-Memory user registry
let registeredUsers = [
  {
    id: "USR-001",
    role: "government",
    name: "Er. K. Rajeshwar Rao",
    email: "officer@apdrainage.gov.in",
    phone: "+91 98480 11000",
    title: "Chief Municipal Engineer, APCRDA",
    area: "Vijayawada-Guntur Capital Region",
    badge: "AP-MUNI-001"
  },
  {
    id: "USR-002",
    role: "citizen",
    name: "Priya Varma",
    email: "priya.varma@gmail.com",
    phone: "+91 98480 33412",
    area: "Benz Circle, Vijayawada"
  },
  {
    id: "USR-003",
    role: "worker",
    name: "K. Venkateswara Rao",
    workerId: "WRK-101",
    email: "venkatesh.k@vmc.gov.in",
    phone: "+91 98480 22101",
    area: "Vijayawada Central",
    badge: "VMC-SAN-0101",
    status: "available"
  }
];

const register = async (req, res) => {
  try {
    const { role, name, phone, email, area, password, title } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full Name and Phone Number are required to create an account"
      });
    }

    const assignedRole = role === "worker" ? "worker" : "citizen";
    const newId = `USR-${Date.now().toString().slice(-4)}`;

    let userRecord = {
      id: newId,
      role: assignedRole,
      name,
      phone,
      email: email || `${phone}@apdrainage.in`,
      area: area || "Vijayawada Central",
      title: title || (assignedRole === "worker" ? "Sanitation Field Officer" : "Registered Resident")
    };

    if (assignedRole === "worker") {
      const workerNum = Math.floor(100 + Math.random() * 900);
      userRecord.workerId = `WRK-${workerNum}`;
      userRecord.badge = `AP-MUNI-${workerNum}`;
      userRecord.status = "available";

      // Also add to active municipal workers list in store
      await store.updateWorker(userRecord.workerId, {
        workerId: userRecord.workerId,
        name: userRecord.name,
        phone: userRecord.phone,
        area: userRecord.area,
        status: "available",
        currentTask: "Newly registered - Available for dispatch",
        alertsAssigned: 0,
        badgeNumber: userRecord.badge,
        lastActive: "Just now"
      });
    }

    registeredUsers.push(userRecord);

    res.status(201).json({
      success: true,
      message: `Account created successfully for ${name} (${assignedRole.toUpperCase()})`,
      user: userRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { role, identifier } = req.body;

    // Search by role or phone/email
    let matchedUser = null;
    if (identifier) {
      matchedUser = registeredUsers.find(
        (u) =>
          u.phone === identifier ||
          u.email?.toLowerCase() === identifier.toLowerCase() ||
          u.workerId === identifier
      );
    }

    if (!matchedUser && role) {
      matchedUser = registeredUsers.find((u) => u.role === role);
    }

    if (!matchedUser) {
      // Default fallback by role
      matchedUser = {
        id: `USR-DEF-${Date.now()}`,
        role: role || "government",
        name: role === "citizen" ? "Resident Citizen" : role === "worker" ? "Field Technician" : "Municipal Engineer",
        phone: "+91 98480 00000",
        area: "Vijayawada-Guntur Region"
      };
    }

    res.json({
      success: true,
      message: `Logged in successfully as ${matchedUser.role}`,
      user: matchedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login
};
