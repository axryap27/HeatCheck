from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class HeatLevel(str, Enum):
    COLD = "COLD"
    WARM = "WARM"
    HOT = "HOT"
    ON_FIRE = "ON_FIRE"


class PrivacyMode(str, Enum):
    PUBLIC = "PUBLIC"
    FRIENDS = "FRIENDS"
    INCOGNITO = "INCOGNITO"


# ---------------------------------------------------------------------------
# Court schemas
# ---------------------------------------------------------------------------


class CourtResponse(BaseModel):
    id: UUID
    name: str
    latitude: float
    longitude: float
    borough: str | None
    surface: str | None
    heat_level: HeatLevel
    active_players: int
    created_at: datetime

    model_config = {"from_attributes": True}


class CourtListResponse(BaseModel):
    courts: list[CourtResponse]
    total: int


# ---------------------------------------------------------------------------
# Ping schemas
# ---------------------------------------------------------------------------


class PingRequest(BaseModel):
    court_id: UUID
    session_id: str = Field(..., description="Anonymous ephemeral session identifier")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    privacy_mode: PrivacyMode = PrivacyMode.PUBLIC


class PingResponse(BaseModel):
    success: bool
    court_id: UUID
    heat_level: HeatLevel
    active_players: int


# ---------------------------------------------------------------------------
# Chat schemas
# ---------------------------------------------------------------------------


class ChatMessage(BaseModel):
    id: str
    court_id: UUID
    session_id: str
    display_name: str
    content: str
    timestamp: datetime


class ChatHistoryResponse(BaseModel):
    court_id: UUID
    messages: list[ChatMessage]


# ---------------------------------------------------------------------------
# Crew / hoop schemas
# ---------------------------------------------------------------------------


class HoopPingRequest(BaseModel):
    session_id: str
    court_id: UUID
    message: str | None = Field(None, max_length=140)


class FriendCodeResponse(BaseModel):
    friend_code: str
    session_id: str
    expires_at: datetime
