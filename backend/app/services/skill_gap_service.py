from typing import Dict, Any, Optional
from app.config import settings
from app.models.skill_gap import SkillGapReport
from app.services.langflow_client import langflow_client
from app.services.prompt_builder import prompt_builder
from app.services.profile_service import profile_service
from app.agents.skill_gap_agent import skill_gap_agent


class SkillGapService:
    @staticmethod
    async def analyze_skill_gap(user_id: str) -> Dict[str, Any]:
        student_profile = await profile_service.get_profile(user_id)
        if not student_profile:
            raise ValueError("Student profile not found")

        prompt = prompt_builder.build_prompt(
            system_prompt=skill_gap_agent.get_system_prompt(),
            user_message="Analyze my skill gap and provide: 1. Missing skills 2. Priority skills 3. Learning order 4. Recommendations",
            student_profile=student_profile
        )

        analysis_response = await langflow_client.generate_text(
            prompt, max_tokens=settings.IBM_MAX_TOKENS_ANALYSIS
        )

        report = SkillGapReport(
            user_id=user_id,
            report={"raw_response": analysis_response}
        )
        await report.create()

        return report.model_dump()

    @staticmethod
    async def get_report(user_id: str) -> Optional[Dict[str, Any]]:
        report = await SkillGapReport.find(
            SkillGapReport.user_id == user_id
        ).sort(-SkillGapReport.created_at).first_or_none()
        if report:
            return report.model_dump()
        return None


skill_gap_service = SkillGapService()
