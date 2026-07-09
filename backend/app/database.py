import motor.motor_asyncio
from beanie import init_beanie
from app.config import settings
from app.models.student_profile import StudentProfile
from app.models.conversation import Conversation
from app.models.resume import ResumeAnalysis
from app.models.roadmap import LearningRoadmap
from app.models.project import ProjectRecommendation
from app.models.skill_gap import SkillGapReport


async def init_db():
    try:
        if not settings.MONGODB_URI or settings.MONGODB_URI.startswith("mongodb+srv://<username>"):
            print("Warning: MongoDB URI not configured. Database features will not be available.")
            return
        
        client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        db = client.careerpilot_ai
        
        await init_beanie(
            database=db,
            document_models=[
                StudentProfile,
                Conversation,
                ResumeAnalysis,
                LearningRoadmap,
                ProjectRecommendation,
                SkillGapReport,
            ],
        )
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Warning: Failed to initialize database: {e}")
        print("Database features will not be available.")
