import { getAllTechnicians, getAllProjectsWithProgress } from "@/lib/data";

export default async function AdminTeknisiPage() {
  const [technicians, projects] = await Promise.all([
    getAllTechnicians(),
    getAllProjectsWithProgress(),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Teknisi</h1>
        <p className="text-sm text-slate-500">Daftar teknisi dan jumlah project yang ditangani.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {technicians.map((t) => {
          const own = projects.filter((p) => p.technician_id === t.id);
          const active = own.filter((p) => p.status === "aktif").length;
          const done = own.filter((p) => p.status === "selesai").length;
          return (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">NIP: {t.nip}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                <div className="rounded-lg bg-slate-50 py-2">
                  <p className="font-bold text-slate-900">{active}</p>
                  <p className="text-xs text-slate-500">Aktif</p>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                  <p className="font-bold text-slate-900">{done}</p>
                  <p className="text-xs text-slate-500">Selesai</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
