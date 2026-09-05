import Link from "next/link";
import { getAllProjectsWithProgress } from "@/lib/data";
import { categoryLabel } from "@/lib/categories";

export default async function AdminChecklistPage() {
  const projects = await getAllProjectsWithProgress();
  const incomplete = projects.filter((p) => p.progressPercent < 100);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Checklist</h1>
        <p className="text-sm text-slate-500">Kategori dokumentasi yang masih perlu dilengkapi.</p>
      </div>

      <div className="flex flex-col gap-4">
        {incomplete.map((project) => (
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
              </div>
              <span className="text-xs font-semibold text-amber-600">{project.progressPercent}%</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {project.categories
                .filter((c) => !c.complete)
                .map((c) => (
                  <li
                    key={c.category}
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                  >
                    {categoryLabel(c.category)}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {incomplete.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            Semua project sudah lengkap dokumentasinya.
          </p>
        )}
      </div>
    </div>
  );
}
