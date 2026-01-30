"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already logged-in users
  useEffect(() => {
    if (!authLoading && user?.role) {
      switch (user.role) {
        case "Admin":
          router.push("/admin");
          break;
        case "Teacher":
          router.push("/teacher");
          break;
        case "Student":
          router.push("/student");
          break;
        default:
          router.push("/login");
      }
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password); // login should return user data
      if (!res.success) {
        setError(res.message);
        setLoading(false);
        return;
      }

      // Use role from response data for immediate redirect
      const role = res.role;

      switch (role) {
        case "Admin":
          router.push("/admin");
          break;
        case "Teacher":
          router.push("/teacher");
          break;
        case "Student":
          router.push("/student");
          break;
        default:
          router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden px-4">

      {/* Floating gradient shapes */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full top-[-200px] left-[-200px] animate-spin-slow mix-blend-lighten" />
      <div className="absolute w-[500px] h-[500px] bg-green-400/30 rounded-full bottom-[-150px] right-[-150px] animate-spin-slow-reverse mix-blend-lighten" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">

        {/* Left side static content */}
        <div className="hidden md:flex flex-col items-start max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4 transition-transform duration-700 ease-in-out transform hover:scale-105">
            Welcome Back!
          </h1>
          <p className="mb-6 text-gray-300 animate-fade-in">
            Log in to your LearnHub account and continue your journey.
          </p>
          <blockquote className="italic text-gray-400 border-l-4 border-green-400 pl-4 animate-fade-in delay-200">
            “Education is the most powerful weapon which you can use to change the world.” – Nelson Mandela
          </blockquote>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 flex flex-col border border-green-500 animate-slide-up"
        >
          <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 animate-pulse-text">
            LOGIN
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center font-semibold animate-shake">
              {error}
            </p>
          )}

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-green-500 rounded-xl py-2 mb-4 text-green-400 hover:bg-green-500/20 transition transform hover:scale-105 hover:shadow-lg"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-green-500/50 animate-pulse-line" />
            <span className="text-xs text-green-400 uppercase">or</span>
            <div className="flex-1 h-px bg-green-500/50 animate-pulse-line" />
          </div>

          {/* Inputs */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border-2 border-green-600 p-3 rounded-xl mb-4 bg-black text-green-400 placeholder-green-600 focus:border-green-400 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:scale-105 hover:shadow-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-2 border-green-600 p-3 rounded-xl mb-4 bg-black text-green-400 placeholder-green-600 focus:border-green-400 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:scale-105 hover:shadow-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl text-black font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4 text-green-400">
            Don't have an account?{" "}
            <a
              href="/register"
              className="underline text-green-300 hover:text-green-100 transition-colors"
            >
              Register
            </a>
          </p>

          <p className="text-xs text-center text-green-400 mt-6">
            LearnHub © 2026. All rights reserved.
          </p>
        </form>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }

        @keyframes pulse-text {
          0%,100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; }
          50% { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
        }
        .animate-pulse-text { animation: pulse-text 2s ease-in-out infinite; }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease forwards; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }

        @keyframes pulse-line {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-line { animation: pulse-line 1.5s infinite; }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow 60s linear infinite reverse; }
      `}</style>
    </div>
  );
}
