import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestEvent, setLatestEvent] = useState(null);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [lastTelemetryTimestamp, setLastTelemetryTimestamp] = useState(Date.now());
  const [isLiveMonitoringActive, setIsLiveMonitoringActive] = useState(true);

  // Notifications with real AP Capital Region incidents & full data payloads
  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF-AP-001",
      alertId: "ALT-AP-001",
      title: "🚨 Critical Blockage at Benz Circle",
      message: "Benz Circle storm canal level 94%, flow near zero (0.4 L/min). Silt choke under NH-16 ramp.",
      time: "5 mins ago",
      type: "CRITICAL",
      read: false,
      data: {
        alertId: "ALT-AP-001",
        drainId: "DRAIN-001",
        location: "Benz Circle NH-16 Flyover Lower Ramp, Vijayawada",
        waterLevel: 94,
        flowRate: 0.4,
        riskLevel: "CRITICAL",
        type: "CRITICAL",
        status: "New",
        message: "Critical blockage detected at Benz Circle. Water level rising while flow is near zero (0.4 L/min).",
        assignedWorker: "K. Venkateswara Rao"
      }
    },
    {
      id: "NOTIF-AP-002",
      alertId: "ALT-AP-002",
      title: "🚨 Silt Run-off at Mangalagiri Temple Road",
      message: "Hillock silt trapped in storm grating (94% level). De-silting crew assigned.",
      time: "15 mins ago",
      type: "CRITICAL",
      read: false,
      data: {
        alertId: "ALT-AP-002",
        drainId: "DRAIN-009",
        location: "Panakala Narasimha Swamy Temple Road, Mangalagiri",
        waterLevel: 94,
        flowRate: 0.2,
        riskLevel: "CRITICAL",
        type: "CRITICAL",
        status: "Assigned",
        message: "Critical blockage detected at Mangalagiri Temple Road. Silt run-off from hillocks trapped in storm grating.",
        assignedWorker: "B. Nagaraju"
      }
    },
    {
      id: "NOTIF-AP-003",
      alertId: "CMP-AP-001",
      title: "👤 Citizen Complaint: KR Market Culvert",
      message: "Vegetable waste clogging culvert near Gate 2, Vijayawada Old Town.",
      time: "30 mins ago",
      type: "COMPLAINT",
      read: false,
      data: {
        complaintId: "CMP-AP-001",
        category: "Drain Blockage",
        location: "Kaleswara Rao Market Vegetable Yard, Vijayawada",
        description: "Vegetable waste and plastic bags choking inflow to main canal.",
        status: "New",
        assignedWorker: "P. Srinivas"
      }
    }
  ]);

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = useCallback((notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId || n.alertId === notifId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const socketServerUrl =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : window.location.origin;

    const socketInstance = io(socketServerUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 20,
      reconnectionDelay: 1000
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Connected to Smart Drainage WebSocket:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket, switching to resilient fallback");
      setIsConnected(false);
    });

    // Handle incoming telemetry events
    socketInstance.on("alert_new", (alert) => {
      setLatestEvent({ type: "alert_new", data: alert, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());

      const newNotif = {
        id: `NOTIF-${Date.now()}`,
        alertId: alert.alertId,
        title: `${alert.type === "CRITICAL" ? "🚨 " : "⚠️ "}${alert.type} Incident: ${alert.location}`,
        message: alert.message,
        time: "Just now",
        type: alert.type || "CRITICAL",
        read: false,
        data: alert
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);

      if (alert.type === "CRITICAL" || alert.riskLevel === "CRITICAL" || alert.message?.includes("Blockage")) {
        setEmergencyAlert(alert);
      }
    });

    socketInstance.on("complaint_new", (complaint) => {
      setLatestEvent({ type: "complaint_new", data: complaint, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());

      const newNotif = {
        id: `NOTIF-${Date.now()}`,
        alertId: complaint.complaintId,
        title: `👤 New Citizen Complaint: ${complaint.category}`,
        message: `${complaint.location} - ${complaint.description}`,
        time: "Just now",
        type: "COMPLAINT",
        read: false,
        data: complaint
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
    });

    socketInstance.on("alert_update", (alert) => {
      setLatestEvent({ type: "alert_update", data: alert, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    socketInstance.on("complaint_update", (complaint) => {
      setLatestEvent({ type: "complaint_update", data: complaint, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    socketInstance.on("drain_update", (drain) => {
      setLatestEvent({ type: "drain_update", data: drain, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    socketInstance.on("sensor_update", (sensor) => {
      setLatestEvent({ type: "sensor_update", data: sensor, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    socketInstance.on("rainfall_update", (rainfall) => {
      setLatestEvent({ type: "rainfall_update", data: rainfall, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    socketInstance.on("worker_update", (worker) => {
      setLatestEvent({ type: "worker_update", data: worker, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    socketInstance.on("system_reset", (info) => {
      setLatestEvent({ type: "system_reset", data: info, timestamp: Date.now() });
      setLastTelemetryTimestamp(Date.now());
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const dismissEmergencyAlert = () => {
    setEmergencyAlert(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        latestEvent,
        emergencyAlert,
        setEmergencyAlert,
        dismissEmergencyAlert,
        notifications,
        unreadAlertsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        lastTelemetryTimestamp,
        isLiveMonitoringActive,
        setIsLiveMonitoringActive
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
