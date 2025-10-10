"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * LabAdminPanel.tsx
 * A single-file React + TypeScript (TSX) component that provides:
 * - searchable lab list (debounced search + highlights)
 * - register admins and assign them to labs
 * - create / edit / delete labs
 * - sorting, pagination, bulk actions, CSV export
 * - localStorage-backed mock persistence (replace with real API easily)
 * - Tailwind CSS utility classes for styling
 *
 * Usage: drop this file into a Next.js / Create React App that supports Tailwind.
 * Replace mock storage functions with real API calls as needed.
 */

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

// Utilities
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const nowISO = () => new Date().toISOString();

// localStorage keys
const LS_LABS = "lab_admin:labs:v1";
const LS_ADMINS = "lab_admin:admins:v1";

// Mock persistence layer (swap for real API)
const loadFromLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.error("LS parse error", e);
    return fallback;
  }
};
const saveToLS = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

// Seed data (only if empty)
const seedIfEmpty = () => {
  const labs = loadFromLS<Lab[]>(LS_LABS, []);
  const admins = loadFromLS<Admin[]>(LS_ADMINS, []);
  if (labs.length === 0) {
    const sample: Lab[] = [
      {
        id: uid("lab"),
        name: "Central Diagnostics",
        address: "12 MG Road, Bangalore",
        email: "hello@centraldiag.example",
        phone: "+91-9876543210",
        tests: ["CBC", "Lipid Profile", "COVID PCR"],
        createdAt: nowISO(),
      },
      {
        id: uid("lab"),
        name: "Sunrise Labs",
        address: "45 Park Street, Kolkata",
        email: "contact@sunriselabs.example",
        phone: "+91-9123456780",
        tests: ["Thyroid", "Vitamin D"],
        createdAt: nowISO(),
      },
      {
        id: uid("lab"),
        name: "HealthFirst Clinic",
        address: "3 MG Marg, Delhi",
        email: "info@healthfirst.example",
        phone: "+91-9988776655",
        tests: ["Blood Sugar", "HbA1c"],
        createdAt: nowISO(),
      },
    ];
    saveToLS(LS_LABS, sample);
  }
  if (admins.length === 0) {
    const sampleA: Admin[] = [
      {
        id: uid("adm"),
        name: "Priya Sharma",
        email: "priya@centraldiag.example",
        assignedLabIds: [],
        role: "super",
        createdAt: nowISO(),
      },
    ];
    saveToLS(LS_ADMINS, sampleA);
  }
};

seedIfEmpty();

