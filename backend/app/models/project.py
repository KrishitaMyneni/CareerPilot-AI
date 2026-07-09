from beanie import Document
from pydantic import Field
from typing import List, Dict, Any
from datetime import datetime

class ProjectRecommendation(Document):
    user_id: str
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "project_recommendations"
