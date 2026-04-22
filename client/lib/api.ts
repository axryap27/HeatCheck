import { useQuery } from "@tanstack/react-query";
import type {
  ChatHistoryResponse,
  CourtListResponse,
  CourtResponse,
} from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

export function useCourts() {
  return useQuery<CourtListResponse>({
    queryKey: ["courts"],
    queryFn: () => fetchJson<CourtListResponse>("/api/courts"),
    refetchInterval: 30_000, // re-fetch every 30 s for heat level updates
  });
}

export function useCourt(id: string) {
  return useQuery<CourtResponse>({
    queryKey: ["courts", id],
    queryFn: () => fetchJson<CourtResponse>(`/api/courts/${id}`),
    enabled: Boolean(id),
  });
}

export function useChatHistory(courtId: string) {
  return useQuery<ChatHistoryResponse>({
    queryKey: ["chat", courtId],
    queryFn: () =>
      fetchJson<ChatHistoryResponse>(`/api/courts/${courtId}/chat`),
    enabled: Boolean(courtId),
  });
}
