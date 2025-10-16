"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  Phone,
  Mail,
  DollarSign,
  Download,
} from "lucide-react";

/* ===========================
   Mock lab data (replace with API)
   =========================== */
type Combo = { name: string; price: number; includes: string[] };
type Review = { user: string; comment: string; stars: number; date?: string };
type Lab = {
  id: string;
  name: string;
  owner?: string;
  location: string;
  lat?: number;
  lng?: number;
  priceFrom: number;
  rating: number;
  image: string;
  banner?: string;
  description?: string;
  tests: { name: string; price: number; duration?: string }[];
  combos: Combo[];
  reviews: Review[];
  contact?: { phone?: string; email?: string };
};

const LABS: Record<string, Lab> = {
  "1": {
    id: "1",
    name: "Health First Diagnostics",
    owner: "Dr. Anjali Mehra",
    location: "New Delhi, India",
    lat: 28.644800,
    lng: 77.216721,
    priceFrom: 999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=1600&q=80&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1588776814546-ec7c839d63d0?w=2000&q=80&auto=format&fit=crop",
    description:
      "Health First Diagnostics delivers fast, accurate reports with friendly staff and modern equipment. We offer home collection and express reporting for many tests.",
    tests: [
      { name: "Complete Blood Count (CBC)", price: 300, duration: "24 hrs" },
      { name: "Vitamin D", price: 450, duration: "48 hrs" },
      { name: "Lipid Profile", price: 500, duration: "24 hrs" },
    ],
    combos: [
      { name: "Full Body Checkup", price: 2499, includes: ["CBC", "Lipid", "Thyroid", "Vitamin D"] },
      { name: "Diabetes Care", price: 999, includes: ["Fasting Sugar", "HbA1c", "Lipid"] },
    ],
    reviews: [
      { user: "Amit Sharma", comment: "Great service and quick report.", stars: 5, date: "2025-06-10" },
      { user: "Neha Verma", comment: "Staff were helpful and reports were clear.", stars: 4, date: "2025-08-02" },
    ],
    contact: { phone: "+91 98765 43210", email: "contact@healthfirst.com" },
  },
  "2": {
    id: "2",
    name: "City Care Labs",
    owner: "Mr. Rajiv Patel",
    location: "Mumbai, India",
    lat: 19.075983,
    lng: 72.877655,
    priceFrom: 799,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1588776814546-3c71aa3a64c1?w=1600&q=80&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1588776814073-7e49d4e6b61b?w=2000&q=80&auto=format&fit=crop",
    description:
      "City Care provides reliable pathology and imaging tests with expert review. Affordable packages and fast digital delivery.",
    tests: [
      { name: "Thyroid Profile", price: 400, duration: "24 hrs" },
      { name: "CBC", price: 250, duration: "24 hrs" },
    ],
    combos: [{ name: "Starter Health Pack", price: 1199, includes: ["CBC", "Thyroid", "Lipid"] }],
    reviews: [{ user: "Rohan Desai", comment: "Quick and accurate.", stars: 5, date: "2025-05-01" }],
    contact: { phone: "+91 91234 56780", email: "hello@citycare.in" },
  },
  "3": {
    id: "3",
    name: "Metro Pathology",
    owner: "Dr. K. N. Rao",
    location: "Bangalore, India",
    lat: 12.971599,
    lng: 77.594566,
    priceFrom: 1500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=1600&q=80&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1576765607924-3aa8b5b4c19a?w=2000&q=80&auto=format&fit=crop",
    description:
      "Metro Pathology is recognized for precise imaging and modern lab equipment. Specialist pathologists review critical results.",
    tests: [
      { name: "MRI", price: 6000, duration: "48-72 hrs" },
      { name: "CT Scan", price: 5000, duration: "48-72 hrs" },
      { name: "CBC", price: 300, duration: "24 hrs" },
    ],
    combos: [{ name: "Advanced Imaging Pack", price: 2999, includes: ["MRI", "CT Scan", "X-Ray"] }],
    reviews: [
      { user: "Kavya Rao", comment: "Excellent imaging facilities.", stars: 5, date: "2025-07-14" },
      { user: "Vikas Singh", comment: "Highly professional.", stars: 5, date: "2025-09-01" },
    ],
    contact: { phone: "+91 99887 77665", email: "info@metropath.com" },
  },
};

/* ===========================
   Component: page for /labs/[id]
   =========================== */

