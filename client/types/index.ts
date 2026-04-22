// Mirrors the Pydantic schemas defined in server/models/schemas.py

export type HeatLevel = "COLD" | "WARM" | "HOT" | "ON_FIRE";

export type PrivacyMode = "PUBLIC" | "FRIENDS" | "INCOGNITO";

// ---------------------------------------------------------------------------
// Court
// ---------------------------------------------------------------------------

export interface CourtResponse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  borough: string | null;
  surface: string | null;
  heat_level: HeatLevel;
  active_players: number;
  created_at: string;
}

export interface CourtListResponse {
  courts: CourtResponse[];
  total: number;
}

// ---------------------------------------------------------------------------
// Ping
// ---------------------------------------------------------------------------

export interface PingRequest {
  court_id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  privacy_mode: PrivacyMode;
}

export interface PingResponse {
  success: boolean;
  court_id: string;
  heat_level: HeatLevel;
  active_players: number;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  court_id: string;
  session_id: string;
  display_name: string;
  content: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  court_id: string;
  messages: ChatMessage[];
}

// ---------------------------------------------------------------------------
// Crew / hoop
// ---------------------------------------------------------------------------

export interface HoopPingRequest {
  session_id: string;
  court_id: string;
  message?: string;
}

export interface FriendCodeResponse {
  friend_code: string;
  session_id: string;
  expires_at: string;
}

// ---------------------------------------------------------------------------
// Socket.io event payloads
// ---------------------------------------------------------------------------

export interface HeatUpdateEvent {
  court_id: string;
  heat_level: HeatLevel;
  active_players: number;
}

export interface NewMessageEvent extends ChatMessage {}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

export interface MarkerStyle {
  color: string;
  pulseSpeed: "none" | "slow" | "medium" | "fast";
}
