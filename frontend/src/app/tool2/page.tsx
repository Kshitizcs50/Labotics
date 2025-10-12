"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Brain, Loader2, MessageSquare, FileText, Download } from "lucide-react";

export default function ReportAdvisor() {
  const [file, setFile] = useState<File | null>(null);
  const [reportText, setReportText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ user: string; ai: string }[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeReport = async () => {
    setLoading(true);
    setAiResponse("");
    setTimeout(() => {
      setAiResponse(
        "🧠 Based on your report values, there are mild abnormalities in liver enzymes which could indicate early-stage fatty liver. Ensure a balanced diet, regular exercise, and avoid alcohol. We recommend consulting a hepatologist for further evaluation."
      );
      setLoading(false);
    }, 2000);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const newChat = {
      user: chatInput,
      ai: "That’s a great question. Based on your results, it’s advisable to maintain hydration and schedule a follow-up test after 3 months.",
    };
    setChatHistory((prev) => [...prev, newChat]);
    setChatInput("");
  };

  // 💾 Download Text/Advice
  const downloadText = () => {
    const textToDownload =
      aiResponse || reportText || "No AI advice or report content available.";
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Report_Advice.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white flex flex-col items-center py-16 px-6">
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-teal-300 mb-8 drop-shadow-lg"
      >
        Labotics AI Report Advisor
      </motion.h1>

      <Card className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-slate-700 shadow-xl rounded-2xl p-6">
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 p-6 rounded-xl hover:border-teal-400 transition"
          >
            <Upload size={36} className="text-teal-400 mb-3" />
            <p className="text-slate-300 mb-2">Upload your lab report (PDF / Image / Text)</p>
            <Input
              type="file"
              accept=".pdf,image/*,.txt"
              onChange={handleUpload}
              className="cursor-pointer bg-transparent border-none text-center"
            />
            {file && (
              <p className="mt-2 text-teal-400 text-sm">
                <FileText className="inline mr-1" size={14} />
                {file.name}
              </p>
            )}
          </motion.div>

          {/* Optional Manual Input */}
          <div>
            <Textarea
              placeholder="Or paste report values here..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white"
              rows={5}
            />
          </div>

          {/* Analyze + Download Buttons */}
          <motion.div className="flex justify-center gap-4">
            <Button
              onClick={analyzeReport}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
              {loading ? "Analyzing..." : "Analyze Report"}
            </Button>

            <Button
              onClick={downloadText}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Download size={18} /> Download
            </Button>
          </motion.div>

          {/* AI Response */}
          <AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-slate-200"
              >
                <h3 className="text-lg font-semibold text-teal-400 mb-2">AI Insights:</h3>
                <p>{aiResponse}</p>

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => setChatMode(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
                  >
                    <MessageSquare size={16} /> Ask AI More
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Mode */}
          <AnimatePresence>
            {chatMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-900/80 p-4 rounded-xl border border-slate-700"
              >
                <h3 className="text-lg font-semibold text-teal-300 mb-3">
                  💬 AI Health Chat
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {chatHistory.map((msg, i) => (
                    <div key={i}>
                      <p className="text-blue-400 font-semibold">You: {msg.user}</p>
                      <p className="text-slate-300">AI: {msg.ai}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Ask about your results..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="bg-slate-800 border-slate-700"
                  />
                  <Button
                    onClick={handleChat}
                    className="bg-gradient-to-r from-teal-500 to-blue-500"
                  >
                    Send
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
