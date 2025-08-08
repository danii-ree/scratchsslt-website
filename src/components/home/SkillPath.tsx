import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Skill = {
  id: string | null;
  title: string;
  status: "locked" | "available" | "completed";
};

export function SkillPath({ skills = [] as Skill[] }) {
  if (skills.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => {
          const isLocked = skill.status === "locked";
          const isCompleted = skill.status === "completed";
          const node = (
            <div
              className={cn(
                "h-28 w-28 rounded-full shadow relative flex items-center justify-center",
                isLocked && "bg-gray-100 text-gray-400 border border-gray-200",
                !isLocked && !isCompleted && "bg-gradient-to-b from-osslt-light-purple/40 to-osslt-purple/20 border border-osslt-purple/30",
                isCompleted && "bg-gradient-to-b from-green-300/40 to-green-500/20 border border-green-500/30"
              )}
            >
              <span className={cn("text-center text-xs px-3", isLocked && "opacity-70")}>{skill.title}</span>
              {isCompleted && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full shadow">Done</span>
              )}
            </div>
          );

          return (
            <div key={`${skill.title}-${index}`} className="flex flex-col items-center">
              {skill.id && !isLocked ? (
                <Link to={`/practice/${skill.id}`}>{node}</Link>
              ) : (
                node
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">Tap a circle to start practicing</div>
    </div>
  );
}


