"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-gray-950/70 border-b border-gray-800 shadow-lg">
      <div className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-widest font-[Orbitron]">
          <span className="bg-gradient-to-r from-green-400 via-amber-200 to-yellow-400 text-transparent bg-clip-text">
            LABOTICS
          </span>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-amber-50">
          <li>
            <Link href="/" className="hover:text-green-400 transition-colors duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-green-400 transition-colors duration-300">
              About
            </Link>
          </li>

          {/* Dropdown */}
          <li className="relative group">
            <button className="focus:outline-none hover:text-green-400 transition-colors duration-300">
              Use our tools ▾
            </button>
            <ul className="absolute left-0 mt-2 w-40 bg-gray-900 text-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transform transition-all duration-300">
              <li>
                <Link
                  href="/tool1"
                  className="block px-4 py-2 hover:bg-gray-800 rounded-t-xl"
                >
                  Tool 1
                </Link>
              </li>
              <li>
                <Link
                  href="/tool2"
                  className="block px-4 py-2 hover:bg-gray-800 rounded-b-xl"
                >
                  Tool 2
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link
              href="/register-lab"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Register as Lab
            </Link>
          </li>
          <li>
            <Link
              href="/interpret-results"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Interpret Results
            </Link>
          </li>
        </ul>

        {/* Buttons */}
        <div className="space-x-4 hidden md:flex">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg transition-transform transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
