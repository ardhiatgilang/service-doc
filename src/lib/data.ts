import "server-only";
import { supabaseAdmin } from "./supabase";
import { MAX_PHOTOS_PER_PROJECT } from "./constants";
import type { Technician, Project, Photo, ProjectWithStats } from "./types";

export async function getTechnicianByNip(nip: string): Promise<Technician | null> {
  const { data, error } = await supabaseAdmin
    .from("technicians")
    .select("*")
    .eq("nip", nip)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTechnicianById(id: string): Promise<Technician | null> {
  const { data, error } = await supabaseAdmin
    .from("technicians")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllTechnicians(): Promise<Technician[]> {
  const { data, error } = await supabaseAdmin.from("technicians").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminByUsername(
  username: string
): Promise<{ id: string; username: string; password_hash: string } | null> {
  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function attachPhotoCounts(
  projects: Project[],
  technicians: Map<string, Technician>
): Promise<ProjectWithStats[]> {
  if (projects.length === 0) return [];
  const projectIds = projects.map((p) => p.id);

  const { data: photos, error } = await supabaseAdmin
    .from("photos")
    .select("project_id")
    .in("project_id", projectIds);
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const photo of photos ?? []) {
    counts.set(photo.project_id, (counts.get(photo.project_id) ?? 0) + 1);
  }

  return projects.map((project) => {
    const technician = technicians.get(project.technician_id);
    if (!technician) {
      throw new Error(`Teknisi untuk project ${project.kode_project} tidak ditemukan`);
    }
    return { ...project, technician, photoCount: counts.get(project.id) ?? 0 };
  });
}

export async function getProjectsForTechnician(
  technicianId: string
): Promise<ProjectWithStats[]> {
  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("technician_id", technicianId)
    .order("tanggal", { ascending: false });
  if (error) throw error;
  const technician = await getTechnicianById(technicianId);
  if (!technician) return [];
  const map = new Map([[technician.id, technician]]);
  return attachPhotoCounts(projects ?? [], map);
}

export async function getProjectWithStats(projectId: string): Promise<ProjectWithStats | null> {
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();
  if (error) throw error;
  if (!project) return null;
  const technician = await getTechnicianById(project.technician_id);
  if (!technician) return null;
  const map = new Map([[technician.id, technician]]);
  const [withStats] = await attachPhotoCounts([project], map);
  return withStats;
}

export async function getAllProjectsWithStats(): Promise<ProjectWithStats[]> {
  const [{ data: projects, error }, technicians] = await Promise.all([
    supabaseAdmin.from("projects").select("*").order("tanggal", { ascending: false }),
    getAllTechnicians(),
  ]);
  if (error) throw error;
  const map = new Map(technicians.map((t) => [t.id, t]));
  return attachPhotoCounts(projects ?? [], map);
}

export async function getPhotosForProject(projectId: string): Promise<Photo[]> {
  const { data, error } = await supabaseAdmin
    .from("photos")
    .select("*")
    .eq("project_id", projectId)
    .order("uploaded_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getRecentPhotos(limit = 30): Promise<Photo[]> {
  const { data, error } = await supabaseAdmin
    .from("photos")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function insertPhotos(
  rows: { project_id: string; file_path: string; uploaded_by: string }[]
): Promise<Photo[]> {
  const { data, error } = await supabaseAdmin.from("photos").insert(rows).select();
  if (error) throw error;
  return data ?? [];
}

export type DashboardStats = {
  totalProjects: number;
  activeProjects: number;
  doneProjects: number;
  totalTechnicians: number;
  activeTechnicians: number;
  photosToday: number;
  photosYesterday: number;
  incompleteProjects: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [projects, technicians] = await Promise.all([
    getAllProjectsWithStats(),
    getAllTechnicians(),
  ]);

  const activeProjects = projects.filter((p) => p.status === "aktif").length;
  const doneProjects = projects.filter((p) => p.status === "selesai").length;
  const incompleteProjects = projects.filter(
    (p) => p.photoCount < MAX_PHOTOS_PER_PROJECT
  ).length;
  const activeTechnicianIds = new Set(
    projects.filter((p) => p.status === "aktif").map((p) => p.technician_id)
  );

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const { data: allPhotos, error } = await supabaseAdmin.from("photos").select("uploaded_at");
  if (error) throw error;

  const photosToday = (allPhotos ?? []).filter(
    (p) => new Date(p.uploaded_at) >= startOfToday
  ).length;
  const photosYesterday = (allPhotos ?? []).filter(
    (p) => new Date(p.uploaded_at) >= startOfYesterday && new Date(p.uploaded_at) < startOfToday
  ).length;

  return {
    totalProjects: projects.length,
    activeProjects,
    doneProjects,
    totalTechnicians: technicians.length,
    activeTechnicians: activeTechnicianIds.size,
    photosToday,
    photosYesterday,
    incompleteProjects,
  };
}
