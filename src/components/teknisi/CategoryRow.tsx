import Link from "next/link";
import type { CategoryProgress } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";

function countLabel(cat: CategoryProgress) {
  if (cat.requiredCount == null) return `${cat.uploadedCount} Foto`;
  if (cat.complete) return `${cat.uploadedCount} Foto`;
  return `${cat.uploadedCount}/${cat.requiredCount} Foto`;
}

function StatusIcon({ cat }: { cat: CategoryProgress }) {
  if (cat.complete) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="h-3.5 w-3.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (cat.requiredCount != null) {
    return <span className="h-6 w-6 shrink-0 rounded-full border-[3px] border-amber-400 bg-amber-50" />;
  }
  return <span className="h-6 w-6 shrink-0 rounded-full border-[3px] border-slate-200" />;
}

export function CategoryRow({
  projectId,
  category,
}: {
  projectId: string;
  category: CategoryProgress;
}) {
  return (
    <Link
      href={`/teknisi/projects/${projectId}/upload/${category.category}`}
      className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50"
    >
      <StatusIcon cat={category} />
      <span className="flex-1 text-sm font-medium text-slate-800">
        {categoryLabel(category.category)}
      </span>
      <span className="text-xs text-slate-400">{countLabel(category)}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-4 w-4 shrink-0 text-slate-300"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}
