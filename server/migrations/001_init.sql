-- HeatCheck initial schema
-- Requires PostgreSQL + PostGIS extension

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------------------------
-- Courts table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    -- PostGIS geography point: SRID 4326 (WGS 84), stored as POINT(lng lat)
    location    GEOGRAPHY(POINT, 4326) NOT NULL,
    borough     TEXT,
    surface     TEXT CHECK (surface IN ('asphalt', 'concrete', 'wood', 'other')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for proximity queries
CREATE INDEX IF NOT EXISTS idx_courts_location
    ON courts USING GIST (location);

-- Name search index
CREATE INDEX IF NOT EXISTS idx_courts_name
    ON courts (name);
