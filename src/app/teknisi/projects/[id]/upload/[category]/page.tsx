import { notFound, redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getProjectWithProgress } from "@/lib/data";
import { categoryLabel, isCategoryKey } from "@/lib/categories";
import { UploadWizard } from "@/components/teknisi/UploadWizard";

export default async function TeknisiUploadCategoryPage({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const { id, category } = await params;
  if (!isCategoryKey(category)) notFound();

  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const project = await getProjectWithProgress(id);
  if (!project || project.technician_id !== session.technicianId) notFound();

  const categoryProgress = project.categories.find((c) => c.category === category);
  if (!categoryProgress) notFound();

  return (
    <UploadWizard
      projectId={project.id}
      projectLabel={`${project.kode_project} - ${project.nama_project}`}
      categoryKey={category}
      categoryLabel={categoryLabel(category)}
      requiredCount={categoryProgress.requiredCount}
      alreadyUploaded={categoryProgress.uploadedCount}
    />
  );
}
