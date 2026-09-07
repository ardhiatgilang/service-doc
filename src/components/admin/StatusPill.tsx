import type { ProjectWithStats } from "@/lib/types";
import { projectStatusLabel } from "@/lib/project-status";

export function StatusPill({ project }: { project: ProjectWithStats }) {
  const { label, className } = projectStatusLabel(project);
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
