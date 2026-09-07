"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { formatDateTimeID } from "@/lib/format";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/constants";

type Props = {
  projectId: string;
  projectLabel: string;
  alreadyUploaded: number;
};

type SelectedFile = { file: File; previewUrl: string; id: string };

export function UploadWizard({ projectId, projectLabel, alreadyUploaded }: Props) {
  const remainingSlots = Math.max(0, MAX_PHOTOS_PER_PROJECT - alreadyUploaded);
  const [selected, setSelected] = useState<SelectedFile[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ count: number; uploadedAt: string } | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    setSelected((prev) => {
      const room = remainingSlots - prev.length;
      if (room <= 0) {
        setError(`Sudah mencapai batas maksimal ${MAX_PHOTOS_PER_PROJECT} foto per project.`);
        return prev;
      }
      const next = Array.from(fileList)
        .slice(0, room)
        .map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        }));
      if (fileList.length > room) {
        setError(`Hanya ${room} foto lagi yang bisa ditambahkan (maks ${MAX_PHOTOS_PER_PROJECT} per project).`);
      } else {
        setError(null);
      }
      return [...prev, ...next];
    });
  }

  function removeFile(id: string) {
    setSelected((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleUpload() {
    if (selected.length === 0) return;
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.set("projectId", projectId);
    selected.forEach((s) => formData.append("files", s.file));

    try {
      const res = await fetch("/api/teknisi/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal.");
      setResult({ count: data.uploadedCount, uploadedAt: data.uploadedAt });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
      setStatus("idle");
    }
  }

  if (status === "done" && result) {
    return (
      <div className="flex flex-col items-center gap-5 px-4 pt-10 pb-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Upload Berhasil!</h1>
          <p className="text-sm text-slate-500">{result.count} foto berhasil diupload</p>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Ringkasan</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <Row label="Project" value={projectLabel} />
            <Row label="Jumlah Foto" value={`${result.count} Foto`} />
            <Row label="Waktu Upload" value={formatDateTimeID(result.uploadedAt)} />
          </dl>
        </div>

        <Link
          href={`/teknisi/projects/${projectId}`}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          KEMBALI KE PROJECT
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-8">
      <div className="flex items-center gap-3">
        <Link
          href={`/teknisi/projects/${projectId}`}
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
        <h1 className="font-bold text-slate-900">{projectLabel}</h1>
      </div>

      <p className="text-sm text-slate-500">
        {alreadyUploaded}/{MAX_PHOTOS_PER_PROJECT} foto sudah diupload — sisa {remainingSlots} slot
      </p>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-8">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={remainingSlots === 0}
          className="flex flex-col items-center gap-2 text-blue-600 disabled:opacity-40"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 0 1 2-2h1.5l1-1.5h9l1 1.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
              />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </span>
          <span className="text-sm font-semibold">Ambil Foto</span>
        </button>
        <span className="text-xs text-slate-400">atau</span>
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={remainingSlots === 0}
          className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-40"
        >
          Pilih dari Galeri
        </button>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">
          Foto yang diupload ({selected.length})
        </h2>
        {selected.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
            Belum ada foto
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {selected.map((f) => (
              <div
                key={f.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.previewUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs leading-none text-white"
                  aria-label="Hapus foto"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={selected.length === 0 || status === "uploading"}
        className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {status === "uploading" ? "Mengupload..." : `UPLOAD (${selected.length})`}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
