import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { projectStatusLabel } from "@/lib/project-status";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";
import type { ProjectWithStats } from "@/lib/types";

function ctaLabel(project: ProjectWithStats) {
  if (project.photoCount >= MAX_PHOTOS_PER_PROJECT) return "LIHAT DOKUMENTASI";
  if (project.photoCount === 0) return "MULAI UPLOAD";
  return "LANJUT UPLOAD";
}

export function ProjectListCard({ project }: { project: ProjectWithStats }) {
  const { label, className } = projectStatusLabel(project);

  return (
    <Link
      href={`/teknisi/projects/${project.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-400">{project.kode_project}</p>
          <p className="font-semibold text-slate-900">{project.nama_project}</p>
          <p className="text-xs text-slate-500">{project.lokasi}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ProgressBar
          percent={(project.photoCount / MAX_PHOTOS_PER_PROJECT) * 100}
          className="flex-1"
        />
        <span className="whitespace-nowrap text-[11px] text-slate-400">
          {project.photoCount}/{MAX_PHOTOS_PER_PROJECT} Foto
        </span>
      </div>
      <span className="text-right text-xs font-semibold text-blue-600">{ctaLabel(project)} →</span>
    </Link>
  );
}
