#!/usr/bin/env python3
"""
Seed script — inserts 15 real NYC basketball courts into the database.

Usage:
    python scripts/seed.py

Requires DATABASE_URL to be set in the environment or a .env file at the
project root.
"""
import asyncio
import os
import sys
from pathlib import Path

# Allow running from the project root without installing the server package
sys.path.insert(0, str(Path(__file__).parent.parent / "server"))

import asyncpg
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://heatcheck:heatcheck@localhost:5432/heatcheck",
)

COURTS = [
    {
        "name": "Rucker Park",
        "longitude": -73.93393,
        "latitude": 40.83096,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "West 4th Street Courts",
        "longitude": -74.00027,
        "latitude": 40.73066,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "Central Park (The Cage at 66th)",
        "longitude": -73.97800,
        "latitude": 40.77180,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "Tompkins Square Park",
        "longitude": -73.98150,
        "latitude": 40.72620,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "Fort Greene Park",
        "longitude": -73.97380,
        "latitude": 40.69120,
        "borough": "Brooklyn",
        "surface": "asphalt",
    },
    {
        "name": "McCarren Park",
        "longitude": -73.95120,
        "latitude": 40.72080,
        "borough": "Brooklyn",
        "surface": "asphalt",
    },
    {
        "name": "Prospect Park",
        "longitude": -73.96910,
        "latitude": 40.66060,
        "borough": "Brooklyn",
        "surface": "asphalt",
    },
    {
        "name": "Riverside Park (83rd St)",
        "longitude": -73.98980,
        "latitude": 40.78660,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "Holcombe Rucker Playground",
        "longitude": -73.93410,
        "latitude": 40.83230,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "Goat Park (Dyckman)",
        "longitude": -73.92640,
        "latitude": 40.86570,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "East River Park",
        "longitude": -73.97520,
        "latitude": 40.71440,
        "borough": "Manhattan",
        "surface": "asphalt",
    },
    {
        "name": "Gauchos Gym (exterior)",
        "longitude": -73.90520,
        "latitude": 40.83670,
        "borough": "Bronx",
        "surface": "asphalt",
    },
    {
        "name": "St. John's Recreation Center",
        "longitude": -73.95670,
        "latitude": 40.67580,
        "borough": "Brooklyn",
        "surface": "wood",
    },
    {
        "name": "Brownsville Recreation Center",
        "longitude": -73.91230,
        "latitude": 40.65880,
        "borough": "Brooklyn",
        "surface": "wood",
    },
    {
        "name": "Roy Wilkins Recreation Center",
        "longitude": -73.79120,
        "latitude": 40.68940,
        "borough": "Queens",
        "surface": "wood",
    },
]


async def seed() -> None:
    print(f"Connecting to {DATABASE_URL} ...")
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        inserted = 0
        skipped = 0

        for court in COURTS:
            existing = await conn.fetchval(
                "SELECT id FROM courts WHERE name = $1", court["name"]
            )
            if existing:
                print(f"  [skip] {court['name']} already exists")
                skipped += 1
                continue

            await conn.execute(
                """
                INSERT INTO courts (name, location, borough, surface)
                VALUES (
                    $1,
                    ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography,
                    $4,
                    $5
                )
                """,
                court["name"],
                court["longitude"],
                court["latitude"],
                court["borough"],
                court["surface"],
            )
            print(f"  [ok]   {court['name']}")
            inserted += 1

        print(f"\nDone. Inserted {inserted}, skipped {skipped} courts.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed())
