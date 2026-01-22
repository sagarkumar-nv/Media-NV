"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Redirect already logged-in users
  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "ADMIN":
          router.push("/admin");
          break;
        case "TEACHER":
          router.push("/teacher");
          break;
        case "STUDENT":
          router.push("/student");
          break;
        default:
          router.push("/login");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(email, password);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    alert(`Login successful! Your role is: ${res.role}`);

    // Redirect based on role
    switch (res.role) {
      case "ADMIN":
        router.push("/admin");
        break;
      case "TEACHER":
        router.push("/teacher");
        break;
      case "STUDENT":
        router.push("/student");
        break;
      default:
        router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Animated neon lines */}
      <div className="absolute w-full h-full top-0 left-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-slide" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 animate-slide delay-500" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-gray-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 flex flex-col z-10 border border-green-500"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 animate-pulse-text">
          LOGIN
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center font-semibold">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border-2 border-green-600 p-3 rounded-xl mb-4 bg-black text-green-400 placeholder-green-600 focus:border-green-400 focus:ring-1 focus:ring-green-500 outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border-2 border-green-600 p-3 rounded-xl mb-4 bg-black text-green-400 placeholder-green-600 focus:border-green-400 focus:ring-1 focus:ring-green-500 outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl text-black font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:scale-105 hover:shadow-xl transition-all duration-300"
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
      </form>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 6s linear infinite;
        }

        @keyframes pulse-text {
          0%, 100% {
            text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
          }
          50% {
            text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00;
          }
        }
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
