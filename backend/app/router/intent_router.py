from fastapi import APIRouter
from pydantic import BaseModel
from app.services.intent_router import intent_router

router = APIRouter(prefix="/api/intent", tags=["intent"])


class IntentRequest(BaseModel):
    message: str


class IntentResponse(BaseModel):
    intent: str


@router.post("", response_model=IntentResponse)
async def detect_intent(request: IntentRequest):
    intent = intent_router.route(request.message)
    return IntentResponse(intent=intent.value)
