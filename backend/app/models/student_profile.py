from beanie import Document
from pydantic import Field
from typing import Optional, List
from datetime import datetime

class StudentProfile(Document):
    user_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    career_goal: Optional[str] = None
    target_role: Optional[str] = None
    current_skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    experience_level: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "student_profiles"
