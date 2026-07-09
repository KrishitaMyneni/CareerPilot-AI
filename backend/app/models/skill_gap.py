from beanie import Document
from pydantic import Field
from typing import Optional, Dict, Any
from datetime import datetime

class SkillGapReport(Document):
    user_id: str
    report: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "skill_gap_reports"
