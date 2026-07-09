from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from app.services.profile_service import profile_service
from app.models.student_profile import StudentProfile

router = APIRouter(prefix="/api/profile", tags=["profile"])


class ProfileCreateUpdate(BaseModel):
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


@router.get("/{user_id}")
async def get_profile(user_id: str):
    profile = await profile_service.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.post("/{user_id}")
async def create_or_update_profile(user_id: str, profile_data: ProfileCreateUpdate):
    profile = await profile_service.create_or_update_profile(user_id, profile_data.model_dump())
    return profile
