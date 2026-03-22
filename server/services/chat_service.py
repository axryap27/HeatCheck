import json
import uuid
from datetime import datetime, timezone

from redis.asyncio import Redis

from models.schemas import ChatMessage


CHAT_HISTORY_KEY = "chat:{court_id}:messages"
CHAT_HISTORY_LIMIT = 50


async def get_chat_history(court_id: str, redis: Redis) -> list[ChatMessage]:
    """Return the last 50 messages for a court from Redis."""
    key = CHAT_HISTORY_KEY.format(court_id=court_id)
    raw_messages = await redis.lrange(key, -CHAT_HISTORY_LIMIT, -1)
    messages: list[ChatMessage] = []
    for raw in raw_messages:
        data = json.loads(raw)
        messages.append(ChatMessage(**data))
    return messages


async def publish_message(
    court_id: str,
    session_id: str,
    display_name: str,
    content: str,
    redis: Redis,
) -> ChatMessage:
    """
    Append a message to the Redis list and return the ChatMessage.

    TODO (engineer): Implement Redis TTL/expiry strategy.

    After RPUSH the message, you should:
    - Trim the list to CHAT_HISTORY_LIMIT with LTRIM to cap memory usage
    - Set a TTL on the key so idle chat rooms expire automatically
      (suggested: 24 hours after last activity — use EXPIRE after each push)
    - Publish the serialised message to the Pub/Sub channel
      "chat_channel:{court_id}" for Socket.io to broadcast to room subscribers

    Inputs:
        court_id (str): UUID string of the court
        session_id (str): sender's anonymous session ID
        display_name (str): sender's display name
        content (str): message text
        redis (Redis): async Redis client

    Returns:
        ChatMessage — the persisted message with generated id and timestamp
    """
    message = ChatMessage(
        id=str(uuid.uuid4()),
        court_id=court_id,  # type: ignore[arg-type]
        session_id=session_id,
        display_name=display_name,
        content=content,
        timestamp=datetime.now(tz=timezone.utc),
    )
    key = CHAT_HISTORY_KEY.format(court_id=court_id)
    await redis.rpush(key, json.dumps(message.model_dump(mode="json")))
    # TODO (engineer): Add LTRIM, EXPIRE, and Pub/Sub publish here
    return message
