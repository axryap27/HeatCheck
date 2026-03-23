from uuid import UUID

from fastapi import APIRouter, HTTPException

from db import get_pool
from models.schemas import CourtListResponse, CourtResponse, HeatLevel

router = APIRouter(prefix="/api/courts", tags=["courts"])


@router.get("", response_model=CourtListResponse)
async def list_courts() -> CourtListResponse:
    """Return all courts with their current heat level and active player count."""
    pool = get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                id, name,
                ST_Y(location::geometry) AS latitude,
                ST_X(location::geometry) AS longitude,
                borough, surface, created_at
            FROM courts
            ORDER BY name ASC
            """
        )

    courts = [
        CourtResponse(
            id=row["id"],
            name=row["name"],
            latitude=row["latitude"],
            longitude=row["longitude"],
            borough=row["borough"],
            surface=row["surface"],
            # heat_level and active_players are populated by heat service —
            # defaulting to COLD/0 until heat.py is implemented
            heat_level=HeatLevel.COLD,
            active_players=0,
            created_at=row["created_at"],
        )
        for row in rows
    ]

    return CourtListResponse(courts=courts, total=len(courts))


@router.get("/{court_id}", response_model=CourtResponse)
async def get_court(court_id: UUID) -> CourtResponse:
    """Return a single court by ID."""
    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT
                id, name,
                ST_Y(location::geometry) AS latitude,
                ST_X(location::geometry) AS longitude,
                borough, surface, created_at
            FROM courts
            WHERE id = $1
            """,
            court_id,
        )

    if row is None:
        raise HTTPException(status_code=404, detail="Court not found")

    return CourtResponse(
        id=row["id"],
        name=row["name"],
        latitude=row["latitude"],
        longitude=row["longitude"],
        borough=row["borough"],
        surface=row["surface"],
        heat_level=HeatLevel.COLD,
        active_players=0,
        created_at=row["created_at"],
    )
