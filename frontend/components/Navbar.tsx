"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-950 shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold">
        <span className="text-green-400">LA</span>
        <span className="text-white"> BO</span>
        <span className="text-amber-200"> TI</span>
        <span className="text-yellow-400"> CS</span>
      </div>

      {/* Menu */}
      <ul className="hidden md:flex space-x-8 text-sm font-medium text-amber-50">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li className="relative group">
          <button className="focus:outline-none">Use our tools ▾</button>
          <ul className="absolute hidden group-hover:block bg-gray-100 mt-2 rounded shadow-lg">
            <li><Link href="/tool1" className="block px-4 py-2 hover:bg-gray-100">Tool 1</Link></li>
            <li><Link href="/tool2" className="block px-4 py-2 hover:bg-gray-100">Tool 2</Link></li>
          </ul>
        </li>
        <li><Link href="/register-lab">Register as lab</Link></li>
        <li><Link href="/interpret-results">Interpret Your results</Link></li>
      </ul>

      {/* Buttons */}
      <div className="space-x-4">
        <Link href="/login" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Login</Link>
        <Link href="/signup" className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700">Sign Up</Link>
      </div>
    </nav>
  );
}
