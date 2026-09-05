import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectWithProgress, getPhotosForProject } from "@/lib/data";
import { categoryLabel } from "@/lib/categories";
import { photoPublicUrl } from "@/lib/supabase";
import { formatDateID } from "@/lib/format";
import { StatusPill } from "@/components/admin/StatusPill";

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-1 font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function StatusDot({ complete, required }: { complete: boolean; required: boolean }) {
  if (complete) return <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />;
  if (required) return <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />;
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />;
}

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectWithProgress(id);
  if (!project) notFound();

  const photos = await getPhotosForProject(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
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
            <h1 className="text-lg font-bold text-slate-900">{project.nama_project}</h1>
          </div>
        </div>
        <a
          href={`/api/admin/projects/${project.id}/zip`}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
          </svg>
          Download ZIP
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Detail Project</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Info
              label="Teknisi"
              value={`${project.technician.name} (${project.technician.nip})`}
            />
            <Info label="Lokasi" value={project.lokasi ?? "-"} />
            <Info label="Tanggal" value={formatDateID(project.tanggal)} />
            <div>
              <dt className="text-xs text-slate-400">Status</dt>
              <dd className="mt-1">
                <StatusPill project={project} />
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <dt className="text-xs text-slate-400">Deskripsi</dt>
            <dd className="mt-1 text-sm text-slate-700">{project.deskripsi ?? "-"}</dd>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Kategori Foto</h2>
            <span className="text-xs font-semibold text-blue-600">{project.progressPercent}%</span>
          </div>
          <ul className="flex flex-col gap-3">
            {project.categories.map((cat) => (
              <li key={cat.category} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-700">
                  <StatusDot complete={cat.complete} required={cat.requiredCount != null} />
                  {categoryLabel(cat.category)}
                </span>
                <span className="text-xs text-slate-400">
                  {cat.requiredCount != null && !cat.complete
                    ? `${cat.uploadedCount}/${cat.requiredCount}`
                    : `${cat.uploadedCount}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {project.categories.map((cat) => {
          const categoryPhotos = photos.filter((p) => p.category === cat.category);
          return (
            <div key={cat.category} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                {categoryLabel(cat.category)} ({categoryPhotos.length}
                {cat.requiredCount != null ? `/${cat.requiredCount}` : ""} Foto)
              </h3>
              {categoryPhotos.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                  Belum ada foto pada kategori ini.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {categoryPhotos.map((photo) => (
                    <a
                      key={photo.id}
                      href={photoPublicUrl(photo.file_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-lg border border-slate-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPublicUrl(photo.file_path)}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
