import type { ProjectWithStats } from "./types";
import { MAX_PHOTOS_PER_PROJECT } from "./constants";

export function projectStatusLabel(project: ProjectWithStats): {
  label: string;
  className: string;
} {
  if (project.status === "selesai" || project.photoCount >= MAX_PHOTOS_PER_PROJECT) {
    return { label: "Lengkap", className: "bg-emerald-100 text-emerald-700" };
  }
  if (project.photoCount === 0) {
    return { label: "Belum Upload", className: "bg-slate-100 text-slate-500" };
  }
  return { label: "Belum Lengkap", className: "bg-amber-100 text-amber-700" };
}
