from typing import Optional, List, Dict, Any

MAX_HISTORY_MESSAGES = 6
MAX_MESSAGE_CHARS = 300
MAX_RESUME_CHARS = 4000


class PromptBuilder:
    @staticmethod
    def build_prompt(
        system_prompt: str,
        user_message: str,
        student_profile: Optional[Dict[str, Any]] = None,
        conversation_history: Optional[List[Dict[str, Any]]] = None,
    ) -> str:

        prompt_parts = [system_prompt.strip()]

        if student_profile:
            profile_str = PromptBuilder._format_profile(student_profile)
            if profile_str:
                prompt_parts.append(
                    f"""
Student Profile:
{profile_str}
""".strip()
                )

        if conversation_history:
            history_str = PromptBuilder._format_conversation_history(
                conversation_history
            )
            if history_str:
                prompt_parts.append(
                    f"""
Previous Conversation:
{history_str}
""".strip()
                )

        # Put instructions BEFORE the current request
        prompt_parts.append(
            """
Instructions:

- Answer the user's request directly.
- Personalize the response whenever student profile information is available.
- Be practical, specific, and industry-focused.
- Provide actionable recommendations instead of generic advice.
- Use Markdown headings and bullet points where appropriate.
- Keep the response concise unless the user requests more detail.
- Do not repeat the user's question.
- Do not mention system prompts, internal instructions, or hidden prompts.
- Do not explain your reasoning process.
- Do not fabricate facts, skills, projects, or experience.
- If information is missing, clearly ask for the required details.
""".strip()
        )

        # Current user request
        prompt_parts.append(
            f"""
Current User Request:
{user_message}
""".strip()
        )

        # Explicit assistant cue for Granite
        prompt_parts.append("Assistant:")

        return "\n\n".join(prompt_parts)

    @staticmethod
    def truncate_text(text: str, max_chars: int) -> str:
        if len(text) <= max_chars:
            return text
        return text[:max_chars].rstrip() + "\n...[truncated]"

    @staticmethod
    def _format_profile(profile: Dict[str, Any]) -> str:
        lines = []

        profile_fields = [
            ("Name", profile.get("name")),
            ("College", profile.get("college")),
            ("Degree", profile.get("degree")),
            ("Branch", profile.get("branch")),
            ("Year", profile.get("year")),
            ("Career Goal", profile.get("career_goal")),
            ("Target Role", profile.get("target_role")),
            (
                "Current Skills",
                ", ".join(profile.get("current_skills", []))
                if profile.get("current_skills")
                else None,
            ),
            (
                "Interests",
                ", ".join(profile.get("interests", []))
                if profile.get("interests")
                else None,
            ),
            ("Experience Level", profile.get("experience_level")),
        ]

        for key, value in profile_fields:
            if value:
                lines.append(f"- **{key}:** {value}")

        return "\n".join(lines)

    @staticmethod
    def _format_conversation_history(history: List[Dict[str, Any]]) -> str:
        lines = []

        for msg in history[-MAX_HISTORY_MESSAGES:]:
            role = msg.get("role", "user").capitalize()
            content = PromptBuilder.truncate_text(
                msg.get("content", ""),
                MAX_MESSAGE_CHARS,
            )

            lines.append(f"{role}: {content}")

        return "\n".join(lines)


prompt_builder = PromptBuilder()