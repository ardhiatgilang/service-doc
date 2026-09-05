"use server";

import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/session";
import { getAdminByUsername } from "@/lib/data";
import { supabaseAdmin } from "@/lib/supabase";

export type ChangePasswordState = { error: string | null; success: boolean };

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await getAdminSession();
  if (!session) return { error: "Sesi tidak valid.", success: false };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Semua field wajib diisi.", success: false };
  }
  if (newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter.", success: false };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok.", success: false };
  }

  const admin = await getAdminByUsername(session.username);
  if (!admin) return { error: "Akun tidak ditemukan.", success: false };

  const valid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!valid) return { error: "Password saat ini salah.", success: false };

  const newHash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin
    .from("admins")
    .update({ password_hash: newHash })
    .eq("id", admin.id);
  if (error) return { error: "Gagal menyimpan password baru.", success: false };

  return { error: null, success: true };
}
