"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { loginTechnicianAction, lookupTechnicianAction, type TeknisiLoginState } from "./actions";

const initialState: TeknisiLoginState = { error: null };

type LookupResult = { nip: string; name: string };

export default function TeknisiLoginPage() {
  const [state, formAction, isSubmitting] = useActionState(loginTechnicianAction, initialState);
  const [nip, setNip] = useState("");
  const [found, setFound] = useState<LookupResult | null>(null);
  const [notFoundNip, setNotFoundNip] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = nip.trim();
    if (!trimmed) return;

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const result = await lookupTechnicianAction(trimmed);
        if (result) {
          setFound({ nip: trimmed, name: result.name });
          setNotFoundNip(null);
        } else {
          setFound(null);
          setNotFoundNip(trimmed);
        }
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, [nip]);

  const trimmedNip = nip.trim();
  const name = found && found.nip === trimmedNip ? found.name : "";
  const lookupStatus: "idle" | "checking" | "found" | "notfound" = !trimmedNip
    ? "idle"
    : found && found.nip === trimmedNip
      ? "found"
      : notFoundNip === trimmedNip
        ? "notfound"
        : "checking";

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
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
          <h1 className="text-lg font-bold text-slate-900">SERVICE DOC</h1>
          <p className="text-xs text-slate-500">Dokumentasi Servis Teknisi</p>
        </div>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-700">Pilih ID Teknisi</h2>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">NIP</span>
            <div className="relative">
              <input
                name="nip"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Masukkan NIP"
                autoComplete="off"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {lookupStatus === "found" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              )}
            </div>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Nama Teknisi</span>
            <input
              value={name}
              readOnly
              placeholder="Nama akan terisi otomatis"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none placeholder:text-slate-400"
            />
          </label>

          {lookupStatus === "found" && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              Data ditemukan!
            </div>
          )}
          {lookupStatus === "notfound" && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              NIP tidak ditemukan.
            </div>
          )}
          {state.error && lookupStatus !== "notfound" && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={lookupStatus !== "found" || isSubmitting}
            className="mt-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Memproses..." : "MASUK"}
          </button>

          <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-700">
            Pilih ID Teknisi (NIP) Anda. Nama akan terisi otomatis berdasarkan data.
          </p>
        </form>
      </div>
    </main>
  );
}
