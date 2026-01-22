"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();


  const [role, setRole] = useState("STUDENT");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  // Mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (role === "ADMIN") {
      setError("You cannot register as admin.");
      setLoading(false);
      return;
    }

    const res = await signup({ ...form, role });
    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  if (!mounted) return null; // Wait until client mounts

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      
      {/* Ambient Light Background */}
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-3xl animate-spin-slow opacity-30 -top-32 -right-32 pointer-events-none"></div>

      {/* Flex container for image + form */}
      <div className="flex flex-col md:flex-row items-center bg-gray-800 rounded-xl shadow-2xl border border-green-500 overflow-hidden max-w-4xl w-full relative z-10">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0 p-4">
          <Image
            src="/hero-fallback.jpg"
            alt="LearnHub Logo"
            width={300}
            height={300}
            className="object-cover rounded-full"
          />
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-10 flex flex-col justify-center relative z-10"
        >
          {/* App Name */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-extrabold text-green-400 tracking-wide">
              LearnHub
            </h1>
          </div>

          {/* Role Selection */}
          <div className="flex justify-center mb-6">
            {["STUDENT", "TEACHER"].map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-6 py-2 font-bold ${
                  i === 0 ? "rounded-l-full" : "rounded-r-full"
                } ${
                  role === r
                    ? "bg-green-500 text-black shadow-lg shadow-green-500/60"
                    : "bg-gray-700 text-green-400 border border-green-500"
                } hover:bg-green-400 hover:text-black transition-all duration-200`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {/* Inputs */}
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-green-500 p-3 rounded mb-4 bg-gray-700 text-green-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-green-500 p-3 rounded mb-4 bg-gray-700 text-green-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-green-500 p-3 rounded mb-6 bg-gray-700 text-green-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-green-500 text-black font-bold py-3 rounded hover:bg-green-600 transition-all duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-sm text-center mt-4 text-green-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-500 underline hover:text-green-400 transition"
            >
              Login
            </a>
          </p>
        </form>
      </div>

      {/* Extra CSS for animation */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
