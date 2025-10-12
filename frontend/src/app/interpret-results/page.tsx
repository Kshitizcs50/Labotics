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

export default function ReportStatusPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [trackingId, setTrackingId] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [emailAlert, setEmailAlert] = useState(false);

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

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
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
                    <BadgeByStatus status={selectedReport.status} />
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
                              className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                                getStepColor(selectedReport.status, step)
                              }`}
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
                      <Button
                        className="mt-3 bg-blue-500 hover:bg-blue-600"
                        onClick={() =>
                          window.open(selectedReport.downloadUrl, "_blank")
                        }
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Report
                      </Button>
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
