import { StudentProfile } from "../types";

const USER_ID_KEY = "careerpilot_user_id";
const SESSION_ID_KEY = "careerpilot_session_id";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getUserId(): string {
  if (!isBrowser()) {
    return "server";
  }

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

export function getSessionId(): string {
  if (!isBrowser()) {
    return "server";
  }

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

export function isProfileComplete(profile: StudentProfile | null): boolean {
  if (!profile) return false;

  return (
    !!profile.name &&
    !!profile.college &&
    !!profile.degree &&
    !!profile.branch &&
    !!profile.year &&
    !!profile.target_role &&
    !!profile.career_goal &&
    !!profile.experience_level &&
    (profile.current_skills?.length || 0) >= 1 &&
    (profile.interests?.length || 0) >= 1
  );
}