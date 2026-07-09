"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { getUserId, isProfileComplete } from "../lib/user";
import { StudentProfile, ResumeAnalysis } from "../types";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { FileText, BarChart3, Upload } from "lucide-react";
import ProfileGate from "@/app/components/ProfileGate";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [dragActive, setDragActive] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    async function loadData() {
      const profileData = await api.getProfile(userId);
      setProfile(profileData);
      
      if (isProfileComplete(profileData)) {
        const analysisData = await api.getResumeAnalysis(userId);
        if (analysisData) {
          setAnalysis(analysisData);
        }
      }
      
      setProfileLoading(false);
    }

    loadData();
  }, [userId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      const data = await api.uploadResume(userId, file);
      setAnalysis(data);
      setMessage({
        text: "Resume analyzed successfully!",
        type: "success",
      });
    } catch {
      setMessage({
        text: "Failed to analyze resume",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Extract score for highlight if exists
  const extractScore = (content: string) => {
    const scoreRegex = /(?:ATS|Overall)?\s*Score[:\s]*(\d{1,2}(?:\/\d{1,2})?)/i;
    const match = content.match(scoreRegex);
    return match ? match[1] : null;
  };

  const score = analysis ? extractScore(analysis.analysis.raw_response) : null;

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isProfileComplete(profile)) {
    return <ProfileGate />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Analysis
        </h1>
        <p className="text-gray-500">
          Upload your resume for AI-powered feedback and ATS optimization
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Vertical layout: full width */}
      <div className="space-y-8">
        {/* Upload Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Upload Your Resume
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />

              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {dragActive ? (
                    <Upload className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="text-gray-900 font-medium mb-2">
                  {file ? file.name : "Drag & Drop your resume here"}
                </div>

                <div className="text-gray-500">
                  or{" "}
                  <span className="text-emerald-600 font-semibold">
                    browse files
                  </span>
                </div>

                <div className="text-gray-500 text-sm mt-2">
                  PDF or DOCX (Max 5 MB)
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>
        </div>

        {/* Analysis Card */}
        {analysis && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Analysis Results
            </h2>

            {/* Score Highlight */}
            {score && (
              <div className="mb-6 bg-gradient-to-r from-emerald-50 to-violet-50 border border-emerald-200 rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm mb-2">Overall Score</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">
                  {score}
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6 max-h-[70vh] overflow-y-auto">
              <MarkdownRenderer
                content={analysis.analysis.raw_response}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}