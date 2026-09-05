import Link from "next/link";
import { getAllProjectsWithProgress, getAllTechnicians } from "@/lib/data";
import { filterProjects } from "@/lib/project-filters";
import { StatusPill } from "@/components/admin/StatusPill";
import { ProgressBar } from "@/components/ProgressBar";
import { formatDateID } from "@/lib/format";
import { ProjectFilters } from "@/components/admin/ProjectFilters";

const PAGE_SIZE = 10;

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4.5 w-4.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; teknisi?: string; status?: string; page?: string }>;
}) {
  const { q = "", teknisi = "semua", status = "semua", page = "1" } = await searchParams;
  const [projects, technicians] = await Promise.all([
    getAllProjectsWithProgress(),
    getAllTechnicians(),
  ]);
  const filtered = filterProjects(projects, { q, teknisi, status });

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  const exportQuery = new URLSearchParams({ q, teknisi, status }).toString();

  function pageHref(p: number) {
    const params = new URLSearchParams({ q, teknisi, status, page: String(p) });
    return `/admin/projects?${params.toString()}`;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project</h1>
          <p className="text-sm text-slate-500">Kelola dan pantau seluruh project servis.</p>
        </div>
        <a
          href={`/api/admin/export?${exportQuery}`}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Export CSV
        </a>
      </div>

      <ProjectFilters technicians={technicians} current={{ q, teknisi, status }} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="px-5 py-3 font-medium">Kode Project</th>
                <th className="px-5 py-3 font-medium">Nama Project</th>
                <th className="px-5 py-3 font-medium">Teknisi</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((project) => (
                <tr key={project.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{project.kode_project}</td>
                  <td className="px-5 py-3 text-slate-700">{project.nama_project}</td>
                  <td className="px-5 py-3 text-slate-700">{project.technician.name}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDateID(project.tanggal)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar percent={project.progressPercent} className="w-24" />
                      <span className="text-xs text-slate-500">{project.progressPercent}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill project={project} />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-blue-600"
                      aria-label="Lihat detail"
                    >
                      <EyeIcon />
                    </Link>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    Tidak ada project yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 border-t border-slate-100 px-5 py-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                  p === clampedPage ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
