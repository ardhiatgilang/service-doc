import Link from "next/link";
import { getRecentPhotos, getAllProjectsWithStats } from "@/lib/data";
import { photoPublicUrl } from "@/lib/supabase";
import { formatDateTimeID } from "@/lib/format";

export default async function AdminDokumentasiPage() {
  const [photos, projects] = await Promise.all([
    getRecentPhotos(30),
    getAllProjectsWithStats(),
  ]);
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dokumentasi</h1>
        <p className="text-sm text-slate-500">Foto servis terbaru dari seluruh project.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {photos.map((photo) => {
          const project = projectMap.get(photo.project_id);
          return (
            <Link
              key={photo.id}
              href={project ? `/admin/projects/${project.id}` : "/admin/projects"}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPublicUrl(photo.file_path)}
                alt=""
                className="aspect-square w-full object-cover transition group-hover:opacity-90"
              />
              <div className="p-2">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {project?.kode_project ?? "-"}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {formatDateTimeID(photo.uploaded_at)}
                </p>
              </div>
            </Link>
          );
        })}
        {photos.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            Belum ada foto.
          </p>
        )}
      </div>
    </div>
  );
}
