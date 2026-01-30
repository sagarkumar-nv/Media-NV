"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/Axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Fetch logged-in user from backend (cookie based)
  const fetchMe = async () => {
  try {
    const res = await api.get("/user/me"); // cookie sent automatically
    setUser(res.data);
    return res.data;
  } catch (err) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMe();
  }, []);

  // 🔹 LOGIN
  const login = async (email, password) => {
    try {
      await api.post("/auth/login", { email, password });
      await fetchMe();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // 🔹 SIGNUP
  const signup = async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      console.log(res)
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // backend clears cookies
    } catch {}
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
