"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MapPin, TestTube2, DollarSign, Package } from "lucide-react";

type Lab = {
  id: number;
  name: string;
  location: string;
  price: number;
  tests: string[];
  rating: number;
  image: string;
  reviews: string[];
  combos: { name: string; price: number; includes: string[] }[];
};

const labs: Lab[] = [
  {
    id: 1,
    name: "Health First Diagnostics",
    location: "Delhi",
    price: 1200,
    tests: ["Blood", "Sugar", "X-Ray"],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
    reviews: [
      "Excellent service, reports came early!",
      "Staff is polite and professional.",
    ],
    combos: [
      { name: "Full Body Checkup", price: 2499, includes: ["Blood", "Lipid", "Sugar", "Thyroid"] },
      { name: "Diabetes Care", price: 999, includes: ["Sugar", "HbA1c", "Urine Test"] },
    ],
  },
  {
    id: 2,
    name: "City Care Labs",
    location: "Mumbai",
    price: 800,
    tests: ["Blood", "Thyroid"],
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1588776814546-3c71aa3a64c1",
    reviews: ["Quick and accurate results.", "Affordable and hygienic."],
    combos: [
      { name: "Health Starter Pack", price: 1199, includes: ["Blood", "Thyroid", "Lipid"] },
    ],
  },
  {
    id: 3,
    name: "Metro Pathology",
    location: "Bangalore",
    price: 1500,
    tests: ["MRI", "CT Scan", "Blood"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600959907703-125ba1374a12",
    reviews: ["Top-notch equipment!", "Friendly staff and very clean."],
    combos: [
      { name: "Advanced Imaging Pack", price: 2999, includes: ["MRI", "CT Scan", "X-Ray"] },
    ],
  },
];

export default function LabsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [test, setTest] = useState("");
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  const filteredLabs = labs.filter(
    (lab) =>
      lab.name.toLowerCase().includes(search.toLowerCase()) &&
      (location ? lab.location.toLowerCase().includes(location.toLowerCase()) : true) &&
      (maxPrice ? lab.price <= maxPrice : true) &&
      (test ? lab.tests.some((t) => t.toLowerCase().includes(test.toLowerCase())) : true)
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-200 px-8 py-20 relative">
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
          <input
            type="text"
            placeholder="🔍 Search labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="text"
            placeholder="📍 Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="number"
            placeholder="💰 Max Price"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
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
              onClick={() => setSelectedLab(lab)}
              className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={lab.image}
                alt={lab.name}
                className="rounded-xl h-40 w-full object-cover mb-3"
              />
              <h2 className="text-xl font-bold text-green-400">{lab.name}</h2>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <MapPin size={14} /> {lab.location}
              </p>
              <p className="mt-2 text-yellow-300 font-semibold flex items-center gap-2">
                <DollarSign size={14} /> ₹{lab.price}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lab.tests.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1 text-yellow-400">
                <Star size={16} /> {lab.rating}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">No labs found matching your filters.</p>
        )}
      </div>

      {/* Lab Details Modal */}
      <AnimatePresence>
        {selectedLab && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-8 text-gray-200 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedLab(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition"
              >
                <X size={22} />
              </button>

              <img
                src={selectedLab.image}
                alt={selectedLab.name}
                className="rounded-xl w-full h-56 object-cover mb-6"
              />
              <h2 className="text-2xl font-bold text-green-400">{selectedLab.name}</h2>
              <p className="text-gray-400 flex items-center gap-2 mt-2">
                <MapPin size={16} /> {selectedLab.location}
              </p>
              <p className="mt-2 text-yellow-300 flex items-center gap-2">
                <DollarSign size={16} /> ₹{selectedLab.price}
              </p>

              <div className="mt-4 flex items-center gap-2 text-yellow-400">
                <Star size={18} /> Rating: {selectedLab.rating}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">
                  <TestTube2 size={18} /> Available Tests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLab.tests.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-pink-400 flex items-center gap-2">
                  <Package size={18} /> Combo Offers
                </h3>
                {selectedLab.combos.map((combo, i) => (
                  <div
                    key={i}
                    className="border border-gray-700 rounded-xl p-3 mb-2 bg-gray-800/40 hover:bg-gray-800/60 transition"
                  >
                    <p className="font-semibold text-pink-300">{combo.name}</p>
                    <p className="text-yellow-300 text-sm">₹{combo.price}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {combo.includes.map((inc, j) => (
                        <span key={j} className="px-2 py-1 text-xs bg-pink-500/20 text-pink-300 rounded-full">
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-green-400">User Reviews</h3>
                {selectedLab.reviews.map((r, i) => (
                  <p key={i} className="text-gray-300 text-sm mb-1">
                    “{r}”
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
