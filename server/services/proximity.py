from asyncpg import Pool

from models.schemas import CourtResponse


async def find_courts_near(
    latitude: float,
    longitude: float,
    radius_meters: float,
    pool: Pool,
) -> list[CourtResponse]:
    """
    TODO (engineer): Implement PostGIS proximity query.

    This function should:
    - Use ST_DWithin on the courts table to find courts within radius_meters
      of the given (latitude, longitude) point
    - Convert results to CourtResponse objects (heat_level and active_players
      should be populated by calling heat.py services)
    - Use a geography cast for accurate meter-based distance:
        WHERE ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            $3
        )

    Inputs:
        latitude (float): user latitude
        longitude (float): user longitude
        radius_meters (float): search radius in meters (default: 5000)
        pool (Pool): asyncpg connection pool from db.get_pool()

    Returns:
        list[CourtResponse] sorted by distance ascending
    """
    raise NotImplementedError("PostGIS proximity query not yet implemented")


async def get_nearest_court(
    latitude: float,
    longitude: float,
    pool: Pool,
) -> CourtResponse | None:
    """
    TODO (engineer): Implement nearest-court lookup.

    This function should:
    - Return the single closest court to the given coordinates using
      ST_Distance with geography cast, ORDER BY distance ASC LIMIT 1
    - Return None if no courts exist

    Inputs:
        latitude (float): user latitude
        longitude (float): user longitude
        pool (Pool): asyncpg connection pool

    Returns:
        CourtResponse | None
    """
    raise NotImplementedError("Nearest court lookup not yet implemented")
