from typing import Optional, Dict, Any
from app.models.student_profile import StudentProfile
from datetime import datetime


class ProfileService:
    @staticmethod
    async def get_profile(user_id: str) -> Optional[Dict[str, Any]]:
        profile = await StudentProfile.find_one(StudentProfile.user_id == user_id)
        if profile:
            return profile.model_dump()
        return None

    @staticmethod
    async def create_or_update_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        existing_profile = await StudentProfile.find_one(StudentProfile.user_id == user_id)
        
        if existing_profile:
            existing_profile.name = profile_data.get("name", existing_profile.name)
            existing_profile.email = profile_data.get("email", existing_profile.email)
            existing_profile.college = profile_data.get("college", existing_profile.college)
            existing_profile.degree = profile_data.get("degree", existing_profile.degree)
            existing_profile.branch = profile_data.get("branch", existing_profile.branch)
            existing_profile.year = profile_data.get("year", existing_profile.year)
            existing_profile.career_goal = profile_data.get("career_goal", existing_profile.career_goal)
            existing_profile.target_role = profile_data.get("target_role", existing_profile.target_role)
            existing_profile.current_skills = profile_data.get("current_skills", existing_profile.current_skills)
            existing_profile.interests = profile_data.get("interests", existing_profile.interests)
            existing_profile.experience_level = profile_data.get("experience_level", existing_profile.experience_level)
            existing_profile.updated_at = datetime.utcnow()
            saved_profile = await existing_profile.save()
            return saved_profile.model_dump()
        else:
            profile = StudentProfile(user_id=user_id, **profile_data)
            created_profile = await profile.create()
            return created_profile.model_dump()


profile_service = ProfileService()
