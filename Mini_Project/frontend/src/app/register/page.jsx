"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState("STUDENT"); // default
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prevent self-registering as admin
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-green-500"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400 tracking-wide">
          Register
        </h2>

        {/* Role selection */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`px-6 py-2 rounded-l-full font-bold ${
              role === "STUDENT"
                ? "bg-green-500 text-black"
                : "bg-gray-800 text-green-400 border border-green-500"
            } hover:bg-green-400 transition-all duration-200`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("TEACHER")}
            className={`px-6 py-2 rounded-r-full font-bold ${
              role === "TEACHER"
                ? "bg-green-500 text-black"
                : "bg-gray-800 text-green-400 border border-green-500"
            } hover:bg-green-400 transition-all duration-200`}
          >
            Teacher
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          name="name"
          placeholder="Name"
          className="w-full border border-green-500 p-2 rounded mb-3 bg-gray-900 text-green-300 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border border-green-500 p-2 rounded mb-3 bg-gray-900 text-green-300 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border border-green-500 p-2 rounded mb-3 bg-gray-900 text-green-300 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-black font-bold py-2 rounded hover:from-green-400 hover:to-green-600 transition-all duration-300"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4 text-green-300">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
