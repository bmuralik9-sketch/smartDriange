import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const DEMO_USERS = {
  government: {
    role: "government",
    name: "Er. K. Rajeshwar Rao",
    title: "Chief Municipal Engineer",
    department: "APCRDA Urban Drainage & Flood Response Authority",
    badge: "AP-MUNI-001",
    email: "officer@apdrainage.gov.in",
    phone: "+91 98480 11000",
    area: "Vijayawada-Guntur Capital Region",
    avatar: "🏛️"
  },
  citizen: {
    role: "citizen",
    name: "Priya Varma",
    phone: "+91 98480 33412",
    email: "priya.varma@gmail.com",
    area: "Benz Circle, Vijayawada",
    avatar: "👤"
  },
  worker: {
    role: "worker",
    name: "K. Venkateswara Rao",
    workerId: "WRK-101",
    phone: "+91 98480 22101",
    area: "Vijayawada Central",
    badge: "VMC-SAN-0101",
    status: "available",
    avatar: "👷"
  }
};

export function AuthProvider({ children }) {
  // On startup: check if user already logged in. If not, start as null so LoginPage opens first!
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isLoggedIn = sessionStorage.getItem("smart_drainage_logged_in") === "true";
      if (!isLoggedIn) return null;
      const savedUser = sessionStorage.getItem("smart_drainage_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn("Error reading auth state:", e);
    }
    return null;
  });

  const login = (user) => {
    const fullUser = {
      ...user,
      avatar: user.avatar || (user.role === "citizen" ? "👤" : user.role === "worker" ? "👷" : "🏛️")
    };
    setCurrentUser(fullUser);
    sessionStorage.setItem("smart_drainage_logged_in", "true");
    sessionStorage.setItem("smart_drainage_user", JSON.stringify(fullUser));
    sessionStorage.setItem("smart_drainage_role", user.role);
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("smart_drainage_logged_in");
    sessionStorage.removeItem("smart_drainage_user");
    sessionStorage.removeItem("smart_drainage_role");
  };

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      login(DEMO_USERS[roleKey]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        DEMO_USERS,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
