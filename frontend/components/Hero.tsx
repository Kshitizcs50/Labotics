"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 bg-gray-900 overflow-hidden">
      {/* Left Content */}
      <motion.div
        className="max-w-xl space-y-6 ml-4 md:ml-12"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-green-400 text-4xl md:text-6xl font-extrabold leading-tight">
          The <span className="text-green-400">Easiest</span> way to Find Labs
        </h1>

        <p className="text-gray-300 text-lg">
          <span className="text-blue-400">
            <Typewriter
              words={[
                "Filter by your choice",
                "Compare test prices",
                "Book tests online",
                "Get reports quickly",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </p>

        <Link
          href="/get-started"
          className="inline-block px-6 py-3 text-lg font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition"
        >
          Get Started →
        </Link>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="mt-10 md:mt-0 mr-4 md:mr-12"
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/hero-image.png"
          alt="Lab illustration"
          width={600}
          height={600}
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </section>
  );
}
