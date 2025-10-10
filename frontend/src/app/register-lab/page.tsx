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

type Lab = {
  id: string;
  name: string;
  locationId?: string;
  address?: string;
  email?: string;
  phone?: string;
  tests?: { name: string; price: number }[];
  combos?: { tests: string[]; price: number }[];
  createdAt: string;
  revenue?: number;
  completedTests?: number;
  pendingTests?: number;
  customers?: number;
  monthlyStats?: { month: string; revenue: number; tests: number }[];
};

enum ViewState {
  SEARCH = "search",
  DASHBOARD = "dashboard",
}

const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const nowISO = () => new Date().toISOString();
const LS_LABS = "lab_admin:labs:v6";

const loadFromLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const saveToLS = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

const seedIfEmpty = () => {
  const labs = loadFromLS<Lab[]>(LS_LABS, []);
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
        createdAt: nowISO(),
        revenue: 54000,
        completedTests: 230,
        pendingTests: 15,
        customers: 180,
        monthlyStats: [
          { month: "Jan", revenue: 38000, tests: 150 },
          { month: "Feb", revenue: 42000, tests: 160 },
          { month: "Mar", revenue: 49000, tests: 180 },
          { month: "Apr", revenue: 52000, tests: 210 },
          { month: "May", revenue: 54000, tests: 230 },
        ],
      },
      {
        id: uid("lab"),
        name: "Sunrise Labs",
        locationId: "LOC2",
        address: "Kolkata",
        email: "contact@sunriselabs.com",
        phone: "9123456780",
        tests: [
          { name: "Thyroid", price: 350 },
          { name: "Liver Function", price: 450 },
          { name: "HbA1c", price: 400 },
        ],
        createdAt: nowISO(),
        revenue: 38000,
        completedTests: 180,
        pendingTests: 25,
        customers: 120,
        monthlyStats: [
          { month: "Jan", revenue: 31000, tests: 130 },
          { month: "Feb", revenue: 34000, tests: 140 },
          { month: "Mar", revenue: 36000, tests: 160 },
          { month: "Apr", revenue: 37000, tests: 170 },
          { month: "May", revenue: 38000, tests: 180 },
        ],
      },
    ];
    saveToLS(LS_LABS, sample);
  }
};
seedIfEmpty();

