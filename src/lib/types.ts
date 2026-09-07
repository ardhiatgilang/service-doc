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

export type Photo = {
  id: string;
  project_id: string;
  file_path: string;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type ProjectWithStats = Project & {
  technician: Technician;
  photoCount: number;
};
