import React, { useState } from "react";
import {
  Activity,
  Map,
  Layers,
  Cpu,
  Bell,
  CloudRain,
  AlertTriangle,
  Users,
  BarChart3,
  Menu,
  X,
  Radio,
  FileText,
  Camera,
  Wrench,
  CheckCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  Trash2
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

export function Navbar({
  activePage,
  setActivePage,
  alerts = [],
  complaints = [],
  onOpenAlert
}) {
  const {
    isConnected,
    notifications,
    unreadAlertsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    isLiveMonitoringActive,
    setIsLiveMonitoringActive
  } = useSocket();

  const { currentUser, switchRole, logout, DEMO_USERS } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewedAlerts, setViewedAlerts] = useState(false);

  if (!currentUser) return null;

  // Toggle notifications and auto-clear unread badge count
  const handleToggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      markAllNotificationsAsRead();
    }
  };

  const handleSelectNav = (pageId) => {
    if (pageId === "alerts") {
      setViewedAlerts(true);
    }
    setActivePage(pageId);
  };

  // Dynamic Navigation depending on logged-in role
  let navItems = [];

  if (currentUser.role === "citizen") {
    navItems = [
      { id: "citizen", label: "Report Issue", icon: Camera },
      { id: "map", label: "Live Map", icon: Map },
      { id: "drains", label: "Drain Telemetry", icon: Layers }
    ];
  } else if (currentUser.role === "worker") {
    navItems = [
      { id: "worker", label: "Work Orders", icon: Wrench },
      { id: "map", label: "Site GIS Map", icon: Map },
      { id: "alerts", label: "Emergency Alerts", icon: AlertTriangle, badge: viewedAlerts ? 0 : alerts.filter((a) => a.status !== "Resolved").length },
      { id: "drains", label: "Canal Flow", icon: Layers }
    ];
  } else {
    // Government / Admin Role: Show all pages
    navItems = [
      { id: "dashboard", label: "Dashboard", icon: Activity },
      { id: "map", label: "Live Map", icon: Map },
      { id: "drains", label: "Drains", icon: Layers },
      { id: "sensors", label: "Sensors", icon: Cpu },
      { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: viewedAlerts ? 0 : alerts.filter((a) => a.status !== "Resolved").length },
      { id: "complaints", label: "Complaints", icon: FileText, badge: complaints.filter((c) => c.status !== "Resolved").length },
      { id: "rainfall", label: "Rainfall", icon: CloudRain },
      { id: "roads", label: "Road Flooding", icon: AlertTriangle },
      { id: "workers", label: "Workers", icon: Users },
      { id: "analytics", label: "Analytics", icon: BarChart3 }
    ];
  }

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    setShowNotifications(false);

    if (notif.data) {
      if (notif.type === "COMPLAINT") {
        if (currentUser.role === "citizen") setActivePage("citizen");
        else setActivePage("complaints");
      } else {
        if (onOpenAlert) onOpenAlert(notif.data);
      }
    } else {
      setActivePage("alerts");
    }
  };

  const handleLogout = () => {
    setShowRoleMenu(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            if (currentUser.role === "citizen") setActivePage("citizen");
            else if (currentUser.role === "worker") setActivePage("worker");
            else setActivePage("dashboard");
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-base shadow-xs group-hover:bg-blue-600 transition">
            🌊
          </div>
          <div>
            <div className="flex items-center gap-2 leading-none">
              <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                SMART DRAINAGE
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                AP CAPITAL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Vijayawada • Guntur • Mangalagiri
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Clean Linear Style) */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Telemetry Pill, Notifications, User Menu, Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Live Telemetry Status Pill */}
          <button
            onClick={() => setIsLiveMonitoringActive((prev) => !prev)}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition ${
              isConnected && isLiveMonitoringActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
            title="Toggle live telemetry streaming"
          >
            <Radio className={`h-3 w-3 ${isConnected && isLiveMonitoringActive ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} />
            <span>{isLiveMonitoringActive ? "Live IoT" : "Paused"}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Notification Popover Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-50 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-xs font-semibold text-slate-900">
                    Notifications ({unreadAlertsCount} unread)
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadAlertsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-blue-600 hover:underline font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-slate-500 hover:text-red-600 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-2.5 rounded-lg border transition cursor-pointer ${
                          !n.read
                            ? "bg-blue-50/60 border-blue-200"
                            : "bg-white border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold truncate max-w-[200px] ${!n.read ? "text-blue-950" : "text-slate-800"}`}>
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Role Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 hover:bg-slate-50 transition"
            >
              <span className="text-base">{currentUser.avatar}</span>
              <div className="text-left hidden md:block">
                <span className="block font-semibold leading-tight truncate max-w-[95px] text-slate-900">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-slate-500 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{currentUser.role} Portal</div>
                  <div className="text-[10px] text-blue-600 font-medium mt-0.5">{currentUser.area || "AP Capital Region"}</div>
                </div>

                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider px-3 pt-2 pb-1">
                  Switch Persona
                </div>

                {Object.values(DEMO_USERS).map((user) => {
                  const isCurrent = currentUser.role === user.role;
                  return (
                    <button
                      key={user.role}
                      onClick={() => {
                        switchRole(user.role);
                        setShowRoleMenu(false);
                        if (user.role === "citizen") setActivePage("citizen");
                        else if (user.role === "worker") setActivePage("worker");
                        else setActivePage("dashboard");
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition my-0.5 ${
                        isCurrent
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">{user.avatar}</span>
                      <div>
                        <div className="font-medium capitalize">{user.role}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.name}</div>
                      </div>
                    </button>
                  );
                })}

                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectNav(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                  isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="border-t border-slate-100 pt-2 mt-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg bg-red-50 text-red-600 px-3 py-2 text-xs font-medium hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout &amp; Return to Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
