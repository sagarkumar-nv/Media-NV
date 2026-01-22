"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-300
        ${
          scrolled
            ? "bg-gray-900/90 backdrop-blur-xl border-b border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            : "bg-transparent"
        }
      `}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-green-400 tracking-wide">
          LearnHub
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>

          <Link
            href="/login"
            className="px-4 py-2 text-green-400 border border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 bg-green-400 text-black rounded-lg font-semibold hover:bg-green-500 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Nav Link ---------- */
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="
        text-green-300 font-medium
        hover:text-green-400
        relative
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0 after:bg-green-400
        after:transition-all after:duration-300
        hover:after:w-full
      "
    >
      {children}
    </Link>
  );
}
