"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * The big "Hoop?" call-to-action button.
 *
 * Sends a hoop ping to a court, signalling to friends that the user is
 * heading to play. The actual POST /api/hoop logic is a stub.
 */
export function HoopButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleHoop() {
    setIsLoading(true);
    try {
      // TODO (engineer): implement hoop ping
      // POST /api/hoop with { session_id, court_id, message }
      // On success: notify friends via Socket.io "hoop_ping" event
      await new Promise((resolve) => setTimeout(resolve, 800)); // placeholder delay
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      className="h-24 w-full rounded-2xl bg-orange-500 text-2xl font-bold hover:bg-orange-600 active:scale-95 disabled:opacity-60"
      onClick={handleHoop}
      disabled={isLoading || sent}
      aria-label="Send hoop ping to your crew"
    >
      {isLoading ? (
        <span className="animate-spin text-3xl">🏀</span>
      ) : sent ? (
        "Sent! 🔥"
      ) : (
        <>🏀 Hoop?</>
      )}
    </Button>
  );
}
