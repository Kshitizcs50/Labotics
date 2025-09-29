"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Lab = {
  id: number;
  name: string;
  location: string;
  price: number;
  tests: string[];
};

const labs: Lab[] = [
  { id: 1, name: "Health First Diagnostics", location: "Delhi", price: 1200, tests: ["Blood", "Sugar", "X-Ray"] },
  { id: 2, name: "City Care", location: "Mumbai", price: 800, tests: ["Blood", "Thyroid"] },
  { id: 3, name: "Metro Pathology", location: "Bangalore", price: 1500, tests: ["MRI", "CT Scan", "Blood"] },
  { id: 4, name: "Wellnes ", location: "Chennai", price: 1000, tests: ["Blood", "Lipid", "Diabetes"] },
];

export default function LabsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [test, setTest] = useState("");

  const filteredLabs = labs.filter((lab) => {
    return (
      lab.name.toLowerCase().includes(search.toLowerCase()) &&
      (location ? lab.location.toLowerCase().includes(location.toLowerCase()) : true) &&
      (maxPrice ? lab.price <= maxPrice : true) &&
      (test ? lab.tests.some((t) => t.toLowerCase().includes(test.toLowerCase())) : true)
    );
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-200 px-8 py-20">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 text-transparent bg-clip-text"
      >
        Find a Lab
      </motion.h1>

      {/* Filter/Search Bar */}
      <div className="max-w-6xl mx-auto bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-xl p-6 mb-12">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="📍 Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Price */}
          <input
            type="number"
            placeholder="💰 Max Price"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Tests */}
          <input
            type="text"
            placeholder="🧪 Test (e.g., Blood)"
            value={test}
            onChange={(e) => setTest(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Labs List */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredLabs.length > 0 ? (
          filteredLabs.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-lg hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-bold text-green-400">{lab.name}</h2>
              <p className="text-sm text-gray-400">{lab.location}</p>
              <p className="mt-2 text-yellow-300 font-semibold">₹{lab.price}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lab.tests.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No labs found matching your filters.
          </p>
        )}
      </div>
    </section>
  );
}
