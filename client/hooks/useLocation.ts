"use client";

import { useEffect, useRef } from "react";
import type { PingRequest } from "@/types";

const PING_INTERVAL_MS = 60_000; // 60 seconds

/**
 * Requests geolocation permission and sets up a 60-second ping interval.
 *
 * The actual POST /api/ping call is left as a stub — see the TODO below.
 */
export function useLocation(courtId: string | null, sessionId: string): void {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("[useLocation] Geolocation not supported by this browser.");
      return;
    }

    function sendPing(latitude: number, longitude: number): void {
      if (!courtId || !sessionId) return;

      // TODO (engineer): Implement the ping POST call.
      //
      // Expected payload shape:
      // const payload: PingRequest = {
      //   court_id: courtId,
      //   session_id: sessionId,
      //   latitude,
      //   longitude,
      //   privacy_mode: "PUBLIC",   // read from useHeatStore or user settings
      // };
      //
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ping`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // Suppress unused-variable warnings until implemented
      void (latitude, longitude);
      const _payload: Partial<PingRequest> = { court_id: courtId, session_id: sessionId };
      void _payload;
    }

    // Initial position request
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendPing(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error("[useLocation] Permission denied or error:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );

    // Recurring ping every 60 seconds
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendPing(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("[useLocation] Ping position error:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10_000 }
      );
    }, PING_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [courtId, sessionId]);
}
