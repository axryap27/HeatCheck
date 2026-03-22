from redis.asyncio import Redis

from models.schemas import HeatLevel


async def compute_heat_level(court_id: str, redis: Redis) -> HeatLevel:
    """
    TODO (engineer): Implement heat computation logic.

    This function should:
    - Query Redis for all active pings within the last 15 minutes near this court
      (use the sorted set key pattern: "pings:{court_id}" with UNIX timestamp scores)
    - Count unique sessionIds in the window (ZRANGEBYSCORE with min=now-900, max=now)
    - Return HeatLevel based on thresholds:
        COLD    = 0 unique sessions
        WARM    = 1-3 unique sessions
        HOT     = 4-7 unique sessions
        ON_FIRE = 8+ unique sessions

    Inputs:
        court_id (str): UUID string of the court
        redis (Redis): async Redis client from redis_client.get_redis()

    Returns:
        HeatLevel enum value
    """
    raise NotImplementedError("Heat computation not yet implemented")


async def get_active_player_count(court_id: str, redis: Redis) -> int:
    """
    TODO (engineer): Implement active player count lookup.

    This function should:
    - Read from the same Redis sorted set used by compute_heat_level
    - Return the count of unique sessions active in the last 15 minutes

    Inputs:
        court_id (str): UUID string of the court
        redis (Redis): async Redis client

    Returns:
        int — number of active players
    """
    raise NotImplementedError("Active player count not yet implemented")
