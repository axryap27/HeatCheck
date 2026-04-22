"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CrewMember {
  sessionId: string;
  displayName: string;
  friendCode: string;
  /** TODO (engineer): populate from Socket.io presence events */
  isOnline: boolean;
  /** TODO (engineer): populate from proximity service */
  nearestCourtName?: string;
}

interface CrewListProps {
  /** TODO (engineer): pass crew members from Zustand store */
  members?: CrewMember[];
}

/**
 * Displays the user's friend list with online status and current court.
 *
 * TODO (engineer): Connect online status and nearestCourtName.
 * - Subscribe to a "presence" Socket.io event to track who is online
 * - nearestCourtName should come from the last ping stored in Redis
 */
export function CrewList({ members = [] }: CrewListProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No crew yet. Share your friend code to add people.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <ul className="divide-y divide-border">
        {members.map((member, idx) => (
          <li key={member.sessionId}>
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs font-semibold">
                  {member.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{member.displayName}</span>
                {member.nearestCourtName && (
                  <span className="text-xs text-muted-foreground">
                    @ {member.nearestCourtName}
                  </span>
                )}
              </div>

              {/* TODO (engineer): derive status from Socket.io presence */}
              <Badge
                variant={member.isOnline ? "default" : "secondary"}
                className="text-xs"
              >
                {member.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            {idx < members.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </div>
  );
}
