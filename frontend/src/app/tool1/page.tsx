"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Lab = {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  tests: string[];
  combos: string[];
  image: string;
};

const labs: Lab[] = [
  { id: 1, name: "Health First Diagnostics", location: "Delhi", price: 1200, rating: 4.7, tests: ["Blood", "Sugar", "X-Ray"], combos: ["Full Body Checkup"], image: "https://images.unsplash.com/photo-1588776814546-ec7c839d63d0" },
  { id: 2, name: "City Care", location: "Mumbai", price: 800, rating: 4.3, tests: ["Blood", "Thyroid"], combos: ["Basic Health Package"], image: "https://images.unsplash.com/photo-1588776814073-7e49d4e6b61b" },
  { id: 3, name: "Metro Pathology", location: "Bangalore", price: 1500, rating: 4.8, tests: ["MRI", "CT Scan", "Blood"], combos: ["Brain Scan Package"], image: "https://images.unsplash.com/photo-1576765607924-3aa8b5b4c19a" },
  { id: 4, name: "Wellnes Labs", location: "Chennai", price: 1000, rating: 4.5, tests: ["Blood", "Lipid", "Diabetes"], combos: ["Heart Health Combo"], image: "https://images.unsplash.com/photo-1588774062340-1ad31d7a6f1c" },
];

export default function LabsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-200 px-8 py-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 text-transparent bg-clip-text"
      >
        Explore Our Labs 🧬
      </motion.h1>

      <div className="max-w-6xl mx-auto mb-10">
        <input
          type="text"
          placeholder="🔍 Search labs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredLabs.map((lab, i) => (
          <motion.div
            key={lab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push(`/labs/${lab.id}`)}
            className="bg-gray-900/70 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-green-400/40 cursor-pointer"
          >
            <img src={lab.image} className="rounded-xl h-48 w-full object-cover mb-4" />
            <h2 className="text-xl font-bold text-green-400">{lab.name}</h2>
            <p className="text-sm text-gray-400">{lab.location}</p>
            <p className="text-yellow-300 font-semibold mt-2">₹{lab.price}</p>
            <p className="text-blue-400 text-sm">⭐ {lab.rating}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
