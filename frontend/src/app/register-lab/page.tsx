"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// -------------------- Types --------------------
type Test = { name: string; price: number; status?: "completed" | "pending"; reportUrl?: string; paymentDone?: boolean };

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tests: Test[];
};

type Lab = {
  id: string;
  name: string;
  locationId?: string;
  address?: string;
  email?: string;
  phone?: string;
  tests?: Test[];
  combos?: { tests: string[]; price: number }[];
  createdAt: string;
  revenue?: number;
  completedTests?: number;
  pendingTests?: number;
  customers?: Customer[];
  monthlyStats?: { month: string; revenue: number; tests: number }[];
};

enum ViewState {
  SEARCH = "search",
  DASHBOARD = "dashboard",
}

// -------------------- Helpers --------------------
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const nowISO = () => new Date().toISOString();
const LS_LABS = "lab_admin:labs:v8";

// ✅ Safe localStorage read/write (won’t break SSR)
const safeLoad = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const safeSave = (key: string, val: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
};

// ✅ Only seed labs *after client mount*
function useSeedLabs() {
  useEffect(() => {
    const labs = safeLoad<Lab[]>(LS_LABS, []);
    if (labs.length === 0) {
      const sample: Lab[] = [
        {
          id: uid("lab"),
          name: "Central Diagnostics",
          locationId: "LOC1",
          address: "Bangalore",
          email: "hello@centraldiag.com",
          phone: "9876543210",
          tests: [
            { name: "CBC", price: 300 },
            { name: "Lipid Profile", price: 500 },
            { name: "Vitamin D", price: 400 },
          ],
          combos: [],
          createdAt: nowISO(),
          revenue: 54000,
          completedTests: 230,
          pendingTests: 15,
          customers: [
            {
              id: uid("cust"),
              name: "Ramesh Kumar",
              email: "ramesh@example.com",
              phone: "9876543210",
              tests: [
                { name: "CBC", price: 300, status: "completed", reportUrl: "", paymentDone: true },
                { name: "Vitamin D", price: 400, status: "pending", reportUrl: "", paymentDone: false },
              ],
            },
            {
              id: uid("cust"),
              name: "Sita Sharma",
              email: "sita@example.com",
              phone: "9123456780",
              tests: [{ name: "Lipid Profile", price: 500, status: "completed", reportUrl: "", paymentDone: true }],
            },
          ],
          monthlyStats: [
            { month: "Jan", revenue: 38000, tests: 150 },
            { month: "Feb", revenue: 42000, tests: 160 },
            { month: "Mar", revenue: 49000, tests: 180 },
            { month: "Apr", revenue: 52000, tests: 210 },
            { month: "May", revenue: 54000, tests: 230 },
          ],
        },
      ];
      safeSave(LS_LABS, sample);
    }
  }, []);
}

