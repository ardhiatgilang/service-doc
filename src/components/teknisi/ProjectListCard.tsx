import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import type { ProjectWithProgress } from "@/lib/types";

function ctaLabel(project: ProjectWithProgress) {
  if (project.progressPercent === 100) return "LIHAT DOKUMENTASI";
  if (project.progressPercent === 0) return "MULAI UPLOAD";
  return "LANJUT UPLOAD";
}

function badgeClasses(percent: number) {
  if (percent === 100) return "bg-emerald-100 text-emerald-700";
  if (percent === 0) return "bg-slate-100 text-slate-500";
  return "bg-amber-100 text-amber-700";
}

export function ProjectListCard({ project }: { project: ProjectWithProgress }) {
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
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClasses(
            project.progressPercent
          )}`}
        >
          {project.progressPercent}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ProgressBar percent={project.progressPercent} className="flex-1" />
        <span className="whitespace-nowrap text-[11px] text-slate-400">
          Dokumentasi {project.completedCategories}/{project.totalCategories}
        </span>
      </div>
      <span className="text-right text-xs font-semibold text-blue-600">{ctaLabel(project)} →</span>
    </Link>
  );
}
