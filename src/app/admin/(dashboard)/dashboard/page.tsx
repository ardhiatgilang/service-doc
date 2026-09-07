import Link from "next/link";
import { getDashboardStats, getAllProjectsWithStats } from "@/lib/data";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { ProgressBar } from "@/components/ProgressBar";
import { formatDateID } from "@/lib/format";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <circle cx="9" cy="8" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19c0-3 2.7-5 6-5s6 2 6 5M15 8a3 3 0 1 0 0-.01M15 14c2.8.2 5 2 5 5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 0 1 2-2h1.5l1-1.5h9l1 1.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 4.4 2.5 18a1.5 1.5 0 0 0 1.3 2.2h16.4a1.5 1.5 0 0 0 1.3-2.2L13.7 4.4a1.5 1.5 0 0 0-2.6 0Z" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const [stats, projects] = await Promise.all([getDashboardStats(), getAllProjectsWithStats()]);
  const recent = projects.slice(0, 6);
  const photoDiff = stats.photosToday - stats.photosYesterday;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Ringkasan aktivitas dokumentasi servis.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Project"
          value={stats.totalProjects}
          sub={`Aktif: ${stats.activeProjects} / Selesai: ${stats.doneProjects}`}
          icon={<FolderIcon />}
        />
        <StatCard
          label="Total Teknisi"
          value={stats.totalTechnicians}
          sub={`Aktif: ${stats.activeTechnicians}`}
          icon={<UsersIcon />}
        />
        <StatCard
          label="Foto Hari Ini"
          value={stats.photosToday}
          sub={`${photoDiff >= 0 ? "+" : ""}${photoDiff} dari kemarin`}
          icon={<CameraIcon />}
        />
        <StatCard label="Belum Lengkap" value={stats.incompleteProjects} sub="Project" icon={<WarningIcon />} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">Project Terbaru</h2>
          <Link href="/admin/projects" className="text-xs font-semibold text-blue-600">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="px-5 py-3 font-medium">Kode Project</th>
                <th className="px-5 py-3 font-medium">Nama Project</th>
                <th className="px-5 py-3 font-medium">Teknisi</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Foto</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((project) => (
                <tr key={project.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/projects/${project.id}`} className="font-medium text-blue-600">
                      {project.kode_project}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{project.nama_project}</td>
                  <td className="px-5 py-3 text-slate-700">{project.technician.name}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDateID(project.tanggal)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar
                        percent={(project.photoCount / MAX_PHOTOS_PER_PROJECT) * 100}
                        className="w-24"
                      />
                      <span className="whitespace-nowrap text-xs text-slate-500">
                        {project.photoCount}/{MAX_PHOTOS_PER_PROJECT}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill project={project} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
