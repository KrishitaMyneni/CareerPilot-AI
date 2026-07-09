import asyncio
from typing import Dict, Any, Optional
from app.config import settings
from app.models.resume import ResumeAnalysis
from app.services.ibm_client import ibm_client
from app.services.prompt_builder import prompt_builder, MAX_RESUME_CHARS
from app.agents.resume_agent import resume_agent
from app.utils.helpers import extract_text_from_pdf, extract_text_from_docx


class ResumeService:
    @staticmethod
    async def analyze_resume(
        user_id: str,
        file_bytes: bytes,
        file_type: str
    ) -> Dict[str, Any]:
        if file_type == "pdf":
            resume_text = await asyncio.to_thread(extract_text_from_pdf, file_bytes)
        elif file_type == "docx":
            resume_text = await asyncio.to_thread(extract_text_from_docx, file_bytes)
        else:
            raise ValueError("Unsupported file type. Use PDF or DOCX.")

        resume_text = prompt_builder.truncate_text(resume_text, MAX_RESUME_CHARS)

        prompt = prompt_builder.build_prompt(
            system_prompt=resume_agent.get_system_prompt(),
            user_message=f"""Analyze this resume and provide:
1. Overall score (0-100)
2. ATS compatibility score
3. Strengths
4. Weaknesses
5. Suggested improvements
6. Missing skills

Resume text:
{resume_text}"""
        )

        analysis_response = await ibm_client.generate_text(
            prompt, max_tokens=settings.IBM_MAX_TOKENS_ANALYSIS
        )

        analysis = ResumeAnalysis(
            user_id=user_id,
            resume_text=resume_text,
            analysis={"raw_response": analysis_response}
        )
        await analysis.create()

        return analysis.model_dump()

    @staticmethod
    async def get_analysis(user_id: str) -> Optional[Dict[str, Any]]:
        analysis = await ResumeAnalysis.find(
            ResumeAnalysis.user_id == user_id
        ).sort(-ResumeAnalysis.created_at).first_or_none()
        if analysis:
            return analysis.model_dump()
        return None


resume_service = ResumeService()