export default function LabAdminPanel(): JSX.Element {
  // Data
  const [labs, setLabs] = useState<Lab[]>(() => loadFromLS<Lab[]>(LS_LABS, []));
  const [admins, setAdmins] = useState<Admin[]>(() => loadFromLS<Admin[]>(LS_ADMINS, []));

  // UI State
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Modals / forms
  const [showCreateLab, setShowCreateLab] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [showRegisterAdmin, setShowRegisterAdmin] = useState(false);
  const [selectedLabIds, setSelectedLabIds] = useState<Record<string, boolean>>({});

  // Notifications
  const [toast, setToast] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Persist data when labs/admins change
  useEffect(() => saveToLS(LS_LABS, labs), [labs]);
  useEffect(() => saveToLS(LS_ADMINS, admins), [admins]);

  // Derived list
  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    let out = labs.filter((l) => {
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        (l.address || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.tests || []).some((t) => t.toLowerCase().includes(q))
      );
    });
    out = out.sort((a, b) => {
      const val = sortBy === "name" ? a.name.localeCompare(b.name) : a.createdAt.localeCompare(b.createdAt);
      return sortDir === "asc" ? val : -val;
    });
    return out;
  }, [labs, debouncedQuery, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  // Page slice
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Helpers
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // CRUD for labs
  const createLab = (lab: Partial<Lab>) => {
    const newLab: Lab = {
      id: uid("lab"),
      name: lab.name || "Untitled Lab",
      address: lab.address || "",
      email: lab.email || "",
      phone: lab.phone || "",
      tests: lab.tests || [],
      createdAt: nowISO(),
    };
    setLabs((s) => [newLab, ...s]);
    showToast("Lab created");
  };

  const updateLab = (id: string, patch: Partial<Lab>) => {
    setLabs((s) => s.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    showToast("Lab updated");
  };

  const deleteLab = (id: string) => {
    setLabs((s) => s.filter((l) => l.id !== id));
    // unassign from admins
    setAdmins((s) => s.map(a => ({ ...a, assignedLabIds: a.assignedLabIds.filter(x=>x!==id) })));
    showToast("Lab deleted");
  };

  // Admins
  const registerAdmin = (payload: { name: string; email: string; role: Admin['role']; assignTo: string[] }) => {
    const newAdmin: Admin = {
      id: uid("adm"),
      name: payload.name,
      email: payload.email,
      assignedLabIds: payload.assignTo || [],
      role: payload.role,
      createdAt: nowISO(),
    };
    setAdmins((s) => [newAdmin, ...s]);
    showToast("Admin registered");
  };

  const toggleSelectLab = (id: string) => setSelectedLabIds(prev => ({ ...prev, [id]: !prev[id] }));
  const selectAllOnPage = () => {
    const next: Record<string, boolean> = { ...selectedLabIds };
    pageItems.forEach(i => next[i.id] = true);
    setSelectedLabIds(next);
  };
  const clearSelection = () => setSelectedLabIds({});

  // Bulk assign selected labs to admin
  const bulkAssignToAdmin = (adminId: string) => {
    const ids = Object.entries(selectedLabIds).filter(([_, v]) => v).map(([k]) => k);
    if (ids.length === 0) return showToast("No labs selected");
    setAdmins(s => s.map(a => a.id === adminId ? { ...a, assignedLabIds: Array.from(new Set([...a.assignedLabIds, ...ids])) } : a));
    showToast(`Assigned ${ids.length} lab(s)`);
    clearSelection();
  };

  // Export CSV
  const exportCSV = () => {
    const rows = labs.map(l => ({ id: l.id, name: l.name, email: l.email, phone: l.phone, address: l.address, tests: (l.tests||[]).join("|") }));
    const header = Object.keys(rows[0] || {}).join(",");
    const csv = [header, ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "labs_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Small form components (inline) to keep single-file
  function LabForm({
    initial,
    onCancel,
    onSave,
  }: {
    initial?: Partial<Lab>;
    onCancel: () => void;
    onSave: (payload: Partial<Lab>) => void;
  }) {
    const [name, setName] = useState(initial?.name || "");
    const [email, setEmail] = useState(initial?.email || "");
    const [phone, setPhone] = useState(initial?.phone || "");
    const [address, setAddress] = useState(initial?.address || "");
    const [tests, setTests] = useState((initial?.tests || []).join(", "));

    return (
      <div className="space-y-3">
        <label className="block">
          <div className="text-sm font-medium">Name</div>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Phone</div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Address</div>
          <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Tests (comma separated)</div>
          <input value={tests} onChange={e=>setTests(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={() => onSave({ name, email, phone, address, tests: tests.split(/,\s*/).filter(Boolean) })} className="px-3 py-2 rounded bg-green-500 text-white">Save</button>
        </div>
      </div>
    );
  }

  function AdminRegisterForm({ onCancel, onSave }: { onCancel: () => void; onSave: (p: { name: string; email: string; role: Admin['role']; assignTo: string[] }) => void; }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Admin['role']>('manager');
    const [assignTo, setAssignTo] = useState<string[]>([]);

    const toggleAssign = (id: string) => setAssignTo(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

    return (
      <div className="space-y-3">
        <label className="block">
          <div className="text-sm font-medium">Full name</div>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 rounded border" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Role</div>
          <select value={role} onChange={e=>setRole(e.target.value as Admin['role'])} className="w-full p-2 rounded border">
            <option value="super">Super Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <div>
          <div className="text-sm font-medium mb-1">Assign to labs (optional)</div>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
            {labs.map(l => (
              <label key={l.id} className="flex items-center gap-2 p-1 border rounded">
                <input type="checkbox" checked={assignTo.includes(l.id)} onChange={()=>toggleAssign(l.id)} />
                <div className="text-sm">{l.name}</div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={() => onSave({ name, email, role, assignTo })} className="px-3 py-2 rounded bg-blue-600 text-white">Register</button>
        </div>
      </div>
    );
  }

  // Highlight helper
  const highlight = (text: string) => {
    if (!debouncedQuery) return text;
    const q = debouncedQuery;
    const parts = text.split(new RegExp(`(${q})`, "gi"));
    return parts.map((p, i) => p.toLowerCase() === q.toLowerCase() ? <mark key={i} className="bg-yellow-200">{p}</mark> : <span key={i}>{p}</span>);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lab Admin Panel</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowCreateLab(true); setEditingLab(null); }} className="px-3 py-2 rounded bg-green-600 text-white">New Lab</button>
            <button onClick={() => setShowRegisterAdmin(true)} className="px-3 py-2 rounded bg-blue-600 text-white">Register Admin</button>
            <button onClick={exportCSV} className="px-3 py-2 rounded bg-gray-700 text-white">Export CSV</button>
          </div>
        </header>

        <section className="bg-white p-4 rounded shadow">
          <div className="flex gap-3 items-center mb-4">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search labs, address, test..." className="flex-1 p-2 border rounded" />
            <select value={`${sortBy}_${sortDir}`} onChange={e => { const [s,d] = e.target.value.split("_"); setSortBy(s as any); setSortDir(d as any); }} className="p-2 border rounded">
              <option value="name_asc">Name ↑</option>
              <option value="name_desc">Name ↓</option>
              <option value="createdAt_desc">Newest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
            <div className="text-sm text-gray-500">{filtered.length} labs</div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <button onClick={selectAllOnPage} className="px-2 py-1 rounded bg-slate-200">Select page</button>
            <button onClick={clearSelection} className="px-2 py-1 rounded bg-slate-200">Clear</button>
            <div className="text-sm">Bulk assign to:</div>
            <select onChange={e=>bulkAssignToAdmin(e.target.value)} defaultValue="" className="p-1 border rounded">
              <option value="">Choose admin</option>
              {admins.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pageItems.map(l => (
              <div key={l.id} className="p-3 border rounded bg-white">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={!!selectedLabIds[l.id]} onChange={()=>toggleSelectLab(l.id)} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-lg">{highlight(l.name)}</div>
                        <div className="text-sm text-gray-500">{highlight(l.address || "")}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>{new Date(l.createdAt).toLocaleString()}</div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={()=>{ setEditingLab(l); setShowCreateLab(true); }} className="px-2 py-1 rounded bg-yellow-200">Edit</button>
                          <button onClick={()=>deleteLab(l.id)} className="px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Email: {highlight(l.email || "-")}</div>
                    <div className="text-sm">Phone: {l.phone || "-"}</div>
                    <div className="mt-2 text-sm">Tests: {(l.tests||[]).slice(0,4).join(", ")}{(l.tests||[]).length>4?"...":null}</div>
                    <div className="mt-2 text-xs text-gray-400">ID: {l.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={()=>setPage(p=>Math.max(1, p-1))} className="px-2 py-1 rounded border">Prev</button>
              <div>Page {page} / {totalPages}</div>
              <button onClick={()=>setPage(p=>Math.min(totalPages, p+1))} className="px-2 py-1 rounded border">Next</button>
            </div>
            <div className="text-sm text-gray-500">Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length}</div>
          </footer>
        </section>

        <section className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Admins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {admins.map(a => (
              <div key={a.id} className="p-3 border rounded flex items-start justify-between">
                <div>
                  <div className="font-medium">{a.name} <span className="text-xs text-gray-500">({a.role})</span></div>
                  <div className="text-sm text-gray-500">{a.email}</div>
                  <div className="text-sm mt-2">Assigned: {a.assignedLabIds.length} labs</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={()=>{ navigator.clipboard.writeText(a.id); showToast('Copied admin id'); }} className="px-2 py-1 rounded bg-slate-200">Copy ID</button>
                  <button onClick={()=>setAdmins(s => s.filter(x => x.id !== a.id))} className="px-2 py-1 rounded bg-red-500 text-white">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Create / Edit Lab modal area (simple inline modal) */}
        {showCreateLab && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-xl bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{editingLab ? "Edit Lab" : "Create Lab"}</h3>
                <button onClick={()=>{ setShowCreateLab(false); setEditingLab(null); }} className="text-gray-500">✕</button>
              </div>
              <LabForm initial={editingLab || undefined} onCancel={() => { setShowCreateLab(false); setEditingLab(null); }} onSave={(payload) => {
                if (editingLab) updateLab(editingLab.id, payload); else createLab(payload);
                setShowCreateLab(false); setEditingLab(null);
              }} />
            </div>
          </div>
        )}

        {/* Register Admin modal */}
        {showRegisterAdmin && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-lg bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Register Admin</h3>
                <button onClick={()=>setShowRegisterAdmin(false)} className="text-gray-500">✕</button>
              </div>
              <AdminRegisterForm onCancel={()=>setShowRegisterAdmin(false)} onSave={(p)=>{ registerAdmin(p); setShowRegisterAdmin(false); }} />
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && <div className="fixed bottom-6 right-6 bg-black text-white px-3 py-2 rounded">{toast}</div>}

        <div className="mt-6 text-sm text-gray-500">
          Tip: This component uses localStorage for mock persistence. Replace the load/save helpers with real API calls to integrate with your backend.
        </div>
      </div>
    </div>
  );
}
