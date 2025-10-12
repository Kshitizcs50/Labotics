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
  MessageSquare,
  Download,
  LineChart,
  Brain,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  uploadedAt: string;
  status: "Processing" | "Under Review" | "Completed";
  aiSummary?: string;
  downloadUrl?: string;
  eta?: string;
}

export default function ReportStatusPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [trackingId, setTrackingId] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Mock user reports (simulate fetching from backend)
  useEffect(() => {
    setReports([
      {
        id: "RPT12345",
        name: "Blood Test - CBC",
        uploadedAt: "2025-10-10",
        status: "Completed",
        aiSummary: "Your CBC report shows healthy levels overall. Slight iron deficiency noted.",
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
    ]);
  }, []);

  const handleTrack = () => {
    setLoading(true);
    setTimeout(() => {
      const found = reports.find((r) => r.id === trackingId);
      setSelectedReport(found || null);
      setLoading(false);
    }, 1200);
  };

  const handleAskAI = () => {
    if (!chat.trim()) return;
    setAiResponse("...");
    setTimeout(() => {
      setAiResponse(
        "Based on your recent reports, your overall health looks stable. Maintain hydration and regular exercise!"
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-teal-400 mb-2">
            Track Your Medical Report
          </h1>
          <p className="text-slate-400">
            Stay informed with real-time status, AI summaries, and insights.
          </p>
        </motion.div>

        {/* TRACKING BAR */}
        <div className="flex justify-center items-center gap-3">
          <Input
            placeholder="Enter Report Tracking ID (e.g. RPT12345)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-80 bg-slate-800 border-slate-700"
          />
          <Button
            onClick={handleTrack}
            disabled={!trackingId || loading}
            className="bg-teal-500 hover:bg-teal-600 text-white"
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
            >
              <Card className="bg-slate-800 border border-slate-700 mt-6">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-teal-300">
                      {selectedReport.name}
                    </h2>
                    <BadgeByStatus status={selectedReport.status} />
                  </div>
                  <p className="text-slate-400 text-sm">
                    Uploaded: {selectedReport.uploadedAt}
                  </p>
                  <p className="text-slate-400 text-sm">
                    ETA: {selectedReport.eta}
                  </p>

                  {selectedReport.status === "Completed" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-4 bg-slate-700 rounded-lg"
                    >
                      <h3 className="font-semibold mb-1 text-teal-300">
                        AI Health Summary
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {selectedReport.aiSummary}
                      </p>
                      <Button
                        className="mt-3 bg-blue-500 hover:bg-blue-600"
                        onClick={() => window.open(selectedReport.downloadUrl, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Report
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REPORT HISTORY */}
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
                  <BadgeByStatus status={r.status} />
                </div>
                <p className="text-sm text-slate-400 mb-2">ID: {r.id}</p>
                <p className="text-sm text-slate-400">Uploaded: {r.uploadedAt}</p>
                {r.status === "Completed" && (
                  <Button
                    size="sm"
                    className="mt-3 bg-blue-500 hover:bg-blue-600"
                    onClick={() => window.open(r.downloadUrl, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI CHAT ADVISOR */}
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
            Ask anything about your reports or health condition.
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

function BadgeByStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-yellow-500/20 text-yellow-400",
    "Under Review": "bg-blue-500/20 text-blue-400",
    Completed: "bg-green-500/20 text-green-400",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
