"use client";

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 px-10 py-16">
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Column 1 */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
            Labotics
            <span className="absolute left-0 -bottom-1 w-12 h-1 bg-green-500 rounded"></span>
          </h2>
          <ul className="space-y-2 text-sm">
            <li>Advanced Technology</li>
            <li>Comprehensive Test Menu</li>
            <li>Rapid Turnaround</li>
            <li>Quality Assurance</li>
            <li>Healthcare Partnerships</li>
            <li>Convenience & Affordability</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
            Navigate
            <span className="absolute left-0 -bottom-1 w-12 h-1 bg-green-500 rounded"></span>
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-green-400 transition"><a href="/">Home</a></li>
            <li className="hover:text-green-400 transition"><a href="/register">Register</a></li>
            <li className="hover:text-green-400 transition"><a href="/about">About</a></li>
            <li className="hover:text-green-400 transition"><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
            Contact
            <span className="absolute left-0 -bottom-1 w-12 h-1 bg-green-500 rounded"></span>
          </h2>
          <p className="text-sm">Labotics</p>
          <p className="text-sm">📧 labotics@gmail.com</p>
          <p className="text-sm">📧 labotics@yahoo.com</p>
          <p className="text-sm">📍 New Delhi, Bharat (IN)</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        {/* Social Icons */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-green-400 text-lg"><FaFacebookF /></a>
          <a href="#" className="hover:text-green-400 text-lg"><FaInstagram /></a>
          <a href="#" className="hover:text-green-400 text-lg"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-green-400 text-lg"><FaYoutube /></a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-green-400">Labotics</span> ❤️ All rights reserved.
        </p>
      </div>
    </footer>
  );
}
