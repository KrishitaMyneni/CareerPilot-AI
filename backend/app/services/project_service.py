from typing import Dict, Any, Optional
from app.config import settings
from app.models.project import ProjectRecommendation
from app.services.ibm_client import ibm_client
from app.services.prompt_builder import prompt_builder
from app.services.profile_service import profile_service
from app.agents.project_agent import project_agent


class ProjectService:
    @staticmethod
    async def recommend_projects(user_id: str) -> Dict[str, Any]:
        student_profile = await profile_service.get_profile(user_id)
        if not student_profile:
            raise ValueError("Student profile not found")

        prompt = prompt_builder.build_prompt(
            system_prompt=project_agent.get_system_prompt(),
            user_message="Recommend the 3 best portfolio projects tailored to the student's profile.For each include: 1. Title 2. Short Description 3. Difficulty 4. Tech Stack 5. Estimated Time 6. 3-5 Learning Outcomes 7. 2-3 Extension Ideas",
            student_profile=student_profile
        )

        projects_response = await ibm_client.generate_text(
            prompt, max_tokens=settings.IBM_MAX_TOKENS_ANALYSIS
        )

        recommendation = ProjectRecommendation(
            user_id=user_id,
            projects=[{"raw_response": projects_response}]
        )
        await recommendation.create()

        return recommendation.model_dump()

    @staticmethod
    async def get_recommendations(user_id: str) -> Optional[Dict[str, Any]]:
        recommendation = await ProjectRecommendation.find(
            ProjectRecommendation.user_id == user_id
        ).sort(-ProjectRecommendation.created_at).first_or_none()
        if recommendation:
            return recommendation.model_dump()
        return None


project_service = ProjectService()
