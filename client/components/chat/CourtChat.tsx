"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatHistory, useCourt } from "@/lib/api";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCourtChat } from "@/hooks/useCourtChat";

/**
 * CourtChat renders a slide-in Sheet when a court is selected.
 *
 * TODO (engineer): Connect to Zustand store.
 * - Read `selectedCourtId` and `sessionId` from useHeatStore()
 * - Pass `sessionId` to MessageList and MessageInput
 * - Wire MessageInput's onSend to getSocket().emit("send_chat", {...})
 */
export function CourtChat() {
  // TODO (engineer): replace these with useHeatStore() values
  const selectedCourtId: string | null = null;
  const sessionId = "";

  const { data: court } = useCourt(selectedCourtId ?? "");
  const { data: history, isLoading } = useChatHistory(selectedCourtId ?? "");

  // Subscribe to live socket events for this court
  useCourtChat(selectedCourtId);

  function handleSend(_content: string) {
    // TODO (engineer): emit send_chat socket event
    // getSocket().emit("send_chat", {
    //   court_id: selectedCourtId!,
    //   session_id: sessionId,
    //   display_name: useHeatStore.getState().displayName,
    //   content,
    // });
  }

  return (
    <Sheet open={Boolean(selectedCourtId)}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{court?.name ?? "Court Chat"}</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 flex-col gap-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-3/4" />
            ))}
          </div>
        ) : (
          <MessageList
            messages={history?.messages ?? []}
            currentSessionId={sessionId}
          />
        )}

        <MessageInput onSend={handleSend} disabled={!selectedCourtId} />
      </SheetContent>
    </Sheet>
  );
}
