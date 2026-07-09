from typing import Optional, List, Dict, Any
from app.models.conversation import Conversation
from datetime import datetime


class ConversationService:
    @staticmethod
    async def get_conversation(user_id: str, session_id: str) -> Optional[Dict[str, Any]]:
        conversation = await Conversation.find_one(
            Conversation.user_id == user_id,
            Conversation.session_id == session_id
        )
        if conversation:
            return conversation.model_dump()
        return None

    @staticmethod
    async def add_message(
        user_id: str,
        session_id: str,
        role: str,
        content: str
    ) -> Conversation:
        conversation = await Conversation.find_one(
            Conversation.user_id == user_id,
            Conversation.session_id == session_id
        )
        
        if not conversation:
            conversation = Conversation(
                user_id=user_id,
                session_id=session_id,
                messages=[]
            )
        
        conversation.messages.append({
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        })
        conversation.updated_at = datetime.utcnow()
        
        return await conversation.save()


conversation_service = ConversationService()
