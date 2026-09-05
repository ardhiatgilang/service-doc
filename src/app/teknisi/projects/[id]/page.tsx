import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getProjectWithProgress } from "@/lib/data";
import { ProgressBar } from "@/components/ProgressBar";
import { CategoryRow } from "@/components/teknisi/CategoryRow";

export default async function TeknisiProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const project = await getProjectWithProgress(id);
  if (!project || project.technician_id !== session.technicianId) notFound();

  const firstIncomplete = project.categories.find((c) => !c.complete);

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-8">
      <div className="flex items-center gap-3">
        <Link
          href="/teknisi/projects"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold text-slate-400">{project.kode_project}</p>
          <h1 className="font-bold text-slate-900">
            {project.nama_project}
            {project.lokasi ? ` - ${project.lokasi}` : ""}
          </h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Kelengkapan Dokumentasi</h2>
          <span className="text-sm font-bold text-blue-600">{project.progressPercent}%</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">
          {project.completedCategories} dari {project.totalCategories} kategori
        </p>
        <ProgressBar percent={project.progressPercent} className="mt-3" />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Kategori Foto</h3>
        <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {project.categories.map((cat) => (
            <CategoryRow key={cat.category} projectId={project.id} category={cat} />
          ))}
        </div>
      </div>

      {firstIncomplete && (
        <Link
          href={`/teknisi/projects/${project.id}/upload/${firstIncomplete.category}`}
          className="rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          PILIH KATEGORI
        </Link>
      )}
    </div>
  );
}
