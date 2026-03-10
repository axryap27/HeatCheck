import redis.asyncio as aioredis
from redis.asyncio import Redis

from config import settings

_redis: Redis | None = None


async def create_redis() -> Redis:
    """Create and return the async Redis client."""
    global _redis
    _redis = aioredis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )
    return _redis


async def close_redis() -> None:
    """Close the Redis connection."""
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None


def get_redis() -> Redis:
    """Return the active Redis client. Raises if client is not initialised."""
    if _redis is None:
        raise RuntimeError("Redis client is not initialised. Call create_redis() first.")
    return _redis
