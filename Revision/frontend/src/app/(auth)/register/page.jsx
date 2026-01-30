"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Chrome, Sun, Moon } from "lucide-react";

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (!mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signup({ ...form, role });

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create your account
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1 mb-6">
          Start learning on LearnHub
        </p>

        {/* Google */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition mb-6">
          <Chrome size={18} />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          <span className="text-xs text-gray-400 uppercase">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
        </div>

        {/* Role Switch */}
        <div className="grid grid-cols-2 mb-6 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          {["Student", "Teacher"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 text-sm font-semibold transition ${
                role === r
                  ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
          By signing up, you agree to our Terms & Privacy Policy
        </p>

        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-gray-900 dark:text-white hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
