"use client";

import { Badge } from "@/components/ui/badge";

const LEVELS = [
  { label: "Cold", color: "#3B82F6", description: "No one here" },
  { label: "Warm", color: "#F97316", description: "1–3 players" },
  { label: "Hot", color: "#EF4444", description: "4–7 players" },
  { label: "On Fire", color: "#DC2626", description: "8+ players" },
] as const;

export function HeatLegend() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/70 p-3 backdrop-blur-md">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Heat Level
      </p>
      <ul className="flex flex-col gap-1.5">
        {LEVELS.map((level) => (
          <li key={level.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-sm font-medium text-foreground">
              {level.label}
            </span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {level.description}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
