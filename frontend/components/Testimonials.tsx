"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Prajwal Sharma",
    role: "Web Developer in Dyte",
    image: "/prajwal.jpeg", // put image in /public
    feedback:
      "Labotics is a healthcare gem. Their modern facility, efficient and friendly staff, and precise diagnostics have been a game–changer for me. With flexible scheduling, transparent pricing, and a strong commitment to community health and safety, Labotics truly stands out.",
  },
  {
    name: "Priyanka Khanna",
    role: "Front-end Developer in TCS",
    image: "/priyanka.jpg",
    feedback:
      "Labotics delivers top–notch diagnostics with cutting–edge technology, friendly and skilled staff, ensuring utmost accuracy and patient privacy. Their flexible scheduling, transparent pricing, and follow-up support make healthcare seamless.",
  },
  {
    name: "Rajdeep Kapoor",
    role: "Accountant in Accenture",
    image: "/rajdeep.jpeg",
    feedback:
      "Labotics is a game–changer. Their comprehensive tests, expert team, and lightning–fast results make healthcare seamless and efficient. Trustworthy, innovative, and reliable — they set a gold standard in healthcare.",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-20 bg-gray-900 text-white text-center">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold mb-6"
      >
        Testimonials
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-gray-300 mb-12 leading-relaxed"
      >
        “Labotics Lab has truly set a gold standard in healthcare. Their
        state–of–the–art facility, highly skilled and friendly staff, and
        unwavering commitment to precision have transformed the way I approach
        my health.”
      </motion.p>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-[1.02] transition-transform duration-500"
          >
            {/* Image */}
            <Image
              src={t.image}
              alt={t.name}
              width={100}
              height={100}
              className="rounded-full object-cover mb-4"
            />

            {/* Name */}
            <h3 className="text-xl font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{t.role}</p>

            {/* Stars */}
            <div className="flex mb-4 text-blue-400">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
            </div>

            {/* Feedback */}
            <p className="text-gray-300 text-sm leading-relaxed">{t.feedback}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
