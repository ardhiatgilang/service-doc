"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = { error: null, success: false };

export default function AdminPengaturanPage() {
  const [state, formAction, isSubmitting] = useActionState(changePasswordAction, initialState);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500">Kelola akun admin support Anda.</p>
      </div>

      <form
        action={formAction}
        className="flex max-w-md flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-slate-700">Ganti Password</h2>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Password Saat Ini</span>
          <input
            name="currentPassword"
            type="password"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Password Baru</span>
          <input
            name="newPassword"
            type="password"
            required
            minLength={6}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Konfirmasi Password Baru</span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </label>

        {state.error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            Password berhasil diperbarui.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Password"}
        </button>
      </form>
    </div>
  );
}
