from beanie import Document
from pydantic import Field
from typing import List, Dict, Any
from datetime import datetime

class Conversation(Document):
    user_id: str
    session_id: str
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "conversations"
