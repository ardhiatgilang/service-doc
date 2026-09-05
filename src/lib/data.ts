import "server-only";
import { supabaseAdmin } from "./supabase";
import type {
  Technician,
  Project,
  ProjectCategory,
  Photo,
  ProjectWithProgress,
  CategoryProgress,
} from "./types";

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

function buildProgress(categories: ProjectCategory[], photos: Photo[]) {
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  const result: CategoryProgress[] = sorted.map((cat) => {
    const uploadedCount = photos.filter((p) => p.category === cat.category).length;
    const complete =
      cat.required_count == null ? uploadedCount >= 1 : uploadedCount >= cat.required_count;
    return {
      category: cat.category,
      requiredCount: cat.required_count,
      uploadedCount,
      complete,
    };
  });
  const completedCategories = result.filter((c) => c.complete).length;
  const totalCategories = result.length;
  const progressPercent =
    totalCategories === 0 ? 0 : Math.round((completedCategories / totalCategories) * 100);
  return { categories: result, completedCategories, totalCategories, progressPercent };
}

async function attachProgress(
  projects: Project[],
  technicians: Map<string, Technician>
): Promise<ProjectWithProgress[]> {
  if (projects.length === 0) return [];
  const projectIds = projects.map((p) => p.id);

  const [{ data: allCategories, error: catErr }, { data: allPhotos, error: photoErr }] =
    await Promise.all([
      supabaseAdmin.from("project_categories").select("*").in("project_id", projectIds),
      supabaseAdmin.from("photos").select("*").in("project_id", projectIds),
    ]);
  if (catErr) throw catErr;
  if (photoErr) throw photoErr;

  return projects.map((project) => {
    const categories = (allCategories ?? []).filter((c) => c.project_id === project.id);
    const photos = (allPhotos ?? []).filter((p) => p.project_id === project.id);
    const progress = buildProgress(categories, photos);
    const technician = technicians.get(project.technician_id);
    if (!technician) {
      throw new Error(`Teknisi untuk project ${project.kode_project} tidak ditemukan`);
    }
    return { ...project, technician, ...progress };
  });
}

export async function getProjectsForTechnician(
  technicianId: string
): Promise<ProjectWithProgress[]> {
  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("technician_id", technicianId)
    .order("tanggal", { ascending: false });
  if (error) throw error;
  const technician = await getTechnicianById(technicianId);
  if (!technician) return [];
  const map = new Map([[technician.id, technician]]);
  return attachProgress(projects ?? [], map);
}

export async function getProjectWithProgress(
  projectId: string
): Promise<ProjectWithProgress | null> {
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
  const [withProgress] = await attachProgress([project], map);
  return withProgress;
}

export async function getAllProjectsWithProgress(): Promise<ProjectWithProgress[]> {
  const [{ data: projects, error }, technicians] = await Promise.all([
    supabaseAdmin.from("projects").select("*").order("tanggal", { ascending: false }),
    getAllTechnicians(),
  ]);
  if (error) throw error;
  const map = new Map(technicians.map((t) => [t.id, t]));
  return attachProgress(projects ?? [], map);
}

export async function getPhotosForProjectCategory(
  projectId: string,
  category: string
): Promise<Photo[]> {
  const { data, error } = await supabaseAdmin
    .from("photos")
    .select("*")
    .eq("project_id", projectId)
    .eq("category", category)
    .order("uploaded_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
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
  rows: { project_id: string; category: string; file_path: string; uploaded_by: string }[]
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
    getAllProjectsWithProgress(),
    getAllTechnicians(),
  ]);

  const activeProjects = projects.filter((p) => p.status === "aktif").length;
  const doneProjects = projects.filter((p) => p.status === "selesai").length;
  const incompleteProjects = projects.filter((p) => p.progressPercent < 100).length;
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
