"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCourts } from "@/lib/api";
import { CourtMarker } from "./CourtMarker";

export function HeatMap() {
  const { data, isLoading } = useCourts();

  return (
    <Map
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}
      initialViewState={{
        longitude: -73.9857,
        latitude: 40.7484,
        zoom: 12,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      {!isLoading &&
        data?.courts.map((court) => (
          <CourtMarker key={court.id} court={court} />
        ))}
    </Map>
  );
}
