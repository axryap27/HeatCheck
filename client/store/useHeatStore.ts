import { create } from "zustand";
import type { CourtResponse, HeatLevel } from "@/types";

/**
 * TODO: Implement Zustand store shape and state update logic.
 *
 * This store should manage:
 * - courts: Record<string, CourtResponse> — live court data keyed by court ID
 * - selectedCourtId: string | null — currently selected court (opens chat)
 * - sessionId: string — anonymous ephemeral session identifier (persist to localStorage)
 * - displayName: string — user's chosen display name for chat
 * - userLocation: { latitude: number; longitude: number } | null — current GPS position
 *
 * Actions to implement:
 * - updateCourtHeat(courtId, heatLevel, activePlayers): update a single court's heat
 *   Called on Socket.io "heat_update" events so the map re-renders without a full refetch
 * - selectCourt(courtId): set selectedCourtId, trigger chat panel open
 * - setLocation(coords): store user's current position
 * - initSession(): generate or restore sessionId from localStorage
 *
 * Notes:
 * - Use immer middleware for ergonomic nested updates (optional but recommended)
 * - Persist sessionId and displayName to localStorage using zustand/middleware persist
 */

interface HeatStore {
  courts: Record<string, CourtResponse>;
  selectedCourtId: string | null;
  sessionId: string;
  displayName: string;
  userLocation: { latitude: number; longitude: number } | null;

  updateCourtHeat: (
    courtId: string,
    heatLevel: HeatLevel,
    activePlayers: number
  ) => void;
  selectCourt: (courtId: string | null) => void;
  setLocation: (coords: { latitude: number; longitude: number }) => void;
  setCourts: (courts: CourtResponse[]) => void;
}

export const useHeatStore = create<HeatStore>(() => ({
  courts: {},
  selectedCourtId: null,
  sessionId: "",
  displayName: "",
  userLocation: null,

  // TODO (engineer): implement all actions below
  updateCourtHeat: (_courtId, _heatLevel, _activePlayers) => {
    throw new Error("updateCourtHeat not yet implemented");
  },
  selectCourt: (_courtId) => {
    throw new Error("selectCourt not yet implemented");
  },
  setLocation: (_coords) => {
    throw new Error("setLocation not yet implemented");
  },
  setCourts: (_courts) => {
    throw new Error("setCourts not yet implemented");
  },
}));
