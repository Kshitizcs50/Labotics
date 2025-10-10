"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Lab = {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  
  tests?: string[];
  createdAt: string;
};

type Admin = {
  id: string;
  name: string;
  email: string;
  assignedLabIds: string[];
  role: "super" | "manager" | "viewer";
  createdAt: string;
};

const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const nowISO = () => new Date().toISOString();

const LS_LABS = "lab_admin:labs:v1";
const LS_ADMINS = "lab_admin:admins:v1";

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
  const admins = loadFromLS<Admin[]>(LS_ADMINS, []);
  if (labs.length === 0) {
    const sample: Lab[] = [
      { id: uid("lab"), name: "Central Diagnostics", address: "Bangalore", email: "hello@centraldiag.com", phone: "9876543210", tests: ["CBC", "Lipid Profile"], createdAt: nowISO() },
      { id: uid("lab"), name: "Sunrise Labs", address: "Kolkata", email: "contact@sunriselabs.com", phone: "9123456780", tests: ["Thyroid", "Vitamin D"], createdAt: nowISO() },
    ];
    saveToLS(LS_LABS, sample);
  }
  if (admins.length === 0) {
    const sampleA: Admin[] = [
      { id: uid("adm"), name: "Priya Sharma", email: "priya@centraldiag.com", assignedLabIds: [], role: "super", createdAt: nowISO() },
    ];
    saveToLS(LS_ADMINS, sampleA);
  }
};
seedIfEmpty();

export default function LabAdminPanel(): JSX.Element {
  const [labs, setLabs] = useState<Lab[]>(() => loadFromLS(LS_LABS, []));
  const [admins, setAdmins] = useState<Admin[]>(() => loadFromLS(LS_ADMINS, []));
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => saveToLS(LS_LABS, labs), [labs]);
  useEffect(() => saveToLS(LS_ADMINS, admins), [admins]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return labs.filter((l) =>
      [l.name, l.email, l.address, ...(l.tests || [])].join(" ").toLowerCase().includes(q)
    );
  }, [labs, query]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const createLab = () => {
    const newLab: Lab = {
      id: uid("lab"),
      name: "New Lab",
      address: "Unknown",
      email: "",
      phone: "",
      tests: [],
      createdAt: nowISO(),
    };
    setLabs((s) => [newLab, ...s]);
    showToast("New lab added!");
  };

  const deleteLab = (id: string) => {
    setLabs((s) => s.filter((l) => l.id !== id));
    showToast("Lab deleted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
            🧪 Lab Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search labs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
            <Button onClick={createLab} className="bg-green-600 hover:bg-green-500 text-white">
              + Add Lab
            </Button>
          </div>
        </header>

        {/* Labs Section */}
        <section>
          <h2 className="text-lg mb-3 font-semibold text-slate-200">All Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((lab) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-800 border border-slate-700 hover:shadow-lg hover:shadow-green-500/10 transition-all">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-teal-400">{lab.name}</h3>
                        <Badge variant="outline" className="text-xs text-slate-300 border-slate-500">
                          {new Date(lab.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-300">{lab.address}</div>
                      <div className="text-sm text-slate-400">{lab.email || "No email"}</div>
                      <div className="text-sm text-slate-400">📞 {lab.phone || "N/A"}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(lab.tests || []).map((t) => (
                          <Badge key={t} variant="secondary" className="bg-green-700/20 text-green-300 border-green-600/40">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-3 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-500"
                          onClick={() => deleteLab(lab.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Admin Section */}
        <section className="pt-6">
          <h2 className="text-lg mb-3 font-semibold text-slate-200">Registered Admins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((a) => (
              <Card key={a.id} className="bg-slate-800 border border-slate-700">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-400">{a.name}</span>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-300">
                      {a.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400">{a.email}</div>
                  <div className="text-xs text-slate-500">Labs Assigned: {a.assignedLabIds.length}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
