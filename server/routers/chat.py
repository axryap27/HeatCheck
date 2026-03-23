from uuid import UUID

from fastapi import APIRouter, HTTPException

from models.schemas import ChatHistoryResponse
from redis_client import get_redis
from services.chat_service import get_chat_history

router = APIRouter(prefix="/api/courts", tags=["chat"])


@router.get("/{court_id}/chat", response_model=ChatHistoryResponse)
async def get_court_chat(court_id: UUID) -> ChatHistoryResponse:
    """
    Fetch the last 50 chat messages for a court from Redis.

    This read path is fully implemented. The write path (publishing new
    messages and managing TTL/Pub/Sub) is stubbed in services/chat_service.py.
    """
    redis = get_redis()
    try:
        messages = await get_chat_history(str(court_id), redis)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to fetch chat history") from exc

    return ChatHistoryResponse(court_id=court_id, messages=messages)
