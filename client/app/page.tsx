import { HeatMap } from "@/components/map/HeatMap";
import { CourtChat } from "@/components/chat/CourtChat";
import { HeatLegend } from "@/components/map/HeatLegend";

export default function MapPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Full-screen map */}
      <HeatMap />

      {/* Heat legend — bottom left */}
      <div className="absolute bottom-6 left-6 z-10">
        <HeatLegend />
      </div>

      {/* Court chat sheet — controlled by Zustand selectedCourtId */}
      <CourtChat />
    </main>
  );
}