export default function LabAdminPanel(): JSX.Element {
  const [labs, setLabs] = useState<Lab[]>(() => loadFromLS(LS_LABS, []));
  const [query, setQuery] = useState("");
  const [locationId, setLocationId] = useState("");
  const [view, setView] = useState<ViewState>(ViewState.SEARCH);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showTests, setShowTests] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return labs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) &&
        (locationId === "" || l.locationId === locationId)
    );
  }, [labs, query, locationId]);

  useEffect(() => saveToLS(LS_LABS, labs), [labs]);

  // Search Page
  if (view === ViewState.SEARCH) {
    const locationOptions = Array.from(new Set(labs.map((l) => l.locationId).filter(Boolean)));
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
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
                className="bg-slate-800 border border-slate-700 hover:bg-slate-700 cursor-pointer"
                onClick={() => {
                  setSelectedLab(lab);
                  setView(ViewState.DASHBOARD);
                  setShowTests(false);
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

  // Dashboard Page
  if (view === ViewState.DASHBOARD && selectedLab) {
    const COLORS = ["#22c55e", "#f43f5e"];
    const pieData = [
      { name: "Completed", value: selectedLab.completedTests || 0 },
      { name: "Pending", value: selectedLab.pendingTests || 0 },
    ];

    // Add/Edit Test
    const addTest = () => {
      const name = prompt("Enter new test name:");
      if (!name) return;
      const priceStr = prompt("Enter test price:");
      const price = priceStr ? parseFloat(priceStr) : 0;
      const updatedLab = { 
        ...selectedLab, 
        tests: [...(selectedLab.tests || []), { name, price }] 
      };
      setSelectedLab(updatedLab);
      setLabs(labs.map((l) => (l.id === updatedLab.id ? updatedLab : l)));
    };

    const editTest = (index: number) => {
      const currentTest = selectedLab.tests?.[index];
      const name = prompt("Edit test name:", currentTest.name);
      if (!name || !selectedLab.tests) return;
      const priceStr = prompt("Edit test price:", currentTest.price?.toString() || "0");
      const price = priceStr ? parseFloat(priceStr) : 0;
      const updatedTests = [...selectedLab.tests];
      updatedTests[index] = { name, price };
      const updatedLab = { ...selectedLab, tests: updatedTests };
      setSelectedLab(updatedLab);
      setLabs(labs.map((l) => (l.id === updatedLab.id ? updatedLab : l)));
    };

    // Combo Offer
    const addCombo = () => {
      if (!selectedLab.tests || selectedLab.tests.length < 2) {
        alert("You need at least 2 tests to create a combo.");
        return;
      }
      const testNames = selectedLab.tests.map((t) => t.name);
      const selectedTestsStr = prompt(
        `Select 2 or more tests (comma separated):\n${testNames.join(", ")}`
      );
      if (!selectedTestsStr) return;
      const selectedTests = selectedTestsStr.split(",").map((s) => s.trim()).filter(Boolean);
      if (selectedTests.length < 2) return alert("Select at least 2 tests for a combo.");
      const priceStr = prompt("Enter combo price:");
      const price = priceStr ? parseFloat(priceStr) : 0;

      const updatedLab = { 
        ...selectedLab, 
        combos: [...(selectedLab.combos || []), { tests: selectedTests, price }] 
      };
      setSelectedLab(updatedLab);
      setLabs(labs.map((l) => (l.id === updatedLab.id ? updatedLab : l)));
    };

    const editCombo = (index: number) => {
      const combo = selectedLab.combos?.[index];
      if (!combo) return;
      const selectedTestsStr = prompt(
        "Edit combo tests (comma separated):",
        combo.tests.join(", ")
      );
      if (!selectedTestsStr) return;
      const selectedTests = selectedTestsStr.split(",").map((s) => s.trim()).filter(Boolean);
      if (selectedTests.length < 2) return alert("Combo must have at least 2 tests.");
      const priceStr = prompt("Edit combo price:", combo.price.toString());
      const price = priceStr ? parseFloat(priceStr) : combo.price;

      const updatedCombos = [...(selectedLab.combos || [])];
      updatedCombos[index] = { tests: selectedTests, price };
      const updatedLab = { ...selectedLab, combos: updatedCombos };
      setSelectedLab(updatedLab);
      setLabs(labs.map((l) => (l.id === updatedLab.id ? updatedLab : l)));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-teal-400">{selectedLab.name} Dashboard</h1>
            <Button
              onClick={() => setView(ViewState.SEARCH)}
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              ← Back
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Revenue (₹)" value={selectedLab.revenue?.toLocaleString() || "0"} />
            <StatCard label="Completed Tests" value={selectedLab.completedTests || 0} />
            <StatCard label="Pending Tests" value={selectedLab.pendingTests || 0} />
            <StatCard label="Customers" value={selectedLab.customers || 0} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <Card className="bg-slate-800 border border-slate-700">
              <CardContent className="p-4">
                <h2 className="font-semibold text-teal-300 mb-2">Monthly Revenue</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={selectedLab.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardContent className="p-4">
                <h2 className="font-semibold text-teal-300 mb-2">Tests Per Month</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={selectedLab.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="tests" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border border-slate-700">
            <CardContent className="p-4">
              <h2 className="font-semibold text-teal-300 mb-2">Test Completion Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Test Details Button */}
          <div className="mt-6">
            {!showTests ? (
              <Button onClick={() => setShowTests(true)} className="bg-blue-500 text-white">
                Test Details
              </Button>
            ) : (
              <Card className="bg-slate-800 border border-slate-700">
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-teal-300 font-semibold text-lg">
                      Tests ({selectedLab.tests?.length || 0})
                    </h2>
                    <Button onClick={addTest} className="bg-green-500 text-white">
                      + Add Test
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedLab.tests?.map((t, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-slate-700 px-4 py-2 rounded"
                      >
                        <div>
                          <span>{t.name}</span>{" "}
                          <span className="text-sm text-slate-400">₹{t.price}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => editTest(i)}>
                          Edit
                        </Button>
                      </div>
                    ))}
                    {(!selectedLab.tests || selectedLab.tests.length === 0) && (
                      <p className="text-slate-400 text-sm">No tests available.</p>
                    )}
                  </div>

                  {/* Combo Offers Section */}
                  <div className="mt-4">
                    <h3 className="text-teal-300 font-semibold mb-2">Combo Offers</h3>
                    {selectedLab.combos?.length > 0 ? (
                      selectedLab.combos.map((combo, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-slate-700 px-4 py-2 rounded mb-2"
                        >
                          <span>
                            {combo.tests.join(" + ")} → ₹{combo.price}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editCombo(index)}
                          >
                            Edit
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm mb-2">No combos available.</p>
                    )}
                    <Button onClick={addCombo} className="bg-yellow-500 text-white">
                      + Add Combo Offer
                    </Button>
                  </div>

                  <Button
                    onClick={() => setShowTests(false)}
                    className="mt-4 bg-red-500 text-white"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="bg-slate-800 border border-slate-700 text-center py-4">
      <CardContent>
        <h3 className="text-sm text-slate-400">{label}</h3>
        <p className="text-xl font-bold text-green-400">{value}</p>
      </CardContent>
    </Card>
  );
}
