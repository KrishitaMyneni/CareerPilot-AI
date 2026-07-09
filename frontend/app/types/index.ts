export interface StudentProfile {
  user_id: string;
  name?: string;
  email?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: string;
  career_goal?: string;
  target_role?: string;
  current_skills: string[];
  interests: string[];
  experience_level?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  user_id: string;
  session_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  intent: string;
}

export interface ResumeAnalysis {
  user_id: string;
  resume_text: string;
  analysis: Record<string, any>;
  created_at: string;
}

export interface SkillGapReport {
  user_id: string;
  report: Record<string, any>;
  created_at: string;
}

export interface LearningRoadmap {
  user_id: string;
  roadmap: Record<string, any>;
  created_at: string;
}

export interface ProjectRecommendation {
  user_id: string;
  projects: Record<string, any>[];
  created_at: string;
}
