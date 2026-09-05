import { redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getTechnicianById, getProjectsForTechnician } from "@/lib/data";
import { logoutTechnicianAction } from "./actions";

export default async function TeknisiProfilPage() {
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const [technician, projects] = await Promise.all([
    getTechnicianById(session.technicianId),
    getProjectsForTechnician(session.technicianId),
  ]);
  if (!technician) redirect("/teknisi/login");

  const activeCount = projects.filter((p) => p.status === "aktif").length;
  const doneCount = projects.filter((p) => p.status === "selesai").length;

  return (
    <div className="flex flex-col gap-5 px-4 pt-6">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          {technician.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <h1 className="text-lg font-bold text-slate-900">{technician.name}</h1>
        <p className="text-sm text-slate-500">NIP: {technician.nip}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
          <p className="text-xs text-slate-500">Project Aktif</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{doneCount}</p>
          <p className="text-xs text-slate-500">Project Selesai</p>
        </div>
      </div>

      <form action={logoutTechnicianAction}>
        <button
          type="submit"
          className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Keluar
        </button>
      </form>
    </div>
  );
}
