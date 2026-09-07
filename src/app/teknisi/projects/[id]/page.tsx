import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTeknisiSession } from "@/lib/session";
import { getProjectWithStats, getPhotosForProject } from "@/lib/data";
import { photoPublicUrl } from "@/lib/supabase";
import { ProgressBar } from "@/components/ProgressBar";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";

export default async function TeknisiProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getTeknisiSession();
  if (!session) redirect("/teknisi/login");

  const project = await getProjectWithStats(id);
  if (!project || project.technician_id !== session.technicianId) notFound();

  const photos = await getPhotosForProject(id);
  const canUploadMore = project.photoCount < MAX_PHOTOS_PER_PROJECT;

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-8">
      <div className="flex items-center gap-3">
        <Link
          href="/teknisi/projects"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold text-slate-400">{project.kode_project}</p>
          <h1 className="font-bold text-slate-900">
            {project.nama_project}
            {project.lokasi ? ` - ${project.lokasi}` : ""}
          </h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Dokumentasi Foto</h2>
          <span className="text-sm font-bold text-blue-600">
            {project.photoCount}/{MAX_PHOTOS_PER_PROJECT} Foto
          </span>
        </div>
        <ProgressBar
          percent={(project.photoCount / MAX_PHOTOS_PER_PROJECT) * 100}
          className="mt-3"
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          Foto Terupload ({photos.length})
        </h3>
        {photos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
            Belum ada foto.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-lg border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPublicUrl(photo.file_path)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {canUploadMore && (
        <Link
          href={`/teknisi/projects/${project.id}/upload`}
          className="rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          UPLOAD FOTO
        </Link>
      )}
    </div>
  );
}
