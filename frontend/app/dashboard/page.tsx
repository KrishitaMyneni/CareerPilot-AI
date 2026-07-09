"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { getUserId, isProfileComplete } from "../lib/user";
import { StudentProfile, SkillGapReport, ResumeAnalysis } from "../types";
import {
  User,
  BarChart3,
  FileText,
  Map,
  Lightbulb,
  MessageSquare,
  Lock
} from "lucide-react";


export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapReport | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userId = getUserId();

  useEffect(() => {
    async function loadData() {
      const [profileData, skillGapData, resumeData] = await Promise.all([
        api.getProfile(userId),
        api.getSkillGapReport(userId),
        api.getResumeAnalysis(userId),
      ]);
      setProfile(profileData);
      setSkillGap(skillGapData);
      setResumeAnalysis(resumeData);
      setLoading(false);
    }
    loadData();
  }, [userId]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const complete = isProfileComplete(profile);
  
  const dashboardCards = [
    {
      title: "Your Profile",
      description: profile?.name || "Complete your profile to get personalized recommendations",
      icon: User,
      href: "/profile",
      action: "Edit Profile",
      gated: false,
    },
    {
     title: "Skill Gap",
     description: skillGap
       ? "View your latest skill gap analysis"
       : "Analyze your current skills",
     icon: BarChart3,
     href: "/skill-gap",
     action: skillGap ? "View Report" : "Analyze Now",
     gated: true,
    },
    {
      title: "Resume Analysis",
      description: resumeAnalysis ? "View your latest resume analysis" : "Upload your resume for analysis",
      icon: FileText,
      href: "/resume",
      action: resumeAnalysis ? "View Analysis" : "Upload Resume",
      gated: true,
    },
    {
      title: "Learning Roadmap",
      description: "Get your personalized learning path",
      icon: Map,
      href: "/roadmap",
      action: "View Roadmap",
      gated: true,
    },
    {
      title: "Project Ideas",
      description: "Get project recommendations for your portfolio",
      icon: Lightbulb,
      href: "/projects",
      action: "Get Ideas",
      gated: true,
    },
    {
      title: "Career Chat",
      description: "Get instant career guidance from AI",
      icon: MessageSquare,
      href: "/chat",
      action: "Start Chat",
      gated: false,
    },
  ];

  const handleCardClick = (e: React.MouseEvent, card: typeof dashboardCards[0]) => {
    if (card.gated && !complete) {
      e.preventDefault();
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your career journey</p>
      </div>


      {profile && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Hello, {profile.name || "Student"}!</h2>
          <p className="text-emerald-50/90 mb-4">
            {profile.target_role ? `Working towards becoming a ${profile.target_role}` : "Set your target role in your profile"}
          </p>
          {profile.current_skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.current_skills.slice(0, 8).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardCards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            onClick={(e) => handleCardClick(e, card)}
            className={`bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 group ${
              card.gated && !complete 
                ? "opacity-75" 
                : "hover:border-emerald-200 hover:shadow-md hover:-translate-y-1"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors ${
                card.gated && !complete ? "bg-gray-100" : "bg-emerald-50"
              }`}>
                <card.icon className={`w-6 h-6 ${
                  card.gated && !complete ? "text-gray-400" : "text-emerald-600"
                }`} />
              </div>
              {card.gated && !complete && (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              card.gated && !complete ? "text-gray-500" : "text-gray-900"
            }`}>{card.title}</h3>
            <p className="text-gray-500 mb-4 text-sm">{card.description}</p>
            <div className={`flex items-center gap-1 font-medium ${
              card.gated && !complete ? "text-gray-400" : "text-emerald-600 group-hover:text-emerald-700"
            }`}>
              <span>{card.action}</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
