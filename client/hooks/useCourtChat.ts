"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import type { ChatMessage, HeatUpdateEvent, NewMessageEvent } from "@/types";

/**
 * Subscribes to Socket.io events for a specific court room.
 *
 * TODO (engineer): Implement socket subscription logic.
 *
 * This hook should:
 * - On mount: call getSocket().emit("join_court", { court_id: courtId })
 * - Listen to "heat_update" events → call useHeatStore().updateCourtHeat()
 * - Listen to "new_message" events → append to the React Query cache for
 *   queryKey ["chat", courtId] so MessageList re-renders without a refetch
 * - On unmount: call getSocket().emit("leave_court", { court_id: courtId })
 *   and remove all event listeners
 */
export function useCourtChat(courtId: string | null): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!courtId) return;

    const socket = getSocket();

    // TODO (engineer): emit join_court and connect socket if not connected

    function onHeatUpdate(_data: HeatUpdateEvent): void {
      // TODO (engineer): call useHeatStore.getState().updateCourtHeat(...)
    }

    function onNewMessage(data: NewMessageEvent): void {
      // Append message to the React Query cache optimistically
      queryClient.setQueryData<{ court_id: string; messages: ChatMessage[] }>(
        ["chat", courtId],
        (old) => {
          if (!old) return old;
          return { ...old, messages: [...old.messages, data] };
        }
      );
    }

    socket.on("heat_update", onHeatUpdate);
    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("heat_update", onHeatUpdate);
      socket.off("new_message", onNewMessage);
      // TODO (engineer): emit leave_court on cleanup
    };
  }, [courtId, queryClient]);
}
