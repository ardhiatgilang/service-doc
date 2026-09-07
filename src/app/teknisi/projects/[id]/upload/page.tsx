import { notFound, redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getProjectWithStats } from "@/lib/data";
import { UploadWizard } from "@/components/teknisi/UploadWizard";

export default async function TeknisiUploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const project = await getProjectWithStats(id);
  if (!project || project.technician_id !== session.technicianId) notFound();

  return (
    <UploadWizard
      projectId={project.id}
      projectLabel={`${project.kode_project} - ${project.nama_project}`}
      alreadyUploaded={project.photoCount}
    />
  );
}
