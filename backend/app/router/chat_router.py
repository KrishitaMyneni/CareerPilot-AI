import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from app.config import settings
from app.services.intent_router import intent_router
from app.services.prompt_builder import prompt_builder
from app.services.ibm_client import ibm_client
from app.services.profile_service import profile_service
from app.services.conversation_service import conversation_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    intent: str


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    try:
        intent = intent_router.route(request.message)
        if intent == intent.GREETING:
         return ChatResponse(
        response=(
            "Hi! 👋 I'm CareerPilot AI. I can help you with career guidance, "
            "roadmaps, resumes, interview preparation, projects, and skill-gap analysis. "
            "What would you like help with today?"
        ),
        intent=intent.value,
    )
        agent = intent_router.get_agent(intent)
        system_prompt = agent.get_system_prompt()

        student_profile, conversation = await asyncio.gather(
            profile_service.get_profile(request.user_id),
            conversation_service.get_conversation(request.user_id, request.session_id),
        )

        conversation_history = conversation.get("messages", []) if conversation else []

        prompt = prompt_builder.build_prompt(
            system_prompt=system_prompt,
            user_message=request.message,
            student_profile=student_profile,
            conversation_history=conversation_history,
        )

        await conversation_service.add_message(
            request.user_id, request.session_id, "user", request.message
        )

        ai_response = await ibm_client.generate_text(
            prompt, max_tokens=settings.IBM_MAX_TOKENS_CHAT
        )

        if ai_response and ai_response.strip():
            background_tasks.add_task(
                conversation_service.add_message,
                request.user_id,
                request.session_id,
                "assistant",
                ai_response,
            )

        return ChatResponse(response=ai_response, intent=intent.value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
