import { getAllProjectsWithProgress, getAllTechnicians } from "@/lib/data";

export default async function AdminLaporanPage() {
  const [projects, technicians] = await Promise.all([
    getAllProjectsWithProgress(),
    getAllTechnicians(),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Laporan</h1>
          <p className="text-sm text-slate-500">Ringkasan performa dokumentasi per teknisi.</p>
        </div>
        <a
          href="/api/admin/export"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Export Semua (CSV)
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="px-5 py-3 font-medium">Teknisi</th>
                <th className="px-5 py-3 font-medium">Total Project</th>
                <th className="px-5 py-3 font-medium">Aktif</th>
                <th className="px-5 py-3 font-medium">Selesai</th>
                <th className="px-5 py-3 font-medium">Rata-rata Progress</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((t) => {
                const own = projects.filter((p) => p.technician_id === t.id);
                const active = own.filter((p) => p.status === "aktif").length;
                const done = own.filter((p) => p.status === "selesai").length;
                const avg = own.length
                  ? Math.round(own.reduce((sum, p) => sum + p.progressPercent, 0) / own.length)
                  : 0;
                return (
                  <tr key={t.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-slate-800">{t.name}</td>
                    <td className="px-5 py-3 text-slate-600">{own.length}</td>
                    <td className="px-5 py-3 text-slate-600">{active}</td>
                    <td className="px-5 py-3 text-slate-600">{done}</td>
                    <td className="px-5 py-3 text-slate-600">{avg}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
