"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Lab = {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  tests: string[];
  combos: string[];
  image: string;
  description: string;
  reviews: { user: string; comment: string; stars: number }[];
};

const labs: Lab[] = [
  {
    id: 1,
    name: "Health First Diagnostics",
    location: "Delhi",
    price: 1200,
    rating: 4.7,
    tests: ["Blood", "Sugar", "X-Ray"],
    combos: ["Full Body Checkup", "Diabetes Care"],
    image: "https://images.unsplash.com/photo-1588776814546-ec7c839d63d0",
    description:
      "A top-rated diagnostic center with advanced facilities and quick reporting. Trusted by thousands for accuracy and service.",
    reviews: [
      { user: "Amit Sharma", comment: "Fast results and friendly staff!", stars: 5 },
      { user: "Neha Verma", comment: "Affordable and clean environment.", stars: 4 },
    ],
  },
  {
    id: 2,
    name: "City Care",
    location: "Mumbai",
    price: 800,
    rating: 4.3,
    tests: ["Blood", "Thyroid"],
    combos: ["Basic Health Package"],
    image: "https://images.unsplash.com/photo-1588776814073-7e49d4e6b61b",
    description:
      "City Care provides accurate pathology and imaging tests with expert review and fast digital report delivery.",
    reviews: [
      { user: "Rohan Desai", comment: "Easy booking and clear report summary.", stars: 5 },
    ],
  },
  {
    id: 3,
    name: "Metro Pathology",
    location: "Bangalore",
    price: 1500,
    rating: 4.8,
    tests: ["MRI", "CT Scan", "Blood"],
    combos: ["Brain Scan Package", "Heart Screening"],
    image: "https://images.unsplash.com/photo-1576765607924-3aa8b5b4c19a",
    description:
      "Metro Pathology is known for precise imaging, modern lab equipment, and patient-friendly services.",
    reviews: [
      { user: "Kavya Rao", comment: "Excellent MRI quality and fast delivery!", stars: 5 },
      { user: "Vikas Singh", comment: "Professional and clean facility.", stars: 5 },
    ],
  },
  {
    id: 4,
    name: "Wellnes Labs",
    location: "Chennai",
    price: 1000,
    rating: 4.5,
    tests: ["Blood", "Lipid", "Diabetes"],
    combos: ["Heart Health Combo"],
    image: "https://images.unsplash.com/photo-1588774062340-1ad31d7a6f1c",
    description:
      "Wellnes Labs focuses on preventive care with detailed test panels and personalized health tracking.",
    reviews: [
      { user: "Ritu Mehta", comment: "Loved the report insights!", stars: 4 },
    ],
  },
];

export default function LabsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [test, setTest] = useState("");
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

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
        Explore Our Labs 🧬
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
            placeholder="🧪 Search by Test (e.g., Blood)"
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
              className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-lg hover:scale-105 transition-transform cursor-pointer hover:border-green-500/40"
            >
              <img
                src={lab.image}
                alt={lab.name}
                className="rounded-xl h-40 w-full object-cover mb-3"
              />
              <h2 className="text-xl font-bold text-green-400">{lab.name}</h2>
              <p className="text-sm text-gray-400">{lab.location}</p>
              <p className="mt-2 text-yellow-300 font-semibold">₹{lab.price}</p>
              <p className="text-sm mt-1 text-blue-400">⭐ {lab.rating} / 5</p>
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLab && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/90 p-8 rounded-2xl max-w-3xl w-full border border-gray-700 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedLab(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition"
              >
                <X size={28} />
              </button>

              <img
                src={selectedLab.image}
                alt={selectedLab.name}
                className="rounded-xl h-60 w-full object-cover mb-4"
              />
              <h2 className="text-3xl font-bold text-green-400 mb-2">
                {selectedLab.name}
              </h2>
              <p className="text-gray-400 mb-3">{selectedLab.description}</p>
              <p className="text-yellow-300 font-semibold text-lg">
                ₹{selectedLab.price} | ⭐ {selectedLab.rating}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  Available Combos:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLab.combos.map((combo, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full"
                    >
                      {combo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  Reviews:
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedLab.reviews.map((r, i) => (
                    <div
                      key={i}
                      className="bg-gray-800/60 p-3 rounded-xl border border-gray-700"
                    >
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold text-green-400">
                          {r.user}
                        </span>{" "}
                        ⭐ {r.stars}
                      </p>
                      <p className="text-gray-400 text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-green-500 text-black rounded-xl font-semibold"
                >
                  Book Test
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLab(null)}
                  className="px-5 py-2 bg-red-500/80 text-white rounded-xl font-semibold"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
