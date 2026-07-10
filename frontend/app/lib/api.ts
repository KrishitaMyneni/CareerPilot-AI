import {
  StudentProfile,
  ChatRequest,
  ChatResponse,
  ResumeAnalysis,
  SkillGapReport,
  LearningRoadmap,
  ProjectRecommendation,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const AI_TIMEOUT_MS = 120_000;
const DEFAULT_TIMEOUT_MS = 30_000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. The AI is taking longer than expected — please try again.");
    }
    throw new Error("Unable to reach the server. Make sure the backend is running on port 8000.");
  } finally {
    clearTimeout(timeout);
  }
}

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const data = await res.json();
    throw new Error(data.detail || fallback);
  } catch (error) {
    if (error instanceof Error && error.message !== fallback) {
      throw error;
    }
    throw new Error(fallback);
  }
}

export const api = {
  async getProfile(userId: string): Promise<StudentProfile | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/profile/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async saveProfile(userId: string, profile: Partial<StudentProfile>) {
    const res = await fetchWithTimeout(`${API_BASE_URL}/profile/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) await parseError(res, "Failed to save profile");
    return await res.json();
  },

  async sendChat(request: ChatRequest): Promise<ChatResponse> {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      },
      AI_TIMEOUT_MS
    );
    if (!res.ok) await parseError(res, "Failed to send message");
    return await res.json();
  },

  async uploadResume(userId: string, file: File): Promise<ResumeAnalysis> {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", file);
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/resume/analyze`,
      { method: "POST", body: formData },
      AI_TIMEOUT_MS
    );
    if (!res.ok) await parseError(res, "Failed to upload resume");
    return await res.json();
  },

  async getResumeAnalysis(userId: string): Promise<ResumeAnalysis | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/resume/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async analyzeSkillGap(userId: string): Promise<SkillGapReport> {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/skill-gap/analyze/${userId}`,
      { method: "POST" },
      AI_TIMEOUT_MS
    );
    if (!res.ok) await parseError(res, "Failed to analyze skill gap");
    return await res.json();
  },

  async getSkillGapReport(userId: string): Promise<SkillGapReport | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/skill-gap/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async generateRoadmap(userId: string): Promise<LearningRoadmap> {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/roadmap/generate/${userId}`,
      { method: "POST" },
      AI_TIMEOUT_MS
    );
    if (!res.ok) await parseError(res, "Failed to generate roadmap");
    return await res.json();
  },

  async getRoadmap(userId: string): Promise<LearningRoadmap | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/roadmap/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async recommendProjects(userId: string): Promise<ProjectRecommendation> {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/projects/recommend/${userId}`,
      { method: "POST" },
      AI_TIMEOUT_MS
    );
    if (!res.ok) await parseError(res, "Failed to get project recommendations");
    return await res.json();
  },

  async getProjectRecommendations(userId: string): Promise<ProjectRecommendation | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/projects/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
