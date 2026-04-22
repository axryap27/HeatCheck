"use client";

import { Marker } from "react-map-gl";
import type { CourtResponse, HeatLevel, MarkerStyle } from "@/types";

interface CourtMarkerProps {
  court: CourtResponse;
  onClick?: (court: CourtResponse) => void;
}

// TODO (engineer): Implement heat-to-visual mapping.
// Should return a color string and pulse animation intensity based on HeatLevel.
// COLD    → '#3B82F6' (blue, no pulse)
// WARM    → '#F97316' (orange, slow pulse)
// HOT     → '#EF4444' (red, medium pulse)
// ON_FIRE → '#EF4444' (red, fast pulse) + glow effect
const getMarkerStyle = (_heat: HeatLevel): MarkerStyle => {
  throw new Error("getMarkerStyle not yet implemented");
};

export function CourtMarker({ court, onClick }: CourtMarkerProps) {
  // TODO (engineer): call getMarkerStyle(court.heat_level) once implemented
  // and apply color + pulse animation to the marker element below.

  return (
    <Marker
      longitude={court.longitude}
      latitude={court.latitude}
      anchor="center"
      onClick={() => onClick?.(court)}
    >
      <button
        className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg transition-transform hover:scale-125"
        aria-label={`${court.name} — ${court.heat_level}`}
      />
    </Marker>
  );
}
