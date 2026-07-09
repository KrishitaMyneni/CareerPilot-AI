from beanie import Document
from pydantic import Field
from typing import Optional, Dict, Any
from datetime import datetime

class ResumeAnalysis(Document):
    user_id: str
    resume_text: str
    analysis: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resume_analyses"
