"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-200">
      {/* Hero Section */}
      <div className="px-8 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text"
        >
          About Labotics
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          We are on a mission to <span className="text-green-400 font-semibold">transform diagnostics</span> with 
          technology, transparency, and trust. Our platform bridges the gap between 
          patients, labs, and doctors for faster, smarter, and affordable healthcare.
        </motion.p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Image
            src="/about.jpg" // place an image inside /public
            alt="Labotics Team"
            width={500}
            height={400}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p>
            At Labotics, we believe healthcare should be <span className="text-green-400 font-semibold">simple and accessible</span>. 
            That’s why we’re building tools that make lab testing faster, smarter, and more transparent.
          </p>
          <h2 className="text-3xl font-bold text-white">Our Vision</h2>
          <p>
            To become the world’s most trusted diagnostic platform by combining innovation, 
            data intelligence, and patient-first design.
          </p>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="px-8 py-20 bg-gray-900/50">
        <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
          Meet Our Team
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Team Member */}
          {[
            { name: "Kshitiz Kumar", role: "Founder & Developer", img: "/team1.jpg" },
            { name: "Priya Sharma", role: "Data Scientist", img: "/team2.jpg" },
            { name: "Rahul Verma", role: "UI/UX Designer", img: "/team3.jpg" },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform text-center"
            >
              <Image
                src={member.img}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 border-4 border-green-400"
              />
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-green-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
