"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="px-8 py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-200">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 text-transparent bg-clip-text"
      >
        About Us
      </motion.h1>

      {/* Intro */}
      <div className="max-w-5xl mx-auto text-center text-lg leading-relaxed text-gray-300">
        <p>
          Welcome to <span className="text-green-400 font-semibold">Labotics</span> — 
          your trusted partner in modern diagnostics and healthcare innovation. 
          We are dedicated to making healthcare accessible, affordable, and 
          powered by cutting-edge technology.
        </p>
      </div>

      {/* Grid Section */}
      <div className="mt-16 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Image
            src="/about-illustration.png" // add image in /public folder
            alt="Labotics Team"
            width={450}
            height={350}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-left space-y-6"
        >
          <h2 className="text-3xl font-bold text-white">Who We Are</h2>
          <p>
            At Labotics, we bring together a passionate team of developers, 
            healthcare experts, and innovators working to simplify the way 
            people access lab testing. Our mission is to bridge the gap 
            between technology and healthcare with transparency, trust, and 
            quality.
          </p>
          <h2 className="text-3xl font-bold text-white">Our Vision</h2>
          <p>
            We aim to revolutionize diagnostics by building an intelligent, 
            user-friendly, and reliable platform that empowers patients, labs, 
            and doctors alike.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
