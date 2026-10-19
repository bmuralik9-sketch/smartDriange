// REST API client for Smart Drainage Management System
const API_BASE = "/api";

async function handleResponse(res) {
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error ${res.status}: ${errText}`);
  }
  return res.json();
}

export const api = {
  // Drains
  getDrains: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/drains${query ? `?${query}` : ""}`);
    return handleResponse(res);
  },
  getDrainById: async (id) => {
    const res = await fetch(`${API_BASE}/drains/${id}`);
    return handleResponse(res);
  },
  updateDrain: async (id, data) => {
    const res = await fetch(`${API_BASE}/drains/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getCanals: async () => {
    const res = await fetch(`${API_BASE}/drains/canals`);
    return handleResponse(res);
  },

  // Sensors
  getSensors: async () => {
    const res = await fetch(`${API_BASE}/sensors`);
    return handleResponse(res);
  },
  getSensorById: async (id) => {
    const res = await fetch(`${API_BASE}/sensors/${id}`);
    return handleResponse(res);
  },
  getSensorReadings: async (sensorId = "", limit = 30) => {
    const res = await fetch(`${API_BASE}/sensors/readings?sensorId=${sensorId}&limit=${limit}`);
    return handleResponse(res);
  },
  sendSensorData: async (payload) => {
    const res = await fetch(`${API_BASE}/sensors/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Alerts
  getAlerts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/alerts${query ? `?${query}` : ""}`);
    return handleResponse(res);
  },
  updateAlert: async (id, data) => {
    const res = await fetch(`${API_BASE}/alerts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  createAlert: async (data) => {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Workers
  getWorkers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/workers${query ? `?${query}` : ""}`);
    return handleResponse(res);
  },
  updateWorker: async (id, data) => {
    const res = await fetch(`${API_BASE}/workers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Rainfall
  getRainfall: async () => {
    const res = await fetch(`${API_BASE}/rainfall`);
    return handleResponse(res);
  },
  updateRainfall: async (data) => {
    const res = await fetch(`${API_BASE}/rainfall`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Citizen Complaints
  getComplaints: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/complaints${query ? `?${query}` : ""}`);
    return handleResponse(res);
  },
  getComplaintById: async (id) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    return handleResponse(res);
  },
  createComplaint: async (data) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateComplaint: async (id, data) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Roads Flooding
  getRoadFlooding: async () => {
    const res = await fetch(`${API_BASE}/roads/flooding`);
    return handleResponse(res);
  },

  // Analytics
  getAnalytics: async (range = "7d") => {
    const res = await fetch(`${API_BASE}/analytics?range=${range}`);
    return handleResponse(res);
  },

  // AI & Predictions
  getPredictions: async () => {
    const res = await fetch(`${API_BASE}/ai/predict`);
    return handleResponse(res);
  },

  // Simulation
  triggerSimulation: async (mode = "spike", drainId = null) => {
    const res = await fetch(`${API_BASE}/simulation/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, drainId })
    });
    return handleResponse(res);
  },
  resetSimulation: async () => {
    const res = await fetch(`${API_BASE}/simulation/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return handleResponse(res);
  },

  // Auth & Account Creation
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  }
};
