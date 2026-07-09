from beanie import Document
from pydantic import Field
from typing import Optional, Dict, Any
from datetime import datetime

class LearningRoadmap(Document):
    user_id: str
    roadmap: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "learning_roadmaps"
