import Link from "next/link";
import { redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getTechnicianById, getProjectsForTechnician } from "@/lib/data";
import { ProjectListCard } from "@/components/teknisi/ProjectListCard";

export default async function TeknisiProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab, q = "" } = await searchParams;
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const [technician, projects] = await Promise.all([
    getTechnicianById(session.technicianId),
    getProjectsForTechnician(session.technicianId),
  ]);
  if (!technician) redirect("/teknisi/login");

  const activeProjects = projects.filter((p) => p.status === "aktif");
  const doneProjects = projects.filter((p) => p.status === "selesai");
  const activeTab = tab === "selesai" ? "selesai" : "aktif";
  const query = q.trim().toLowerCase();

  const list = (activeTab === "aktif" ? activeProjects : doneProjects).filter((p) =>
    query
      ? p.nama_project.toLowerCase().includes(query) ||
        p.kode_project.toLowerCase().includes(query) ||
        (p.lokasi ?? "").toLowerCase().includes(query)
      : true
  );

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Halo,</p>
          <h1 className="text-lg font-bold text-slate-900">{technician.name}</h1>
          <p className="text-xs text-slate-400">NIP: {technician.nip}</p>
        </div>
        <Link
          href="/teknisi/profil"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Link>
      </div>

      <h2 className="text-base font-semibold text-slate-900">Project Saya</h2>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-sm font-medium">
        <Link
          href="/teknisi/projects?tab=aktif"
          className={`flex-1 rounded-lg py-2 text-center transition ${
            activeTab === "aktif" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
          }`}
        >
          Aktif ({activeProjects.length})
        </Link>
        <Link
          href="/teknisi/projects?tab=selesai"
          className={`flex-1 rounded-lg py-2 text-center transition ${
            activeTab === "selesai" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
          }`}
        >
          Selesai ({doneProjects.length})
        </Link>
      </div>

      <form method="get" action="/teknisi/projects" className="relative">
        <input type="hidden" name="tab" value={activeTab} />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari project..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
      </form>

      <div className="flex flex-col gap-3">
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
            Tidak ada project.
          </p>
        )}
        {list.map((project) => (
          <ProjectListCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
