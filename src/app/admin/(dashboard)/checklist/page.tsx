import Link from "next/link";
import { getAllProjectsWithStats } from "@/lib/data";
import { ProgressBar } from "@/components/ProgressBar";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";

export default async function AdminChecklistPage() {
  const projects = await getAllProjectsWithStats();
  const incomplete = projects.filter((p) => p.photoCount < MAX_PHOTOS_PER_PROJECT);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Checklist</h1>
        <p className="text-sm text-slate-500">Project yang dokumentasi fotonya masih belum penuh.</p>
      </div>

      <div className="flex flex-col gap-4">
        {incomplete.map((project) => {
          const remaining = MAX_PHOTOS_PER_PROJECT - project.photoCount;
          return (
            <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">{project.kode_project}</p>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {project.nama_project}
                  </Link>
                  <p className="text-xs text-slate-500">{project.technician.name}</p>
                </div>
                <span className="whitespace-nowrap text-xs font-semibold text-amber-600">
                  {project.photoCount}/{MAX_PHOTOS_PER_PROJECT} Foto — kurang {remaining}
                </span>
              </div>
              <ProgressBar percent={(project.photoCount / MAX_PHOTOS_PER_PROJECT) * 100} />
            </div>
          );
        })}
        {incomplete.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            Semua project sudah lengkap dokumentasinya.
          </p>
        )}
      </div>
    </div>
  );
}
