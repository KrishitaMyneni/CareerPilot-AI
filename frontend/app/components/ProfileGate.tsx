"use client";

import { useRouter } from "next/navigation";
import { Lock, Target, BarChart3, FileText, Lightbulb } from "lucide-react";

export default function ProfileGate() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-[600px] w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Complete Your Profile First
          </h2>
        </div>
        
        <p className="text-gray-500 mb-6">
          We need a few details about you before we can generate personalized career recommendations.
        </p>

        <p className="text-gray-600 mb-4 font-medium">
          Completing your profile helps CareerPilot provide:
        </p>
        
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <Target className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Personalized learning roadmaps</span>
          </li>
          <li className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Accurate skill gap analysis</span>
          </li>
          <li className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Better resume feedback</span>
          </li>
          <li className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">Relevant project recommendations</span>
          </li>
        </ul>

        <p className="text-gray-500 mb-6">
          Take just a minute to complete your profile and unlock all AI-powered features.
        </p>

        <button
          onClick={() => router.push("/profile")}
          className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200"
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
}
