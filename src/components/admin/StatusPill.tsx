import type { ProjectWithProgress } from "@/lib/types";

export function projectStatusLabel(project: ProjectWithProgress): {
  label: string;
  className: string;
} {
  if (project.status === "selesai" || project.progressPercent === 100) {
    return { label: "Lengkap", className: "bg-emerald-100 text-emerald-700" };
  }
  if (project.progressPercent === 0) {
    return { label: "Belum Upload", className: "bg-slate-100 text-slate-500" };
  }
  return { label: "Belum Lengkap", className: "bg-amber-100 text-amber-700" };
}

export function StatusPill({ project }: { project: ProjectWithProgress }) {
  const { label, className } = projectStatusLabel(project);
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
