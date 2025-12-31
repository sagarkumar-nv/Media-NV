"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();

    useEffect(() => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) setToken(savedToken);
    }, []);

  const [user, setUser] = useState(null);

  const login = async (formData) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", formData);
      if(response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      }
    } catch(error) {
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
      console.error("Login failed:", errorMsg);
      alert(errorMsg);
      throw error;
    }
  };

  const signUp = async (formData) => {
    // basic client-side validation to avoid obvious bad requests
    if (!formData || !formData.username || !formData.password) {
      const msg = "Please provide both username and password.";
      console.error("SignUp failed:", msg);
      alert(msg);
      throw new Error(msg);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Registration successful! Please log in.");
      } else {
        const msg = response.data?.message || `Unexpected status ${response.status}`;
        console.error("SignUp unexpected response:", msg);
        alert(msg);
        throw new Error(msg);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Registration failed";
      console.error("SignUp failed:", errMsg, error.response?.data || "");
      alert(errMsg);
      throw error;
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  let context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
