"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Comprehensive Lab Database",
    description:
      "Explore an extensive database of labs, each with detailed information about their services, locations, and pricing.",
    image: "/data.png", // add this in /public
  },
  {
    title: "User Reviews and Ratings",
    description:
      "Read authentic user feedback and ratings to choose the best labs with confidence.",
    image: "/review.jpg", // add this in /public
  },
  {
    title: "Advanced Search and Filtering",
    description:
      "Effortlessly find labs that meet your specific needs using our powerful search and filter options.",
    image: "/feature.png", // already in your project
  },
];

export default function Features() {
  return (
    <section className="px-8 py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="w-96 h-96 bg-blue-600/30 rounded-full blur-3xl absolute top-20 left-10 animate-pulse"></div>
        <div className="w-96 h-96 bg-green-600/20 rounded-full blur-3xl absolute bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 text-transparent bg-clip-text"
      >
        Features
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "4rem" }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-12 rounded-full"
      ></motion.div>

      {/* Features List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-10 md:gap-14">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12 hover:scale-[1.02] transition-transform duration-500"
          >
            {/* Text */}
            <div className="flex-1 text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10, rotate: 2 }}
              className="flex-shrink-0"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={260}
                height={260}
                className="drop-shadow-xl rounded-2xl"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
