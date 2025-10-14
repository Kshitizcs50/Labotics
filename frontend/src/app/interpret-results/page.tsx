"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle2,
  Mail,
  Download,
  Brain,
  MessageSquare,
  X,
  Activity,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  uploadedAt: string;
  status: "Processing" | "Under Review" | "Completed";
  aiSummary?: string;
  downloadUrl?: string;
  eta?: string;
  emailNotified?: boolean;
}

interface TestDetail {
  name: string;
  price: number;
  status: "completed" | "pending";
  reportUrl?: string;
  paymentDone?: boolean;
}

interface ReportDetail {
  id: string;
  patient: { name: string; email?: string; phone?: string };
  tests: TestDetail[];
  events: { time: string; desc: string }[];
  doctorNotes?: string;
  aiSummary?: string;
  downloadUrl?: string;
}

export default function ReportStatusPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [trackingId, setTrackingId] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [emailAlert, setEmailAlert] = useState(false);

  // Modal + details state
  const [showDetails, setShowDetails] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // --- Mock data (replace with real fetch) ---
  useEffect(() => {
    setReports([
      {
        id: "RPT12345",
        name: "Complete Blood Count (CBC)",
        uploadedAt: "2025-10-10",
        status: "Completed",
        aiSummary:
          "Your CBC report shows healthy blood cell levels overall. Slight iron deficiency noted — consider iron-rich foods.",
        downloadUrl: "#",
        eta: "Delivered",
      },
      {
        id: "RPT56789",
        name: "Lipid Profile",
        uploadedAt: "2025-10-12",
        status: "Under Review",
        eta: "Expected in 2 hours",
      },
      {
        id: "RPT99999",
        name: "Vitamin D Level Test",
        uploadedAt: "2025-10-12",
        status: "Processing",
        eta: "Expected in 4 hours",
      },
    ]);
  }, []);

  // --- Track by ID ---
  const handleTrack = () => {
    setLoading(true);
    setTimeout(() => {
      const found = reports.find((r) => r.id === trackingId);
      setSelectedReport(found || null);
      setLoading(false);
      if (!found) alert("No report found with that ID!");
    }, 900);
  };

  // --- Simple AI chat mock ---
  const handleAskAI = () => {
    if (!chat.trim()) return;
    setAiResponse("...");
    setTimeout(() => {
      setAiResponse(
        "Based on your latest results, overall status looks stable. Maintain hydration and routine follow-up."
      );
    }, 900);
  };

  // --- Email notification mock ---
  const sendEmailUpdate = () => {
    if (!selectedReport) return;
    setEmailAlert(true);
    setTimeout(() => setEmailAlert(false), 3500);
  };

  // --- Mock fetch details (replace w/ real API) ---
  const mockFetchReportDetails = async (id: string): Promise<ReportDetail> => {
    await new Promise((res) => setTimeout(res, 600));
    if (id === "RPT12345") {
      return {
        id,
        patient: { name: "Ramesh Kumar", email: "ramesh@example.com", phone: "9876543210" },
        tests: [
          { name: "Hemoglobin (Hb)", price: 120, status: "completed", reportUrl: "#", paymentDone: true },
          { name: "WBC", price: 100, status: "completed", reportUrl: "#", paymentDone: true },
          { name: "Platelets", price: 90, status: "completed", reportUrl: "#", paymentDone: true },
        ],
        events: [
          { time: "2025-10-10 09:10", desc: "Sample received at collection center." },
          { time: "2025-10-10 11:30", desc: "Sample processed in lab." },
          { time: "2025-10-10 14:00", desc: "Result reviewed by pathologist." },
          { time: "2025-10-10 14:10", desc: "Report finalized and delivered." },
        ],
        doctorNotes: "Mild iron deficiency. Recommend dietary changes and recheck in 6 weeks.",
        aiSummary: "Slight iron deficiency detected. Consider iron supplements after consultation.",
        downloadUrl: "#",
      };
    } else if (id === "RPT56789") {
      return {
        id,
        patient: { name: "Sita Sharma", email: "sita@example.com", phone: "9123456780" },
        tests: [
          { name: "Total Cholesterol", price: 400, status: "pending", reportUrl: "", paymentDone: false },
          { name: "HDL", price: 200, status: "pending", reportUrl: "", paymentDone: false },
          { name: "LDL", price: 200, status: "pending", reportUrl: "", paymentDone: false },
        ],
        events: [
          { time: "2025-10-12 08:00", desc: "Sample collected." },
          { time: "2025-10-12 10:30", desc: "Received at lab — queued for analysis." },
        ],
        doctorNotes: "",
        aiSummary: "",
        downloadUrl: "",
      };
    } else {
      return {
        id,
        patient: { name: "Anonymous", email: "", phone: "" },
        tests: [{ name: "Vitamin D", price: 450, status: "pending", reportUrl: "", paymentDone: false }],
        events: [{ time: "2025-10-12 09:00", desc: "Sample received." }],
        doctorNotes: "",
        aiSummary: "",
        downloadUrl: "",
      };
    }
  };

  // --- Open modal & load details ---
  const openDetails = async (reportId: string) => {
    // also set selectedReport for context
    const rpt = reports.find((r) => r.id === reportId) || null;
    setSelectedReport(rpt);
    setShowDetails(true);
    setDetailsLoading(true);
    setReportDetails(null);
    try {
      const det = await mockFetchReportDetails(reportId);
      setReportDetails(det);
    } catch (err) {
      console.error(err);
      alert("Failed to load report details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setReportDetails(null);
  };

  // --- Mark payment locally ---
  const markPayment = (testIndex: number) => {
    if (!reportDetails) return;
    const clone = { ...reportDetails, tests: reportDetails.tests.slice(), events: reportDetails.events.slice() };
    clone.tests[testIndex] = { ...clone.tests[testIndex], paymentDone: true };
    clone.events.push({
      time: new Date().toISOString().slice(0, 16).replace("T", " "),
      desc: `Payment recorded for ${clone.tests[testIndex].name}`,
    });
    setReportDetails(clone);
  };

  // --- Download (either file URL or AI summary fallback) ---
  const downloadTestReport = (url?: string | null) => {
    // If explicit url provided and not empty, open it.
    if (url && url !== "#") {
      window.open(url, "_blank");
      return;
    }
    // Fallback: download AI summary or placeholder text
    const text = reportDetails?.aiSummary || reportDetails?.doctorNotes || "Report summary not available.";
    const blob = new Blob([text], { type: "text/plain" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = `${reportDetails?.id ?? "report"}_summary.txt`;
    a.click();
    URL.revokeObjectURL(u);
  };

  // --- Helper: badge styles ---
  function BadgeByStatus({ status }: { status: string }) {
    const styles: Record<string, string> = {
      Processing: "bg-yellow-100 text-yellow-800",
      "Under Review": "bg-sky-100 text-sky-800",
      Completed: "bg-emerald-100 text-emerald-800",
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
  }

  function getStepColor(current: string, step: string) {
    const order = ["Processing", "Under Review", "Completed"];
    if (current === step) return "bg-emerald-600 text-white";
    return order.indexOf(current) > order.indexOf(step) ? "bg-emerald-300 text-emerald-900" : "bg-slate-700 text-slate-200";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-emerald-300">Labotics Report Tracker</h1>
          <p className="text-slate-300 mt-1">Track your lab reports, download results & get AI insights.</p>
        </motion.div>

        {/* Search */}
        <div className="flex justify-center items-center gap-3">
          <Input
            placeholder="Enter Tracking ID (e.g. RPT12345)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-80 bg-slate-800 border-slate-700"
          />
          <Button onClick={handleTrack} disabled={!trackingId || loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Track
          </Button>
        </div>

        {/* Selected tracked report (if any) */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div key={selectedReport.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-slate-800 border border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-emerald-200">{selectedReport.name}</h2>
                      <p className="text-slate-300 text-sm">Uploaded: {selectedReport.uploadedAt}</p>
                      <p className="text-slate-300 text-sm">ETA: {selectedReport.eta ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgeByStatus status={selectedReport.status} />
                      <Button variant="outline" onClick={() => openDetails(selectedReport.id)} className="border-slate-600">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-emerald-300 mb-3">Report Progress</h3>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />
                      {["Processing", "Under Review", "Completed"].map((step, i) => (
                        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }} className="flex items-start gap-4 mb-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStepColor(selectedReport.status, step)}`}>
                            {selectedReport.status === step ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">{step}</p>
                            <p className="text-xs text-slate-400">
                              {step === "Processing" ? "Sample being processed." : step === "Under Review" ? "Doctor reviewing results." : "Report ready to download."}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {selectedReport.status === "Completed" && (
                    <motion.div className="mt-4 p-4 bg-slate-700 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-emerald-200 flex items-center gap-2"><Brain className="w-5 h-5" /> AI Health Summary</h3>
                          <p className="text-slate-200 mt-2 text-sm">{selectedReport.aiSummary}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => downloadTestReport(selectedReport.downloadUrl)}>
                            <Download className="w-4 h-4 mr-2" /> Download Report
                          </Button>
                          <Button variant="outline" onClick={() => openDetails(selectedReport.id)} className="border-slate-600">View Full Details</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={sendEmailUpdate} className="border-emerald-400 text-emerald-300">
                      <Mail className="w-4 h-4 mr-2" /> Send Email Update
                    </Button>
                  </div>

                  {emailAlert && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-emerald-800/20 border border-emerald-600 text-emerald-200 text-sm p-3 rounded-lg text-center">📧 Email sent</motion.div>}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History list */}
        <div>
          <h2 className="text-2xl font-semibold text-emerald-300 mb-4">Your Report History</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reports.map((r) => (
              <motion.div key={r.id} whileHover={{ scale: 1.02 }} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-emerald-200">{r.name}</p>
                  <div className="flex items-center gap-2">
                    <BadgeByStatus status={r.status} />
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500" onClick={() => openDetails(r.id)}>View Details</Button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-1">ID: {r.id}</p>
                <p className="text-sm text-slate-400">Uploaded: {r.uploadedAt}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => downloadTestReport(r.downloadUrl)}><Download className="w-4 h-4 mr-2" /> Download</Button>
                  <Button size="sm" variant="outline" onClick={() => openDetails(r.id)} className="border-slate-600">Full View</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Advisor */}
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-6">
          <h2 className="text-2xl font-semibold text-emerald-300 flex items-center gap-2 mb-2"><Brain className="w-6 h-6" /> AI Health Advisor</h2>
          <p className="text-slate-400 text-sm mb-3">Ask about your reports or general health insights.</p>
          <div className="flex gap-3">
            <Input placeholder="Type your question..." value={chat} onChange={(e) => setChat(e.target.value)} className="bg-slate-700 border-slate-600" />
            <Button onClick={handleAskAI} className="bg-emerald-600 hover:bg-emerald-700"><MessageSquare className="w-4 h-4 mr-2" /> Ask</Button>
          </div>
          {aiResponse && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-slate-700 rounded-md text-sm text-slate-200">{aiResponse}</motion.div>}
        </motion.div>
      </div>

      {/* ----------------------
        Details modal (backdrop first so z-order is correct)
      ----------------------- */}
      <AnimatePresence>
        {showDetails && (
          <>
            {/* Backdrop */}
            <motion.div className="fixed inset-0 z-40 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

            {/* Modal */}
            <motion.div key="details-modal" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-3xl bg-slate-900/75 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-200">{reportDetails?.id ? `Report ${reportDetails.id}` : "Report Details"}</h3>
                      <p className="text-slate-300 text-sm mt-1">{reportDetails?.patient?.name ?? "Loading..."}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => downloadTestReport(reportDetails?.downloadUrl ?? null)}><Download className="w-4 h-4" /></Button>
                      <Button variant="outline" onClick={closeDetails} className="border-slate-600"><X className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: patient + tests */}
                    <div className="space-y-4">
                      <Card className="bg-slate-800 border border-slate-700">
                        <CardContent>
                          <h4 className="font-semibold text-emerald-200">Patient Info</h4>
                          <p className="text-sm text-slate-300 mt-2">{reportDetails?.patient?.name ?? "—"}</p>
                          <p className="text-xs text-slate-400">{reportDetails?.patient?.email ?? "—"}</p>
                          <p className="text-xs text-slate-400">{reportDetails?.patient?.phone ?? "—"}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800 border border-slate-700">
                        <CardContent>
                          <h4 className="font-semibold text-emerald-200 mb-2">Tests</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {detailsLoading && <p className="text-slate-400 text-sm">Loading tests…</p>}
                            {!detailsLoading && reportDetails?.tests?.length === 0 && <p className="text-slate-400 text-sm">No tests listed.</p>}
                            {!detailsLoading && reportDetails?.tests?.map((t, i) => (
                              <div key={i} className="flex justify-between items-center bg-slate-700 p-2 rounded">
                                <div>
                                  <p className="font-medium">{t.name}</p>
                                  <p className="text-xs text-slate-400">₹{t.price} • {t.status}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" onClick={() => downloadTestReport(t.reportUrl ?? null)}>{t.reportUrl ? "Download" : "Summary"}</Button>
                                  {!t.paymentDone ? <Button size="sm" className="bg-emerald-600" onClick={() => markPayment(i)}>Mark Paid</Button> : <span className="text-xs text-emerald-300">Paid</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right: timeline & notes */}
                    <div className="space-y-4">
                      <Card className="bg-slate-800 border border-slate-700">
                        <CardContent>
                          <h4 className="font-semibold text-emerald-200 mb-2">Timeline</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {detailsLoading && <p className="text-slate-400">Loading timeline…</p>}
                            {!detailsLoading && reportDetails?.events?.map((ev, idx) => (
                              <motion.div key={idx} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-emerald-300 rounded-full mt-2" />
                                <div>
                                  <p className="text-xs text-slate-300">{ev.time}</p>
                                  <p className="text-sm text-slate-200">{ev.desc}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800 border border-slate-700">
                        <CardContent>
                          <h4 className="font-semibold text-emerald-200 mb-2">Doctor Notes</h4>
                          {detailsLoading ? <p className="text-slate-400">Loading notes…</p> : <>
                            <p className="text-sm text-slate-300">{reportDetails?.doctorNotes ?? "No notes available."}</p>
                            <div className="mt-3">
                              <h5 className="text-xs text-slate-400 mb-1">AI Summary</h5>
                              <p className="text-xs text-slate-200">{reportDetails?.aiSummary ?? "—"}</p>
                            </div>
                          </>}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={closeDetails} className="border-slate-600">Close</Button>
                    <Button onClick={() => downloadTestReport(reportDetails?.downloadUrl ?? null)} className="bg-emerald-600"> <Download className="w-4 h-4 mr-2" /> Download Full</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
