from enum import Enum
from app.agents.career_agent import career_agent
from app.agents.roadmap_agent import roadmap_agent
from app.agents.resume_agent import resume_agent
from app.agents.interview_agent import interview_agent
from app.agents.project_agent import project_agent
from app.agents.skill_gap_agent import skill_gap_agent


class Intent(str, Enum):
    GREETING = "greeting"
    CAREER = "career"
    ROADMAP = "roadmap"
    RESUME = "resume"
    INTERVIEW = "interview"
    PROJECT = "project"
    SKILL_GAP = "skill_gap"
    DEFAULT = "career"


class IntentRouter:
    def __init__(self):
        self.agent_map = {
            Intent.CAREER: career_agent,
            Intent.ROADMAP: roadmap_agent,
            Intent.RESUME: resume_agent,
            Intent.INTERVIEW: interview_agent,
            Intent.PROJECT: project_agent,
            Intent.SKILL_GAP: skill_gap_agent,
        }

        self.keyword_map = {
            Intent.RESUME: [
                "resume",
                "cv",
                "ats",
                "resume review",
                "review my resume",
                "improve resume",
            ],
            Intent.INTERVIEW: [
                "interview",
                "mock interview",
                "technical interview",
                "hr interview",
                "behavioral",
                "interview question",
            ],
            Intent.PROJECT: [
                "project idea",
                "project",
                "portfolio",
                "build",
                "create",
                "tech stack",
                "recommend project",
            ],
            Intent.SKILL_GAP: [
                "skill gap",
                "missing skills",
                "missing skill",
                "what skills",
                "need to learn",
                "priority skills",
            ],
            Intent.ROADMAP: [
                "roadmap",
                "learning plan",
                "study plan",
                "learning roadmap",
                "timeline",
                "curriculum",
            ],
            Intent.CAREER: [
                "career",
                "career advice",
                "career path",
                "job",
                "role",
                "salary",
                "industry",
                "future",
            ],
        }

    def route(self, user_message: str) -> Intent:
        message = user_message.lower().strip()

        greetings = {
            "hi",
            "hii",
            "hello",
            "hey",
            "heyy",
            "yo",
            "hola",
            "good morning",
            "good afternoon",
            "good evening",
        }

        if message in greetings:
            return Intent.GREETING

        for intent, keywords in self.keyword_map.items():
            if any(keyword in message for keyword in keywords):
                return intent

        return Intent.DEFAULT

    def get_agent(self, intent: Intent):
        return self.agent_map.get(intent, career_agent)


intent_router = IntentRouter()