import type { ProjectWithStats } from "./types";

export type ProjectFilterParams = {
  q?: string;
  teknisi?: string;
  status?: string;
};

export function filterProjects(
  projects: ProjectWithStats[],
  { q, teknisi, status }: ProjectFilterParams
): ProjectWithStats[] {
  const query = (q ?? "").trim().toLowerCase();
  return projects.filter((p) => {
    if (teknisi && teknisi !== "semua" && p.technician_id !== teknisi) return false;
    if (status && status !== "semua" && p.status !== status) return false;
    if (query) {
      const haystack = `${p.kode_project} ${p.nama_project} ${p.technician.name} ${p.lokasi ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}
