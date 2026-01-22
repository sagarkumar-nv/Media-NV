"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-green-600 text-green-400">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            LearnHub
          </h2>
          <p className="text-sm text-green-500 leading-relaxed">
            Empowering learning through modern technology, clean UI,
            and secure platforms.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-4 text-green-300">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-green-400">Home</Link></li>
            <li><Link href="/about" className="hover:text-green-400">About</Link></li>
            <li><Link href="/login" className="hover:text-green-400">Login</Link></li>
            <li><Link href="/register" className="hover:text-green-400">Signup</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-green-300">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-green-400 cursor-pointer">Docs</li>
            <li className="hover:text-green-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-green-400 cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-green-300">Contact</h3>
          <p className="text-sm text-green-500">support@learnhub.com</p>
          <p className="text-sm text-green-500 mt-2">India</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-600/40 text-center py-4 text-sm text-green-500">
        © {new Date().getFullYear()} LearnHub. All rights reserved.
      </div>
    </footer>
  );
}