// -------------------- Main Component --------------------
export default function LabAdminPanel() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [query, setQuery] = useState("");
  const [locationId, setLocationId] = useState("");
  const [view, setView] = useState<ViewState>(ViewState.SEARCH);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showTests, setShowTests] = useState(false);
  const [customerView, setCustomerView] = useState<{ type: "completed" | "pending" | "all"; data: Customer[] } | null>(
    null
  );

  // ✅ Load labs after mount
  useEffect(() => {
    setLabs(safeLoad(LS_LABS, []));
  }, []);

  // ✅ Seed initial data if empty
  useSeedLabs();

  // ✅ Save labs whenever changed
  useEffect(() => {
    if (labs.length > 0) safeSave(LS_LABS, labs);
  }, [labs]);

  // 🔍 Filter labs
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return labs.filter(
      (l) => l.name.toLowerCase().includes(q) && (locationId === "" || l.locationId === locationId)
    );
  }, [labs, query, locationId]);

  // -------------------- SEARCH PAGE --------------------
  if (view === ViewState.SEARCH) {
    const locationOptions = Array.from(new Set(labs.map((l) => l.locationId).filter(Boolean)));
    return (
      <div className="min-h-screen bg-slate-900 text-white mt-27 p-8 flex flex-col items-center">
        <Button
          onClick={() => alert("Send your application to join Labotics. We will review your lab!")}
          className="mb-6 px-6 py-3 font-bold text-white rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                     transform transition duration-500 hover:scale-105 hover:shadow-lg animate-pulse"
        >
          Join Our Labotics
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-teal-400">Find Your Lab</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Enter lab name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 bg-slate-800 border-slate-700"
          />
          <select
            className="w-48 bg-slate-800 border border-slate-700 text-white px-2"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value="">All Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 w-80">
          {filtered.length > 0 ? (
            filtered.map((lab) => (
              <Card
                key={lab.id}
                className="bg-slate-800 border border-slate-700 hover:bg-slate-700 cursor-pointer transform transition duration-300 hover:scale-105"
                onClick={() => {
                  setSelectedLab(lab);
                  setView(ViewState.DASHBOARD);
                  setShowTests(false);
                  setCustomerView(null);
                }}
              >
                <CardContent className="p-4">
                  <h2 className="font-semibold text-teal-300">{lab.name}</h2>
                  <p className="text-sm text-slate-400">{lab.address}</p>
                  <Badge className="mt-1">{lab.tests?.length || 0} Tests</Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No labs found.</p>
          )}
        </div>
      </div>
    );
  }

  // -------------------- DASHBOARD PAGE --------------------
  if (view === ViewState.DASHBOARD && selectedLab) {
    const COLORS = ["#22c55e", "#f43f5e"];
    const pieData = [
      { name: "Completed", value: selectedLab.completedTests || 0 },
      { name: "Pending", value: selectedLab.pendingTests || 0 },
    ];

    // --- Test & Combo functions (unchanged) ---
    const updateLab = (updated: Lab) => {
      setSelectedLab(updated);
      setLabs(labs.map((l) => (l.id === updated.id ? updated : l)));
    };

    const addTest = () => {
      const name = prompt("Enter new test name:");
      if (!name) return;
      const price = parseFloat(prompt("Enter test price:") || "0");
      updateLab({ ...selectedLab, tests: [...(selectedLab.tests || []), { name, price }] });
    };

    const editTest = (i: number) => {
      const t = selectedLab.tests?.[i];
      if (!t) return;
      const name = prompt("Edit test name:", t.name);
      if (!name) return;
      const price = parseFloat(prompt("Edit test price:", t.price.toString()) || "0");
      const updated = [...(selectedLab.tests || [])];
      updated[i] = { name, price };
      updateLab({ ...selectedLab, tests: updated });
    };

    const addCombo = () => {
      if (!selectedLab.tests || selectedLab.tests.length < 2) return alert("Need at least 2 tests.");
      const testNames = selectedLab.tests.map((t) => t.name);
      const str = prompt(`Select 2+ tests (comma separated):\n${testNames.join(", ")}`);
      if (!str) return;
      const selected = str.split(",").map((s) => s.trim()).filter(Boolean);
      if (selected.length < 2) return alert("Minimum 2 tests required.");
      const price = parseFloat(prompt("Enter combo price:") || "0");
      updateLab({ ...selectedLab, combos: [...(selectedLab.combos || []), { tests: selected, price }] });
    };

    const editCombo = (i: number) => {
      const combo = selectedLab.combos?.[i];
      if (!combo) return;
      const str = prompt("Edit combo tests (comma separated):", combo.tests.join(", "));
      if (!str) return;
      const selected = str.split(",").map((s) => s.trim()).filter(Boolean);
      const price = parseFloat(prompt("Edit combo price:", combo.price.toString()) || combo.price.toString());
      const updated = [...(selectedLab.combos || [])];
      updated[i] = { tests: selected, price };
      updateLab({ ...selectedLab, combos: updated });
    };

    const uploadReport = (ci: number, ti: number) => {
      const url = prompt("Enter PDF report URL:");
      if (!url) return;
      const updatedCustomers = [...(selectedLab.customers || [])];
      updatedCustomers[ci].tests[ti].reportUrl = url;
      updateLab({ ...selectedLab, customers: updatedCustomers });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-teal-400">{selectedLab.name} Dashboard</h1>
            <Button onClick={() => setView(ViewState.SEARCH)} variant="outline" className="border-slate-700 text-slate-300">
              ← Back
            </Button>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Revenue (₹)" value={selectedLab.revenue?.toLocaleString() || "0"} />
            <StatCard
              label="Completed Tests"
              value={selectedLab.completedTests || 0}
              onClick={() =>
                setCustomerView({
                  type: "completed",
                  data: selectedLab.customers?.filter((c) => c.tests.some((t) => t.status === "completed")) || [],
                })
              }
            />
            <StatCard
              label="Pending Tests"
              value={selectedLab.pendingTests || 0}
              onClick={() =>
                setCustomerView({
                  type: "pending",
                  data: selectedLab.customers?.filter((c) => c.tests.some((t) => t.status === "pending")) || [],
                })
              }
            />
            <StatCard
              label="Customers"
              value={selectedLab.customers?.length || 0}
              onClick={() => setCustomerView({ type: "all", data: selectedLab.customers || [] })}
            />
          </div>

          {/* Customer list + charts + test management (same as your original code) */}
          {/* ... keep your same JSX code for customerView, charts, and test management here ... */}

        </div>
      </div>
    );
  }

  return null;
}

// -------------------- StatCard --------------------
function StatCard({ label, value, onClick }: { label: string; value: string | number; onClick?: () => void }) {
  return (
    <Card
      className="bg-slate-800 border border-slate-700 text-center py-4 cursor-pointer hover:bg-slate-700"
      onClick={onClick}
    >
      <CardContent>
        <h3 className="text-sm text-slate-400">{label}</h3>
        <p className="text-xl font-bold text-green-400">{value}</p>
      </CardContent>
    </Card>
  );
}