export default function LabDetailPage(): JSX.Element {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const id = params?.id ?? "1"; // default fallback

  const lab = useMemo(() => LABS[id] ?? null, [id]);

  const [showBook, setShowBook] = useState(false);
  const [selectedTestIndex, setSelectedTestIndex] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [carouselIndex, setCarouselIndex] = useState(0);

  if (!lab) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Lab not found</h2>
          <p className="mt-2 text-slate-400">We couldn't find the lab you requested.</p>
          <button
            onClick={() => router.push("/labs")}
            className="mt-4 px-4 py-2 bg-emerald-500 rounded-md text-black font-medium"
          >
            Back to labs
          </button>
        </div>
      </main>
    );
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    lab.location
  )}&output=embed`;

  const openBookModal = (testIndex: number | null = null) => {
    setSelectedTestIndex(testIndex);
    setShowBook(true);
  };

  const submitBooking = () => {
    // simple mock confirmation
    const selTest = selectedTestIndex !== null ? lab.tests[selectedTestIndex] : null;
    alert(
      `Booking confirmed for ${name || "Guest"}${selTest ? ` - ${selTest.name}` : ""} on ${
        date || "chosen date"
      }. Lab will contact ${phone || "the provided number"}.`
    );
    // reset
    setShowBook(false);
    setSelectedTestIndex(null);
    setDate("");
    setName("");
    setPhone("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Banner */}
      <div className="relative h-[40vh] md:h-[48vh] overflow-hidden">
        <img
          src={lab.banner ?? lab.image}
          alt={lab.name}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 h-45 bg-gradient-to-b from-transparent to-black/65" />
        <div className="absolute left-6 bottom-8 md:left-16 md:bottom-12">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-10 text-3xl md:text-4xl font-extrabold text-emerald-300"
          >
            {lab.name}
          </motion.h1>
          <p className="mb-35 text-slate-300 flex items-center gap-3">
            <MapPin className="text-slate-300 mt-2" /> {lab.location}
          </p>
        </div>
        <button
          onClick={() => router.push("/labs")}
          className="absolute left-6 top-6 bg-black/40 text-slate-200 px-3 py-2 rounded-md hover:bg-black/60 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto -mt-66 md:-mt-36 px-6 md:px-0">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="col-span-1  bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <img src={lab.image} alt={lab.name} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h3 className="text-lg font-bold text-emerald-300">{lab.name}</h3>
                <p className="text-sm text-slate-400">{lab.owner}</p>
                <div className="mt-2 flex items-center gap-2 text-yellow-300">
                  <Star /> <span className="font-semibold">{lab.rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-slate-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <DollarSign /> From
                </div>
                <div className="font-bold text-emerald-300">₹{lab.priceFrom}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone /> Call
                </div>
                <div className="text-slate-200">{lab.contact?.phone ?? "—"}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail /> Email
                </div>
                <div className="text-slate-200">{lab.contact?.email ?? "—"}</div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => openBookModal(null)}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:scale-105 transition"
                >
                  <Calendar className="inline-block mr-2" /> Book Test
                </button>
                <button
                  onClick={() => {
                    // scroll to map
                    const el = document.getElementById("lab-map");
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="w-full mt-3 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </motion.div>

          {/* Middle column: tests & combos */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-emerald-300">Overview</h3>
            <p className="mt-2 text-slate-300 leading-relaxed">{lab.description}</p>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-sky-300 mb-3">Available Tests</h4>
                <div className="space-y-3">
                  {lab.tests.map((t, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <div>
                        <div className="font-medium text-slate-100">{t.name}</div>
                        <div className="text-xs text-slate-400">{t.duration ?? "Result time varies"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-300">₹{t.price}</div>
                        <button
                          onClick={() => openBookModal(i)}
                          className="mt-2 px-3 py-1 rounded-md bg-emerald-500 text-black text-sm hover:opacity-90"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-pink-300 mb-3">Combo Offers</h4>
                <div className="space-y-3">
                  {lab.combos.map((c, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-slate-100">{c.name}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            Includes: {c.includes.join(", ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-300">₹{c.price}</div>
                          <button
                            onClick={() => openBookModal(null)}
                            className="mt-2 px-3 py-1 rounded-md bg-pink-500 text-black text-sm hover:opacity-90"
                          >
                            Buy Combo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-3">User Reviews</h4>

              <div className="relative">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="bg-slate-800/50 p-4 rounded-lg border border-slate-700"
                  >
                    <p className="text-sm text-slate-300">“{lab.reviews[carouselIndex].comment}”</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-emerald-300 font-semibold">{lab.reviews[carouselIndex].user}</div>
                      <div className="text-yellow-300">⭐ {lab.reviews[carouselIndex].stars}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCarouselIndex((s) => (s - 1 + lab.reviews.length) % lab.reviews.length)}
                    className="px-3 py-1 bg-slate-800 rounded-md border border-slate-700"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCarouselIndex((s) => (s + 1) % lab.reviews.length)}
                    className="px-3 py-1 bg-slate-800 rounded-md border border-slate-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Map */}
            <div id="lab-map" className="mt-6">
              <h4 className="text-lg font-semibold text-sky-300 mb-3">Location</h4>
              <div className="rounded-xl overflow-hidden border border-slate-700">
                <iframe
                  title="lab-map"
                  src={mapSrc}
                  className="w-full h-48 border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Download & share */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  // mock download summary
                  const content = `${lab.name}\n${lab.location}\nFrom: ₹${lab.priceFrom}\nRating: ${lab.rating}`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const u = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = u;
                  a.download = `${lab.name.replace(/\s+/g, "_")}_summary.txt`;
                  a.click();
                  URL.revokeObjectURL(u);
                }}
                className="px-4 py-2 bg-emerald-600 rounded-lg text-black flex items-center gap-2"
              >
                <Download /> Download Summary
              </button>

              <button
                onClick={() => navigator.share?.({ title: lab.name, text: lab.description, url: window.location.href }).catch(()=>{})}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
              >
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBook && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-emerald-300">Book a Test</h3>
                  <button onClick={() => setShowBook(false)} className="text-slate-400 hover:text-red-400">
                    <h1>x</h1>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="text-sm text-slate-300">Select test</label>
                  <select
                    value={selectedTestIndex ?? ""}
                    onChange={(e) => setSelectedTestIndex(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200"
                  >
                    <option value="">-- Any / Combo --</option>
                    {lab.tests.map((t, i) => (
                      <option key={i} value={i}>
                        {t.name} — ₹{t.price}
                      </option>
                    ))}
                    {lab.combos.map((c, i) => (
                      <option key={`c${i}`} value={-1 - i}>
                        {c.name} (combo) — ₹{c.price}
                      </option>
                    ))}
                  </select>

                  <div>
                    <label className="text-sm text-slate-300">Preferred date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200" />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300">Your name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200" />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9xxxxxxxxx" className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200" />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setShowBook(false)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md">Cancel</button>
                    <button onClick={submitBooking} className="px-4 py-2 bg-emerald-500 rounded-md text-black font-semibold">Confirm Booking</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
