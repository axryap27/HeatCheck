from fastapi import APIRouter

from models.schemas import HeatLevel, PingRequest, PingResponse
from redis_client import get_redis
from services import heat, proximity

router = APIRouter(prefix="/api/ping", tags=["ping"])


@router.post("", response_model=PingResponse)
async def submit_ping(payload: PingRequest) -> PingResponse:
    """
    Record a user's location ping near a court.

    The endpoint parses and validates the request, then delegates all
    business logic to the heat and proximity services.

    TODO: Wire up the core ping processing logic below.

    This handler should:
    1. Call proximity.get_nearest_court() to validate the user is actually
       near the claimed court_id (or snap to nearest within ~200 m)
    2. Store the ping in Redis via a sorted set keyed by court_id with
       a UNIX timestamp score (for TTL-based expiry queries in heat.py)
       Key pattern: "pings:{court_id}", member: session_id, score: time.time()
    3. Call heat.compute_heat_level(court_id, redis) to get the new HeatLevel
    4. Call heat.get_active_player_count(court_id, redis) for active_players
    5. Emit a Socket.io event "heat_update" to the court room with the new heat level
    6. Apply privacy.filter_court_for_privacy() before storing any
       session→location mapping that could be read by other users

    Expected payload:
        {
          "court_id": "<uuid>",
          "session_id": "<ephemeral-string>",
          "latitude": <float>,
          "longitude": <float>,
          "privacy_mode": "PUBLIC" | "FRIENDS" | "INCOGNITO"
        }
    """
    redis = get_redis()

    # TODO (engineer): Implement steps 1–6 described above.
    # Placeholder response returned until implementation is complete.
    _ = redis  # silence unused warning until implemented

    return PingResponse(
        success=True,
        court_id=payload.court_id,
        heat_level=HeatLevel.COLD,
        active_players=0,
    )
