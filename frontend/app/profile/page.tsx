"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getUserId } from "../lib/user";
import { StudentProfile } from "../types";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    career_goal: "",
    target_role: "",
    skillsText: "",
    interestsText: "",
    experience_level: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [userId, setUserId] = useState("");

  useEffect(() => {
  const id = getUserId();
  setUserId(id);

  async function loadProfile(userId: string) {
    const data = await api.getProfile(userId);

    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        college: data.college || "",
        degree: data.degree || "",
        branch: data.branch || "",
        year: data.year || "",
        career_goal: data.career_goal || "",
        target_role: data.target_role || "",
        skillsText: (data.current_skills || []).join(", "),
        interestsText: (data.interests || []).join(", "),
        experience_level: data.experience_level || "",
      });
    }

    setLoading(false);
  }

  loadProfile(id);
}, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      const current_skills = formData.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const interests = formData.interestsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Only send the fields the backend expects!
      const { skillsText, interestsText, ...profileToSave } = formData;
      await api.saveProfile(userId, {
        ...profileToSave,
        current_skills,
        interests,
      });
      setMessage({ text: "Profile saved successfully!", type: "success" });
    } catch (error) {
      console.error("Save profile error:", error);
      setMessage({ text: "Failed to save profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-500">Tell us about yourself to get personalized recommendations</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
              placeholder="Enter your college"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
              placeholder="e.g., B.Tech"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
              placeholder="e.g., Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
              placeholder="e.g., 3rd Year"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Career Goal</label>
          <input
            type="text"
            name="career_goal"
            value={formData.career_goal}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
            placeholder="What's your dream career?"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
          <input
            type="text"
            name="target_role"
            value={formData.target_role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Skills (comma separated, e.g. JavaScript, Python, React)
          </label>
          <textarea
            name="skillsText"
            value={formData.skillsText}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
            placeholder="JavaScript, Python, React"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests (comma separated, e.g. Web Development, Machine Learning)
          </label>
          <textarea
            name="interestsText"
            value={formData.interestsText}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
            placeholder="Web Development, Machine Learning"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
          >
            <option value="">Select experience level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
