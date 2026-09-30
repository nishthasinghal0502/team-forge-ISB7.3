import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("vercel.app")) {
      return "https://team-forge-backend.onrender.com";
    }
  }
  return "http://127.0.0.1:8000";
})();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("team_forge_token") || null;
    }
    return null;
  });
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("team_forge_user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      // If we already have stored token and user, don't block the screen with full loader
      return !localStorage.getItem("team_forge_token");
    }
    return false;
  });

  // Validate token against /api/auth/me on app load
  useEffect(() => {
    let isMounted = true;

    async function checkCurrentSession() {
      const storedToken = localStorage.getItem("team_forge_token");
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
            setToken(storedToken);
            localStorage.setItem("team_forge_user", JSON.stringify(data.user));
          }
        } else {
          // Token is expired, invalid, or corrupted
          localStorage.removeItem("team_forge_token");
          localStorage.removeItem("team_forge_user");
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.warn("Auth check network error, preserving local token for retry:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkCurrentSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || "Failed to log in.");
    }

    localStorage.setItem("team_forge_token", data.token);
    localStorage.setItem("team_forge_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || "Failed to create account.");
    }

    localStorage.setItem("team_forge_token", data.token);
    localStorage.setItem("team_forge_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (credential) => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || "Google authentication failed.");
    }

    localStorage.setItem("team_forge_token", data.token);
    localStorage.setItem("team_forge_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("team_forge_token");
    localStorage.removeItem("team_forge_user");
    setToken(null);
    setUser(null);
  };

  const hasLocalAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("team_forge_token"));
  const isAuthenticated = Boolean((user && token) || hasLocalAuth);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    signup,
    loginWithGoogle,
    logout,
    apiUrl: API_URL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
