import { redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getProjectsForTechnician } from "@/lib/data";
import { ProjectListCard } from "@/components/teknisi/ProjectListCard";

export default async function TeknisiDokumentasiPage() {
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const projects = await getProjectsForTechnician(session.technicianId);
  const sorted = [...projects].sort((a, b) => b.photoCount - a.photoCount);

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Dokumentasi Saya</h1>
        <p className="text-sm text-slate-500">Lihat kelengkapan dokumentasi tiap project.</p>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
            Belum ada project.
          </p>
        )}
        {sorted.map((project) => (
          <ProjectListCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
