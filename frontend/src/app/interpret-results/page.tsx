"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  Mail,
  Download,
  Brain,
  MessageSquare,
  LineChart,
  Sparkles,
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

  // New: details modal states
  const [showDetails, setShowDetails] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Mock reports
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

  const handleTrack = () => {
    setLoading(true);
    setTimeout(() => {
      const found = reports.find((r) => r.id === trackingId);
      setSelectedReport(found || null);
      setLoading(false);
      if (!found) {
        alert("No report found with that ID!");
      }
    }, 1000);
  };

  const handleAskAI = () => {
    if (!chat.trim()) return;
    setAiResponse("...");
    setTimeout(() => {
      setAiResponse(
        "Based on your latest results, everything looks fine. Keep up a balanced diet and regular checkups."
      );
    }, 1500);
  };

  const sendEmailUpdate = () => {
    if (!selectedReport) return;
    setEmailAlert(true);
    setTimeout(() => setEmailAlert(false), 4000);
  };

  // ------------------------
  // New: Mock fetch report detail (simulate API)
  // ------------------------
  const mockFetchReportDetails = async (id: string): Promise<ReportDetail> => {
    // simulate latency
    await new Promise((res) => setTimeout(res, 700));

    // produce mock data based on id (simple variations)
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
      // generic
      return {
        id,
        patient: { name: "Anonymous", email: "", phone: "" },
        tests: [
          { name: "Vitamin D", price: 450, status: "pending", reportUrl: "", paymentDone: false },
        ],
        events: [{ time: "2025-10-12 09:00", desc: "Sample received." }],
        doctorNotes: "",
        aiSummary: "",
        downloadUrl: "",
      };
    }
  };

  // ------------------------
  // New: Open details modal
  // ------------------------
  const openDetails = async (reportId: string) => {
    setShowDetails(true);
    setDetailsLoading(true);
    setReportDetails(null);
    try {
      const details = await mockFetchReportDetails(reportId);
      setReportDetails(details);
    } catch (e) {
      console.error(e);
      alert("Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setReportDetails(null);
  };

  // New: mark payment done for a test
  const markPayment = (testIndex: number) => {
    if (!reportDetails) return;
    const updated: ReportDetail = { ...reportDetails };
    updated.tests = updated.tests.map((t, i) =>
      i === testIndex ? { ...t, paymentDone: true } : t
    );
    // add event
    updated.events = [
      ...updated.events,
      { time: new Date().toISOString().slice(0, 16).replace("T", " "), desc: `Payment marked for ${updated.tests[testIndex].name}` },
    ];
    setReportDetails(updated);
  };

  // New: download single test report (if url present) or whole report
  const downloadTestReport = (url?: string) => {
    if (!url || url === "#") {
      // mock download: create text file with summary
      const content = reportDetails?.aiSummary || "Report details not available";
      const blob = new Blob([content], { type: "text/plain" });
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = `${reportDetails?.id || "report"}_summary.txt`;
      a.click();
      URL.revokeObjectURL(u);
      return;
    }
    window.open(url, "_blank");
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-teal-400 mb-2">
            Labotics Report Tracker
          </h1>
          <p className="text-slate-400 text-sm">
            Track your lab reports, get AI advice, and receive instant updates.
          </p>
        </motion.div>

        {/* SEARCH BAR */}
        <div className="flex justify-center items-center gap-3">
          <Input
            placeholder="Enter Tracking ID (e.g. RPT12345)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-80 bg-slate-800 border-slate-700"
          />
          <Button
            onClick={handleTrack}
            disabled={!trackingId || loading}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Track
          </Button>
        </div>

        {/* TRACK RESULT */}
        <AnimatePresence mode="wait">
          {selectedReport && (
            <motion.div
              key={selectedReport.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-slate-800 border border-slate-700 mt-6">
                <CardContent className="p-6 space-y-5">
                  {/* Info */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-teal-300">
                        {selectedReport.name}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Uploaded: {selectedReport.uploadedAt}
                      </p>
                      <p className="text-slate-400 text-sm">
                        ETA: {selectedReport.eta}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgeByStatus status={selectedReport.status} />
                      <Button
                        variant="outline"
                        onClick={() => openDetails(selectedReport.id)}
                        className="border-slate-600 text-slate-200 hover:bg-slate-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* PROGRESS TIMELINE */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-teal-400 mb-3">
                      Report Progress
                    </h3>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700"></div>
                      {["Processing", "Under Review", "Completed"].map(
                        (step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="flex items-start gap-4 mb-5 relative"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${getStepColor(
                                selectedReport.status,
                                step
                              )}`}
                            >
                              {selectedReport.status === step ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">
                                {step}
                              </p>
                              <p className="text-xs text-slate-500">
                                {step === "Processing"
                                  ? "Sample being processed in the lab."
                                  : step === "Under Review"
                                  ? "Doctor reviewing results."
                                  : "Report finalized and ready!"}
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  {/* AI Summary */}
                  {selectedReport.status === "Completed" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-4 bg-slate-700 rounded-lg"
                    >
                      <h3 className="font-semibold mb-1 text-teal-300 flex items-center gap-2">
                        <Brain className="w-5 h-5" /> AI Health Summary
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {selectedReport.aiSummary}
                      </p>
                      <div className="mt-3 flex gap-3">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() =>
                            window.open(selectedReport.downloadUrl, "_blank")
                          }
                        >
                          <Download className="w-4 h-4 mr-2" /> Download Report
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => openDetails(selectedReport.id)}
                          className="border-slate-600 text-slate-200 hover:bg-slate-700"
                        >
                          View Full Details
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Notification */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={sendEmailUpdate}
                      className="border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Send Email Update
                    </Button>
                  </div>
                  {emailAlert && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-green-500/20 border border-green-400 text-green-300 text-sm p-3 rounded-lg text-center"
                    >
                      📧 Email notification sent successfully!
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REPORT HISTORY (cards include View Details) */}
        <div>
          <h2 className="text-2xl font-semibold text-teal-400 mb-4">
            Your Report History
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reports.map((r) => (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-teal-300">{r.name}</p>
                  <div className="flex items-center gap-2">
                    <BadgeByStatus status={r.status} />
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-500"
                      onClick={() => openDetails(r.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-2">ID: {r.id}</p>
                <p className="text-sm text-slate-400">Uploaded: {r.uploadedAt}</p>
                {r.status === "Completed" && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => window.open(r.downloadUrl, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetails(r.id)}
                      className="border-slate-600 text-slate-200 hover:bg-slate-700"
                    >
                      Full View
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Advisor */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-10"
        >
          <h2 className="text-2xl font-semibold text-teal-400 flex items-center gap-2 mb-3">
            <Brain className="w-6 h-6" /> AI Health Advisor
          </h2>
          <p className="text-slate-400 text-sm mb-3">
            Ask about your reports or general health insights.
          </p>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Type your question..."
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
            <Button onClick={handleAskAI} className="bg-teal-500 hover:bg-teal-600">
              <MessageSquare className="w-4 h-4 mr-2" /> Ask
            </Button>
          </div>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-slate-700 rounded-md text-sm text-slate-200"
            >
              {aiResponse}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ---------------------------
          DETAILS MODAL (Animated)
         --------------------------- */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="details-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl bg-white/5 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal-300">
                      {reportDetails?.id ? `Report ${reportDetails.id}` : "Report Details"}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {reportDetails?.patient?.name || "Loading..."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => { if (reportDetails?.downloadUrl) downloadTestReport(reportDetails.downloadUrl); }}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={closeDetails} className="border-slate-600">
                      Close
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Patient & tests */}
                  <div className="space-y-4">
                    <Card className="bg-slate-800 border border-slate-700">
                      <CardContent>
                        <h4 className="font-semibold text-teal-300">Patient Info</h4>
                        <p className="text-sm text-slate-300 mt-2">{reportDetails?.patient?.name}</p>
                        <p className="text-xs text-slate-400">{reportDetails?.patient?.email}</p>
                        <p className="text-xs text-slate-400">{reportDetails?.patient?.phone}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border border-slate-700">
                      <CardContent>
                        <h4 className="font-semibold text-teal-300 mb-2">Tests</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {detailsLoading && <p className="text-slate-400 text-sm">Loading tests...</p>}
                          {!detailsLoading && reportDetails?.tests?.length === 0 && (
                            <p className="text-slate-400 text-sm">No tests listed.</p>
                          )}
                          {!detailsLoading && reportDetails?.tests?.map((t, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-700 p-2 rounded">
                              <div>
                                <p className="font-medium">{t.name}</p>
                                <p className="text-xs text-slate-400">₹{t.price} • {t.status}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {t.reportUrl ? (
                                  <Button size="sm" onClick={() => downloadTestReport(t.reportUrl)}>Download</Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => downloadTestReport(reportDetails?.downloadUrl)}>Summary</Button>
                                )}
                                {!t.paymentDone ? (
                                  <Button size="sm" className="bg-green-600" onClick={() => markPayment(i)}>Mark Paid</Button>
                                ) : (
                                  <span className="text-xs text-green-300">Paid</span>
                                )}
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
                        <h4 className="font-semibold text-teal-300 mb-2">Timeline</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {detailsLoading && <p className="text-slate-400">Loading timeline...</p>}
                          {!detailsLoading && reportDetails?.events?.map((ev, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2" />
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
                        <h4 className="font-semibold text-teal-300 mb-2">Doctor Notes</h4>
                        {detailsLoading ? (
                          <p className="text-slate-400">Loading notes...</p>
                        ) : (
                          <>
                            <p className="text-sm text-slate-300">{reportDetails?.doctorNotes || "No notes available."}</p>
                            <div className="mt-3">
                              <h5 className="text-xs text-slate-400 mb-1">AI Summary</h5>
                              <p className="text-xs text-slate-200">{reportDetails?.aiSummary || "—"}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={closeDetails} className="border-slate-600">
                    Close
                  </Button>
                  <Button onClick={() => { if (reportDetails?.downloadUrl) downloadTestReport(reportDetails.downloadUrl); }} className="bg-teal-500">
                    <Download className="w-4 h-4 mr-2" /> Download Full
                  </Button>
                </div>
              </div>
            </motion.div>
            {/* backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --- Utility Components --- */

function BadgeByStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-yellow-500/20 text-yellow-400",
    "Under Review": "bg-blue-500/20 text-blue-400",
    Completed: "bg-green-500/20 text-green-400",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function getStepColor(current: string, step: string) {
  const colors: Record<string, string> = {
    Processing: "bg-yellow-500/30 text-yellow-300",
    "Under Review": "bg-blue-500/30 text-blue-300",
    Completed: "bg-green-500/30 text-green-300",
  };
  if (current === step) return colors[step];
  const order = ["Processing", "Under Review", "Completed"];
  return order.indexOf(current) > order.indexOf(step)
    ? "bg-green-600 text-green-200"
    : "bg-slate-600 text-slate-400";
}
