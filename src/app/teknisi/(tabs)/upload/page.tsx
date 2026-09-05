import { redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getProjectsForTechnician } from "@/lib/data";
import { ProjectListCard } from "@/components/teknisi/ProjectListCard";

export default async function TeknisiUploadPage() {
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const projects = await getProjectsForTechnician(session.technicianId);
  const needsUpload = projects.filter(
    (p) => p.status === "aktif" && p.progressPercent < 100
  );

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Upload Dokumentasi</h1>
        <p className="text-sm text-slate-500">Pilih project yang belum lengkap dokumentasinya.</p>
      </div>

      <div className="flex flex-col gap-3">
        {needsUpload.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
            Semua project aktif sudah lengkap dokumentasinya.
          </p>
        )}
        {needsUpload.map((project) => (
          <ProjectListCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
