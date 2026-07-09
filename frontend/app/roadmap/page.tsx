"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { getUserId, isProfileComplete } from "../lib/user";
import { StudentProfile, LearningRoadmap } from "../types";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { Map } from "lucide-react";
import ProfileGate from "@/app/components/ProfileGate";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const profileData = await api.getProfile(userId);
      setProfile(profileData);
      
      if (isProfileComplete(profileData)) {
        const data = await api.getRoadmap(userId);
        if (data) {
          setRoadmap(data);
        }
      }
      
      setProfileLoading(false);
      setLoading(false);
    }
    loadData();
  }, [userId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await api.generateRoadmap(userId);
      setRoadmap(data);
    } catch {
      alert("Failed to generate roadmap");
    } finally {
      setGenerating(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Roadmap</h1>
          <p className="text-gray-500">Your personalized path to success</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? "Generating..." : "Generate Roadmap"}
        </button>
      </div>

      {roadmap ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <MarkdownRenderer
              content={
                roadmap.roadmap.raw_response ??
                JSON.stringify(roadmap.roadmap, null, 2)
              }
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Map className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Roadmap Yet</h2>
          <p className="text-gray-500 mb-6">Generate your personalized learning roadmap to get started</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
      )}
    </div>
  );
}
