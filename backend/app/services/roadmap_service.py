from typing import Dict, Any, Optional
from app.config import settings
from app.models.roadmap import LearningRoadmap
from app.services.ibm_client import ibm_client
from app.services.prompt_builder import prompt_builder
from app.services.profile_service import profile_service
from app.agents.roadmap_agent import roadmap_agent


class RoadmapService:
    @staticmethod
    async def generate_roadmap(user_id: str) -> Dict[str, Any]:
        student_profile = await profile_service.get_profile(user_id)
        if not student_profile:
            raise ValueError("Student profile not found")

        prompt = prompt_builder.build_prompt(
            system_prompt=roadmap_agent.get_system_prompt(),
            user_message="Generate a personalized learning roadmap with: 1. Beginner phase 2. Intermediate phase 3. Advanced phase 4. Timeline 5. Milestones 6. Projects 7. Certifications 8. Learning resources",
            student_profile=student_profile
        )

        roadmap_response = await ibm_client.generate_text(
            prompt, max_tokens=settings.IBM_MAX_TOKENS_ANALYSIS
        )

        roadmap = LearningRoadmap(
            user_id=user_id,
            roadmap={"raw_response": roadmap_response}
        )
        await roadmap.create()

        return roadmap.model_dump()

    @staticmethod
    async def get_roadmap(user_id: str) -> Optional[Dict[str, Any]]:
        roadmap = await LearningRoadmap.find(
            LearningRoadmap.user_id == user_id
        ).sort(-LearningRoadmap.created_at).first_or_none()
        if roadmap:
            return roadmap.model_dump()
        return None


roadmap_service = RoadmapService()
