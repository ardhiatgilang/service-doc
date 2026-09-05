export type CategoryKey =
  | "before_service"
  | "nameplate"
  | "during_service"
  | "after_service"
  | "sparepart";

export type ProjectStatus = "aktif" | "selesai";

export type Technician = {
  id: string;
  nip: string;
  name: string;
};

export type Project = {
  id: string;
  kode_project: string;
  nama_project: string;
  lokasi: string | null;
  deskripsi: string | null;
  technician_id: string;
  tanggal: string;
  status: ProjectStatus;
};

export type ProjectCategory = {
  id: string;
  project_id: string;
  category: CategoryKey;
  required_count: number | null;
  sort_order: number;
};

export type Photo = {
  id: string;
  project_id: string;
  category: CategoryKey;
  file_path: string;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type CategoryProgress = {
  category: CategoryKey;
  requiredCount: number | null;
  uploadedCount: number;
  complete: boolean;
};

export type ProjectWithProgress = Project & {
  technician: Technician;
  categories: CategoryProgress[];
  completedCategories: number;
  totalCategories: number;
  progressPercent: number;
};
