import { CrewList } from "@/components/crew/CrewList";
import { HoopButton } from "@/components/crew/HoopButton";

export default function CrewPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Your Crew</h1>
      <div className="flex flex-col gap-6">
        <HoopButton />
        <CrewList />
      </div>
    </main>
  );
}
